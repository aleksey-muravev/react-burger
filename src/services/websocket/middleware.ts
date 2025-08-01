import { Middleware } from 'redux';
import { RootState, AppDispatch } from '../store';
import { getCookie } from '../../utils/cookie';
import { updateToken } from '../auth/actions';

export type TWsActions = {
  wsInit: string;
  wsUserInit: string;
  wsConnectionSuccess: string;
  wsConnectionError: string;
  wsConnectionClosed: string;
  wsGetMessage: string;
  wsInvalidTokenError: string;
};

export const socketMiddleware = (wsActions: TWsActions): Middleware<{}, RootState> => {
  return (store) => {
    let socket: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout;
    const RECONNECT_DELAY = 3000;
    const MAX_RECONNECT_ATTEMPTS = 3;
    let reconnectAttempt = 0;
    let isConnected = false;
    let url = '';
    let isUserConnection = false;
    let tokenRefreshInProgress = false;
    const BASE_WS_URL = 'wss://norma.nomoreparties.space';
    const USER_ORDERS_URL = '/orders';
    const ALL_ORDERS_URL = '/orders/all';

    const getCleanToken = (token: string | undefined): string | null => {
      if (!token) return null;
      return token.replace('Bearer ', '').trim();
    };

    const checkTokenExpiration = (token: string): boolean => {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.exp * 1000 > Date.now() + 30000; // 30 секунд запаса
      } catch {
        return false;
      }
    };

    const handleTokenRefresh = async (): Promise<string | null> => {
      if (tokenRefreshInProgress) return null;
      tokenRefreshInProgress = true;
      
      try {
        const result = await (store.dispatch as AppDispatch)(updateToken());
        const newToken = getCleanToken(result?.accessToken || getCookie('accessToken'));
        tokenRefreshInProgress = false;
        return newToken;
      } catch (err) {
        console.error('Token refresh failed:', err);
        store.dispatch({ type: wsActions.wsInvalidTokenError });
        tokenRefreshInProgress = false;
        return null;
      }
    };

    const connect = async (newUrl: string, isUser: boolean) => {
      if (isUser) {
        const token = getCleanToken(getCookie('accessToken'));
        if (!token || !checkTokenExpiration(token)) {
          const newToken = await handleTokenRefresh();
          if (!newToken) {
            store.dispatch({ type: wsActions.wsConnectionError, payload: 'Token refresh failed' });
            return;
          }
          url = `${BASE_WS_URL}${USER_ORDERS_URL}?token=${newToken}`;
        } else {
          url = newUrl;
        }
      } else {
        url = newUrl;
      }

      if (socket && (isUserConnection === isUser)) {
        socket.close(1000, 'Reconnecting');
      }

      isUserConnection = isUser;
      socket = new WebSocket(url);
      console.log(`[WS] Connecting to: ${url}`);

      socket.onopen = () => {
        isConnected = true;
        reconnectAttempt = 0;
        console.log('[WS] Connection established');
        clearTimeout(reconnectTimer);
        store.dispatch({ type: wsActions.wsConnectionSuccess });
      };

      socket.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.message === 'Invalid or missing token' || data.message === 'jwt expired') {
            console.error('[WS] Token error:', data.message);
            
            if (isUserConnection) {
              const newToken = await handleTokenRefresh();
              if (newToken) {
                connect(`${BASE_WS_URL}${USER_ORDERS_URL}?token=${newToken}`, true);
              }
            }
            return;
          }

          if (data.success) {
            store.dispatch({
              type: wsActions.wsGetMessage,
              payload: {
                orders: Array.isArray(data.orders) ? data.orders : [],
                total: data.total || 0,
                totalToday: data.totalToday || 0,
                isUser: isUserConnection
              }
            });
          }
        } catch (err) {
          console.error('[WS] Message error:', err);
        }
      };

      socket.onerror = (event) => {
        console.error('[WS] Error:', event);
        store.dispatch({ type: wsActions.wsConnectionError, payload: 'Connection error' });
      };

      socket.onclose = (event) => {
        console.log(`[WS] Closed, code: ${event.code}, reason: ${event.reason}`);
        console.log(`[WS] Reconnect attempt: ${reconnectAttempt}/${MAX_RECONNECT_ATTEMPTS}`);
        if (isConnected) {
          store.dispatch({ type: wsActions.wsConnectionClosed });
        }
        isConnected = false;
        
        if (event.code === 1000 || event.code === 4001) {
          return;
        }
        
        if ((isUserConnection || url.includes('/all')) && reconnectAttempt < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempt++;
          const delay = RECONNECT_DELAY * Math.pow(2, reconnectAttempt - 1);
          reconnectTimer = setTimeout(() => {
            if (isUserConnection) {
              const token = getCleanToken(getCookie('accessToken'));
              if (token) {
                connect(`${BASE_WS_URL}${USER_ORDERS_URL}?token=${token}`, true);
              }
            } else {
              connect(`${BASE_WS_URL}${ALL_ORDERS_URL}`, false);
            }
          }, delay);
        }
      };
    };

    return (next) => (action) => {
      const { dispatch } = store;

      if (action.type === wsActions.wsInit) {
        connect(`${BASE_WS_URL}${ALL_ORDERS_URL}`, false);
      }

      if (action.type === wsActions.wsUserInit) {
        const token = getCleanToken(action.payload || getCookie('accessToken'));
        if (token) {
          connect(`${BASE_WS_URL}${USER_ORDERS_URL}?token=${token}`, true);
        } else {
          dispatch({ type: wsActions.wsConnectionError, payload: 'Authorization required' });
        }
      }

      if (action.type === wsActions.wsConnectionClosed && socket) {
        clearTimeout(reconnectTimer);
        socket.close(1000, 'Normal closure');
        socket = null;
      }

      return next(action);
    };
  };
};