import { 
  CREATE_ORDER_REQUEST, 
  CREATE_ORDER_SUCCESS, 
  CREATE_ORDER_FAILED, 
  CLEAR_ORDER 
} from './types';
import { requestWithRefresh } from '../../utils/api';
import { AppThunk } from '../../utils/types';
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
      
      if (!accessToken) throw new Error('Требуется авторизация');

      const data = await requestWithRefresh<OrderResponse>('/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': accessToken
        },
        body: JSON.stringify({ ingredients })
      }, dispatch);

      if (!data.success) {
        throw new Error(data.message || 'Ошибка сервера');
      }

      dispatch({ 
        type: CREATE_ORDER_SUCCESS, 
        payload: data.order 
      });
      return data.order;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Неизвестная ошибка';
      dispatch({ 
        type: CREATE_ORDER_FAILED, 
        payload: message.includes('jwt') ? 'Сессия истекла' : message 
      });
      throw err;
    }
  };

export const clearOrder = () => {
  return { type: CLEAR_ORDER } as const;
};