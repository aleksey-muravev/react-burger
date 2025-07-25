import { orderReducer } from './reducer';
import {
  CREATE_ORDER_REQUEST,
  CREATE_ORDER_SUCCESS,
  CREATE_ORDER_FAILED,
  CLEAR_ORDER,
  OrderState
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

const initialState: OrderState = {
  order: null,
  loading: false,
  error: null
};

describe('order reducer', () => {
  it('should return initial state', () => {
    expect(orderReducer(undefined, {} as any)).toEqual(initialState);
  });

  describe('order creation', () => {
    it('should handle CREATE_ORDER_REQUEST', () => {
      const action = { type: CREATE_ORDER_REQUEST };
      const state = orderReducer(initialState, action);
      expect(state).toEqual({
        order: null,
        loading: true,
        error: null
      });
    });

    it('should handle CREATE_ORDER_SUCCESS', () => {
      const action = { 
        type: CREATE_ORDER_SUCCESS, 
        payload: mockOrder 
      };
      const state = orderReducer(initialState, action);
      expect(state).toEqual({
        order: mockOrder,
        loading: false,
        error: null
      });
    });

    it('should handle CREATE_ORDER_FAILED', () => {
      const error = 'Failed to create order';
      const action = { 
        type: CREATE_ORDER_FAILED, 
        payload: error 
      };
      const state = orderReducer(initialState, action);
      expect(state).toEqual({
        order: null,
        loading: false,
        error
      });
    });
  });

  describe('order clearing', () => {
    it('should handle CLEAR_ORDER', () => {
      const stateWithOrder = { 
        ...initialState, 
        order: mockOrder 
      };
      const state = orderReducer(stateWithOrder, { type: CLEAR_ORDER });
      expect(state).toEqual(initialState);
    });
  });
});