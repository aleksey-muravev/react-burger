import { Order } from '../../utils/types';

export const GET_ORDER_REQUEST = 'GET_ORDER_REQUEST';
export const GET_ORDER_SUCCESS = 'GET_ORDER_SUCCESS';
export const GET_ORDER_FAILED = 'GET_ORDER_FAILED';

export interface OrderDetailsState {
  order: Order | null;
  loading: boolean;
  error: string | null;
}

export interface GetOrderRequestAction {
  type: typeof GET_ORDER_REQUEST;
}

export interface GetOrderSuccessAction {
  type: typeof GET_ORDER_SUCCESS;
  payload: Order;
}

export interface GetOrderFailedAction {
  type: typeof GET_ORDER_FAILED;
  payload: string;
}

export type OrderDetailsActionTypes = 
  | GetOrderRequestAction
  | GetOrderSuccessAction
  | GetOrderFailedAction;