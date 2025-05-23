import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILED,
  CLEAR_ORDER
} from './types';
import { requestWithRefresh } from '../../utils/api';

export const createOrder = (ingredients) => async (dispatch, getState) => {
  dispatch({ type: CREATE_ORDER_REQUEST });
  
  try {
    const { accessToken } = getState().auth;
    if (!accessToken) throw new Error('Требуется авторизация');

    const ingredientsKey = ingredients.join(',');
    const data = await requestWithRefresh('/orders', {
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

    dispatch({ type: CREATE_ORDER_SUCCESS, payload: data });
    return { payload: data };
  } catch (err) {
    dispatch({ 
      type: CREATE_ORDER_FAILED, 
      payload: err.message.includes('jwt') 
        ? 'Сессия истекла' 
        : err.message 
    });
    throw err;
  }
};

export const clearOrder = () => {
  return { type: CLEAR_ORDER };
};