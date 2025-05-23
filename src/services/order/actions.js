import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILED,
  CLEAR_ORDER
} from './types';
import { request } from '../../utils/api';

export const createOrder = (ingredients) => async (dispatch) => {
  dispatch({ type: CREATE_ORDER_REQUEST });

  try {
    const data = await request('/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('accessToken') || ''
      },
      body: JSON.stringify({ ingredients })
    });

    if (!data.success) {
      const errorMessage = data.message || 'Не удалось оформить заказ';
      dispatch({
        type: CREATE_ORDER_FAILED,
        payload: errorMessage
      });
      return { error: errorMessage };
    }

    dispatch({
      type: CREATE_ORDER_SUCCESS,
      payload: data
    });

    return { payload: data };

  } catch (err) {
    const errorMessage = err.message || 'Ошибка сети при оформлении заказа';
    dispatch({
      type: CREATE_ORDER_FAILED,
      payload: errorMessage
    });
    return { error: errorMessage };
  }
};

export const clearOrder = () => ({
  type: CLEAR_ORDER
});