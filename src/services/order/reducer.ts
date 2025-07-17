import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILED,
  CLEAR_ORDER,
  OrderState,
  OrderActionTypes
} from './types';

const initialState: OrderState = {
  order: null,
  loading: false,
  error: null
};

export const orderReducer = (
  state = initialState, 
  action: OrderActionTypes
): OrderState => {
  switch (action.type) {
    case CREATE_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null,
        order: null
      };

    case CREATE_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
        order: action.payload
      };

    case CREATE_ORDER_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
        order: null
      };

    case CLEAR_ORDER:
      return initialState;

    default:
      return state;
  }
};