import { orderDetailsReducer } from './reducer';
import {
  GET_ORDER_REQUEST,
  GET_ORDER_SUCCESS,
  GET_ORDER_FAILED,
  OrderDetailsState
} from './types';
import { Order } from '../../utils/types';

// Mock данные
const mockOrder: Order = {
  _id: '1',
  ingredients: ['ingredient1', 'ingredient2'],
  status: 'done',
  name: 'Test Burger',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  number: 12345
};

const initialState: OrderDetailsState = {
  order: null,
  loading: false,
  error: null
};

describe('order details reducer', () => {
  it('should return initial state', () => {
    expect(orderDetailsReducer(undefined, {} as any)).toEqual(initialState);
  });

  describe('order details fetching', () => {
    it('should handle GET_ORDER_REQUEST', () => {
      const action = { type: GET_ORDER_REQUEST };
      const state = orderDetailsReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('should handle GET_ORDER_SUCCESS', () => {
      const action = { 
        type: GET_ORDER_SUCCESS, 
        payload: mockOrder 
      };
      const state = orderDetailsReducer(initialState, action);
      expect(state).toEqual({
        order: mockOrder,
        loading: false,
        error: null
      });
    });

    it('should handle GET_ORDER_FAILED', () => {
      const error = 'Failed to fetch order details';
      const action = { 
        type: GET_ORDER_FAILED, 
        payload: error 
      };
      const state = orderDetailsReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error
      });
    });
  });

  it('should return current state for unknown action', () => {
    const currentState = { 
      order: mockOrder, 
      loading: false, 
      error: null 
    };
    expect(orderDetailsReducer(currentState, { type: 'UNKNOWN_ACTION' }))
      .toEqual(currentState);
  });
});