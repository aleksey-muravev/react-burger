import { Order } from '../../utils/types';
import { WsActionTypes, WsActions } from './types';

interface WsState {
  wsConnected: boolean;
  orders: Order[];
  userOrders: Order[];
  total: number;
  totalToday: number;
  error?: Event | string;
}

const initialState: WsState = {
  wsConnected: false,
  orders: [],
  userOrders: [],
  total: 0,
  totalToday: 0
};

export const wsReducer = (state = initialState, action: WsActions): WsState => {
  switch (action.type) {
    case WsActionTypes.CONNECTION_SUCCESS:
      return {
        ...state,
        wsConnected: true,
        error: undefined
      };

    case WsActionTypes.CONNECTION_ERROR:
      return {
        ...state,
        wsConnected: false,
        error: action.payload
      };

    case WsActionTypes.CONNECTION_CLOSED:
      return {
        ...state,
        wsConnected: false
      };

    case WsActionTypes.GET_MESSAGE:
      return {
        ...state,
        orders: action.payload.isUser ? state.orders : action.payload.orders,
        userOrders: action.payload.isUser ? action.payload.orders : state.userOrders,
        total: action.payload.total || 0,
        totalToday: action.payload.totalToday || 0
      };

    default:
      return state;
  }
};