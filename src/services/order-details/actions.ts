import {
  GET_ORDER_REQUEST,
  GET_ORDER_SUCCESS,
  GET_ORDER_FAILED
} from './types';
import { requestWithRefresh } from '../../utils/api';
import { AppThunk } from '../store';
import { Order } from '../../utils/types';

interface OrderResponse {
  success: boolean;
  orders: Order[];
  message?: string;
}

export const getOrder = (number: string): AppThunk => async (dispatch) => {
  dispatch({ type: GET_ORDER_REQUEST });

  try {
    const data = await requestWithRefresh<OrderResponse>(
      `/orders/${number}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      },
      dispatch
    );

    if (!data.success) {
      throw new Error(data.message || 'Server error');
    }

    dispatch({
      type: GET_ORDER_SUCCESS,
      payload: data.orders[0]
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    dispatch({
      type: GET_ORDER_FAILED,
      payload: message
    });
  }
};