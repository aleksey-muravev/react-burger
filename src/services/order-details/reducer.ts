import {
  GET_ORDER_REQUEST,
  GET_ORDER_SUCCESS,
  GET_ORDER_FAILED,
  OrderDetailsState,
  OrderDetailsActionTypes
} from './types';

const initialState: OrderDetailsState = {
  order: null,
  loading: false,
  error: null
};

export const orderDetailsReducer = (
  state = initialState,
  action: OrderDetailsActionTypes
): OrderDetailsState => {
  switch (action.type) {
    case GET_ORDER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };

    case GET_ORDER_SUCCESS:
      return {
        ...state,
        loading: false,
        order: action.payload
      };

    case GET_ORDER_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload
      };

    default:
      return state;
  }
};