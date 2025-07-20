import { Order } from '../../utils/types';
import { 
  WsActionTypes,
  WsConnectionStart,
  WsUserConnectionStart,
  WsConnectionSuccess,
  WsConnectionError,
  WsConnectionClosed,
  WsGetMessage,
  WsInvalidTokenError
} from './types';

export const wsConnectionStart = (url: string): WsConnectionStart => ({
  type: WsActionTypes.CONNECTION_START,
  payload: url
});

export const wsUserConnectionStart = (token: string): WsUserConnectionStart => ({
  type: WsActionTypes.USER_CONNECTION_START,
  payload: token
});

export const wsConnectionSuccess = (): WsConnectionSuccess => ({
  type: WsActionTypes.CONNECTION_SUCCESS
});

export const wsConnectionError = (error: Event | string): WsConnectionError => ({
  type: WsActionTypes.CONNECTION_ERROR,
  payload: error
});

export const wsConnectionClosed = (): WsConnectionClosed => ({
  type: WsActionTypes.CONNECTION_CLOSED
});

export const wsGetMessage = (payload: {
  orders: Order[];
  total: number;
  totalToday: number;
  isUser: boolean;
}): WsGetMessage => ({
  type: WsActionTypes.GET_MESSAGE,
  payload
});

export const wsInvalidTokenError = (): WsInvalidTokenError => ({
  type: WsActionTypes.INVALID_TOKEN_ERROR
});