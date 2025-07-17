import { Order } from '../../utils/types';

export const CREATE_ORDER_REQUEST = 'CREATE_ORDER_REQUEST';
export const CREATE_ORDER_SUCCESS = 'CREATE_ORDER_SUCCESS';
export const CREATE_ORDER_FAILED = 'CREATE_ORDER_FAILED';
export const CLEAR_ORDER = 'CLEAR_ORDER';

export interface OrderState {
  order: Order | null;
  loading: boolean;
  error: string | null;
}

interface CreateOrderRequestAction {
  type: typeof CREATE_ORDER_REQUEST;
}

interface CreateOrderSuccessAction {
  type: typeof CREATE_ORDER_SUCCESS;
  payload: Order;
}

interface CreateOrderFailedAction {
  type: typeof CREATE_ORDER_FAILED;
  payload: string;
}

interface ClearOrderAction {
  type: typeof CLEAR_ORDER;
}

export type OrderActionTypes = 
  | CreateOrderRequestAction
  | CreateOrderSuccessAction
  | CreateOrderFailedAction
  | ClearOrderAction;