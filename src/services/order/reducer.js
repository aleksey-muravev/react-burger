import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILED,
  CLEAR_ORDER
} from './types';

const initialState = {
  order: null,       // { number, name, etc... }
  loading: false,    // статус загрузки
  error: null        // текст ошибки
};

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    // Запрос отправлен
    case CREATE_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,     // Сбрасываем предыдущие ошибки
        order: null      // Сбрасываем предыдущий заказ
      };

    // Заказ успешно создан
    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        order: action.payload  // Сохраняем весь ответ сервера
      };

    // Ошибка при создании заказа
    case CREATE_ORDER_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload, // Сохраняем текст ошибки
        order: null
      };

    // Сброс состояния заказа
    case CLEAR_ORDER:
      return initialState;

    default:
      return state;
  }
};