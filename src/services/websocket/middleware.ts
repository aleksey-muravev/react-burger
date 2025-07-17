import { Middleware } from 'redux';
import { RootState, AppDispatch } from '../store';
import {
  wsConnectionSuccess,
  wsConnectionError,
  wsConnectionClosed,
  wsGetMessage,
  wsInvalidTokenError
} from './actions';
import { getCookie } from '../../utils/cookie';
import { updateToken } from '../auth/actions';

export const socketMiddleware = (): Middleware<{}, RootState> => {
  return (store) => {
    let socket: WebSocket | null = null;
    let reconnectTimer: NodeJS.Timeout;
    const RECONNECT_DELAY = 3000;
    const MAX_RECONNECT_ATTEMPTS = 5;
    let reconnectAttempt = 0;
    let isConnected = false;
    let url = '';
    let isUserConnection = false;
    let lastMessageTime = 0;
    const MESSAGE_THROTTLE = 1000; // 1 секунда

    const getCleanToken = (token: string | undefined): string | null => {
      if (!token) return null;
      return token.replace('Bearer ', '').trim();
    };

    const handleTokenRefresh = async (): Promise<string | null> => {
      try {
        const result = await (store.dispatch as AppDispatch)(updateToken());
        const newToken = result?.accessToken || getCookie('accessToken');
        return getCleanToken(newToken);
      } catch (err) {
        console.error('Token refresh failed:', err);
        store.dispatch(wsInvalidTokenError());
        return null;
      }
    };

    const connect = (newUrl: string, isUser: boolean) => {
      isUserConnection = isUser;
      url = newUrl;
      
      if (socket) {
        socket.close();
      }

      socket = new WebSocket(newUrl);
      console.log(`[WS] Connecting to: ${newUrl}`);

      socket.onopen = () => {
        isConnected = true;
        reconnectAttempt = 0;
        console.log('[WS] Connection established');
        clearTimeout(reconnectTimer);
        store.dispatch(wsConnectionSuccess());
      };

      socket.onmessage = async (event) => {
        const now = Date.now();
        if (now - lastMessageTime < MESSAGE_THROTTLE) return;
        lastMessageTime = now;

        try {
          const data = JSON.parse(event.data);
          
          if (data.message === 'Invalid or missing token' || data.message === 'jwt expired') {
            console.error('[WS] Token error:', data.message);
            
            if (isUserConnection) {
              const newToken = await handleTokenRefresh();
              if (newToken) {
                connect(`wss://norma.nomoreparties.space/orders?token=${newToken}`, true);
              }
            }
            return;
          }

          if (data.success) {
            store.dispatch(wsGetMessage({
              orders: Array.isArray(data.orders) ? data.orders : [],
              total: data.total || 0,
              totalToday: data.totalToday || 0,
              isUser: isUserConnection
            }));
          }
        } catch (err) {
          console.error('[WS] Message error:', err);
        }
      };

      socket.onerror = (event) => {
        console.error('[WS] Error:', event);
        store.dispatch(wsConnectionError('Connection error'));
      };

      socket.onclose = (event) => {
        console.log(`[WS] Closed, code: ${event.code}, reason: ${event.reason}`);
        if (isConnected) {
          store.dispatch(wsConnectionClosed());
        }
        isConnected = false;
        
        if (event.code === 1000 || event.code === 4001) {
          return;
        }
        
        if ((isUserConnection || url.includes('/all')) && reconnectAttempt < MAX_RECONNECT_ATTEMPTS) {
          reconnectAttempt++;
          const delay = RECONNECT_DELAY * Math.pow(2, reconnectAttempt - 1); // Exponential backoff
          reconnectTimer = setTimeout(() => {
            if (isUserConnection) {
              const token = getCleanToken(getCookie('accessToken'));
              if (token) {
                connect(`wss://norma.nomoreparties.space/orders?token=${token}`, true);
              }
            } else {
              connect('wss://norma.nomoreparties.space/orders/all', false);
            }
          }, delay);
        }
      };
    };

    return (next) => (action) => {
      const { dispatch } = store;

      if (action.type === 'WS_CONNECTION_START') {
        connect('wss://norma.nomoreparties.space/orders/all', false);
      }

      if (action.type === 'WS_USER_CONNECTION_START') {
        const token = getCleanToken(action.payload || getCookie('accessToken'));
        if (token) {
          connect(`wss://norma.nomoreparties.space/orders?token=${token}`, true);
        } else {
          dispatch(wsConnectionError('Authorization required'));
        }
      }

      if (action.type === 'WS_CONNECTION_CLOSED' && socket) {
        clearTimeout(reconnectTimer);
        socket.close(1000, 'Normal closure');
        socket = null;
      }

      return next(action);
    };
  };
};