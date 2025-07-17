import { Order } from '../../utils/types';
import { WsActionTypes } from './types';

export const wsConnectionStart = (): { type: WsActionTypes.CONNECTION_START } => ({
  type: WsActionTypes.CONNECTION_START
});

export const wsUserConnectionStart = (token: string): { 
  type: WsActionTypes.USER_CONNECTION_START; 
  payload: string 
} => ({
  type: WsActionTypes.USER_CONNECTION_START,
  payload: token
});

export const wsConnectionSuccess = (): { type: WsActionTypes.CONNECTION_SUCCESS } => ({
  type: WsActionTypes.CONNECTION_SUCCESS
});

export const wsConnectionClosed = (): { type: WsActionTypes.CONNECTION_CLOSED } => ({
  type: WsActionTypes.CONNECTION_CLOSED
});

export const wsConnectionError = (error: Event | string): { 
  type: WsActionTypes.CONNECTION_ERROR; 
  payload: Event | string 
} => ({
  type: WsActionTypes.CONNECTION_ERROR,
  payload: error
});

export const wsGetMessage = (payload: {
  orders: Order[];
  total: number;
  totalToday: number;
  isUser: boolean;
}): { 
  type: WsActionTypes.GET_MESSAGE; 
  payload: {
    orders: Order[];
    total: number;
    totalToday: number;
    isUser: boolean;
  } 
} => ({
  type: WsActionTypes.GET_MESSAGE,
  payload
});

export const wsInvalidTokenError = (): { 
  type: WsActionTypes.INVALID_TOKEN_ERROR 
} => ({
  type: WsActionTypes.INVALID_TOKEN_ERROR
});