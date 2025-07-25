import { wsReducer } from './reducer';
import { WsActionTypes } from './types';
import { Order } from '../../utils/types';

const mockOrder: Order = {
  _id: '1',
  ingredients: ['ingredient1', 'ingredient2'],
  status: 'done',
  name: 'Test Burger',
  createdAt: '2023-01-01T00:00:00.000Z',
  updatedAt: '2023-01-01T00:00:00.000Z',
  number: 12345
};

const initialState = {
  wsConnected: false,
  orders: [],
  userOrders: [],
  total: 0,
  totalToday: 0,
  error: undefined
};

describe('websocket reducer', () => {
  it('should return initial state', () => {
    expect(wsReducer(undefined, {} as any)).toEqual(initialState);
  });

  it('should handle CONNECTION_SUCCESS', () => {
    const action = { type: WsActionTypes.CONNECTION_SUCCESS };
    const state = wsReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      wsConnected: true,
      error: undefined
    });
  });

  it('should handle CONNECTION_ERROR with string error', () => {
    const error = 'Connection error';
    const action = { 
      type: WsActionTypes.CONNECTION_ERROR, 
      payload: error 
    };
    const state = wsReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      wsConnected: false,
      error
    });
  });

  it('should handle CONNECTION_ERROR with Event error', () => {
    const error = new Event('WebSocket error');
    const action = { 
      type: WsActionTypes.CONNECTION_ERROR, 
      payload: error 
    };
    const state = wsReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      wsConnected: false,
      error
    });
  });

  it('should handle CONNECTION_CLOSED', () => {
    const connectedState = {
      ...initialState,
      wsConnected: true,
      orders: [mockOrder]
    };
    const state = wsReducer(connectedState, { 
      type: WsActionTypes.CONNECTION_CLOSED 
    });
    expect(state).toEqual({
      ...connectedState,
      wsConnected: false
    });
  });

  describe('GET_MESSAGE action', () => {
    const messagePayload = {
      orders: [mockOrder],
      total: 100,
      totalToday: 10,
      isUser: false
    };

    it('should handle GET_MESSAGE for public feed', () => {
      const action = {
        type: WsActionTypes.GET_MESSAGE,
        payload: messagePayload
      };
      const state = wsReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        orders: messagePayload.orders,
        userOrders: [],
        total: messagePayload.total,
        totalToday: messagePayload.totalToday
      });
    });

    it('should handle GET_MESSAGE for user feed', () => {
      const userMessage = {
        ...messagePayload,
        isUser: true
      };
      const action = {
        type: WsActionTypes.GET_MESSAGE,
        payload: userMessage
      };
      const state = wsReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        orders: [],
        userOrders: userMessage.orders,
        total: userMessage.total,
        totalToday: userMessage.totalToday
      });
    });
  });

  it('should handle INVALID_TOKEN_ERROR', () => {
    const action = { type: WsActionTypes.INVALID_TOKEN_ERROR };
    const state = wsReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      wsConnected: false,
      error: 'Invalid token'
    });
  });

  it('should ignore unknown action types', () => {
    const currentState = {
      ...initialState,
      wsConnected: true,
      orders: [mockOrder]
    };
    expect(wsReducer(currentState, { type: 'UNKNOWN_ACTION' }))
      .toEqual(currentState);
  });
});