import { API_URL } from '../../utils/api';
import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILED,
  CLEAR_ORDER
} from './types';

export const createOrder = (ingredients) => async (dispatch) => {
  dispatch({ type: CREATE_ORDER_REQUEST });

  try {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('accessToken') || ''
      },
      body: JSON.stringify({ ingredients })
    });

    const data = await res.json();

    if (!res.ok || !data.success) {
      // Формируем ошибку вручную, чтобы не вызывать unhandled rejection
      const errorMessage = data.message || 'Не удалось оформить заказ';
      dispatch({
        type: CREATE_ORDER_FAILED,
        payload: errorMessage
      });
      return { error: errorMessage }; // Возвращаем объект с ошибкой
    }

    dispatch({
      type: CREATE_ORDER_SUCCESS,
      payload: data
    });

    return { payload: data }; // Успешный результат

  } catch (err) {
    // Обрабатываем сетевые ошибки и другие исключения
    const errorMessage = err.message || 'Ошибка сети при оформлении заказа';
    dispatch({
      type: CREATE_ORDER_FAILED,
      payload: errorMessage
    });
    return { error: errorMessage }; // Возвращаем объект с ошибкой
  }
};

export const clearOrder = () => ({
  type: CLEAR_ORDER
});