import { Order } from '../../utils/types';

export enum WsActionTypes {
  CONNECTION_START = 'WS_CONNECTION_START',
  USER_CONNECTION_START = 'WS_USER_CONNECTION_START',
  CONNECTION_SUCCESS = 'WS_CONNECTION_SUCCESS',
  CONNECTION_ERROR = 'WS_CONNECTION_ERROR',
  CONNECTION_CLOSED = 'WS_CONNECTION_CLOSED',
  GET_MESSAGE = 'WS_GET_MESSAGE',
  INVALID_TOKEN_ERROR = 'WS_INVALID_TOKEN_ERROR'
}

export interface WsConnectionStart {
  type: WsActionTypes.CONNECTION_START;
}

export interface WsUserConnectionStart {
  type: WsActionTypes.USER_CONNECTION_START;
  payload: string;
}

export interface WsConnectionSuccess {
  type: WsActionTypes.CONNECTION_SUCCESS;
}

export interface WsConnectionError {
  type: WsActionTypes.CONNECTION_ERROR;
  payload: Event | string;
}

export interface WsConnectionClosed {
  type: WsActionTypes.CONNECTION_CLOSED;
}

export interface WsGetMessage {
  type: WsActionTypes.GET_MESSAGE;
  payload: {
    orders: Order[];
    total: number;
    totalToday: number;
    isUser: boolean;
  };
}

export interface WsInvalidTokenError {
  type: WsActionTypes.INVALID_TOKEN_ERROR;
}

export type WsActions =
  | WsConnectionStart
  | WsUserConnectionStart
  | WsConnectionSuccess
  | WsConnectionError
  | WsConnectionClosed
  | WsGetMessage
  | WsInvalidTokenError;