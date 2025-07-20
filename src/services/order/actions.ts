import { 
  CREATE_ORDER_REQUEST, 
  CREATE_ORDER_SUCCESS, 
  CREATE_ORDER_FAILED,
  CLEAR_ORDER
} from './types';
import { requestWithRefresh } from '../../utils/api';
import { AppThunk } from '../store';
import { Order } from '../../utils/types';

interface OrderResponse {
  success: boolean;
  order: Order;
  message?: string;
}

export const createOrder = (ingredients: string[]): AppThunk<Promise<Order>> => 
  async (dispatch, getState) => {
    dispatch({ type: CREATE_ORDER_REQUEST });
    
    try {
      const { auth } = getState();
      const accessToken = auth.accessToken;
      
      if (!accessToken) throw new Error('Authorization required');

      const data = await requestWithRefresh<OrderResponse>(
        '/orders',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': accessToken
          },
          body: JSON.stringify({ ingredients })
        },
        dispatch
      );

      if (!data.success) {
        throw new Error(data.message || 'Server error');
      }

      dispatch({ 
        type: CREATE_ORDER_SUCCESS, 
        payload: data.order 
      });
      return data.order;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      dispatch({ 
        type: CREATE_ORDER_FAILED, 
        payload: message.includes('jwt') ? 'Session expired' : message 
      });
      throw err;
    }
  };

export const clearOrder = () => ({
  type: CLEAR_ORDER
});