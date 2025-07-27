// auth/reducer.test.ts
import { authReducer } from './reducer';
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT_SUCCESS,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILED,
  UPDATE_TOKEN_REQUEST,
  UPDATE_TOKEN_SUCCESS,
  UPDATE_TOKEN_FAILED,
  AuthState
} from './types';
import { User, AuthResponse } from '../../utils/types';

// Mock данные
const mockUser: User = {
  email: 'test@example.com',
  name: 'Test User'
};

const mockAuthResponse: AuthResponse = {
  success: true,
  accessToken: 'test-access-token',
  refreshToken: 'test-refresh-token',
  user: mockUser
};

const mockTokenResponse = {
  accessToken: 'new-access-token',
  refreshToken: 'new-refresh-token'
};

const initialState: AuthState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

describe('auth reducer', () => {
  it('should return initial state', () => {
    expect(authReducer(undefined, {} as any)).toEqual(initialState);
  });

  // Тесты для регистрации
  describe('register actions', () => {
    it('should handle REGISTER_REQUEST', () => {
      const action = { type: REGISTER_REQUEST };
      const state = authReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('should handle REGISTER_SUCCESS with valid payload', () => {
      const action = { 
        type: REGISTER_SUCCESS, 
        payload: {
          user: mockUser,
          accessToken: mockAuthResponse.accessToken
        } 
      };
      const state = authReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        user: mockUser,
        accessToken: mockAuthResponse.accessToken,
        loading: false,
        isAuthenticated: true,
        error: null
      });
    });

    it('should handle REGISTER_SUCCESS with invalid payload', () => {
      const action = { type: REGISTER_SUCCESS, payload: null };
      const state = authReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error: 'Invalid payload',
        isAuthenticated: false
      });
    });

    it('should handle REGISTER_FAILED', () => {
      const error = 'Registration failed';
      const action = { type: REGISTER_FAILED, payload: error };
      const state = authReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error,
        isAuthenticated: false
      });
    });
  });

  // Тесты для входа
  describe('login actions', () => {
    it('should handle LOGIN_SUCCESS', () => {
      const action = { 
        type: LOGIN_SUCCESS, 
        payload: {
          user: mockUser,
          accessToken: mockAuthResponse.accessToken
        } 
      };
      const state = authReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        user: mockUser,
        accessToken: mockAuthResponse.accessToken,
        loading: false,
        isAuthenticated: true,
        error: null
      });
    });
  });

  // Тесты для выхода
  describe('logout actions', () => {
    it('should handle LOGOUT_SUCCESS', () => {
      const loggedInState = {
        ...initialState,
        user: mockUser,
        accessToken: 'token',
        isAuthenticated: true
      };
      const state = authReducer(loggedInState, { type: LOGOUT_SUCCESS });
      expect(state).toEqual(initialState);
    });
  });

  // Тесты для получения пользователя
  describe('get user actions', () => {
    it('should handle GET_USER_SUCCESS', () => {
      const action = { type: GET_USER_SUCCESS, payload: mockUser };
      const state = authReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        user: mockUser,
        loading: false,
        isAuthenticated: true,
        error: null
      });
    });
  });

  // Тесты для обновления токена
  describe('update token actions', () => {
    it('should handle UPDATE_TOKEN_SUCCESS', () => {
      const action = { 
        type: UPDATE_TOKEN_SUCCESS, 
        payload: { accessToken: mockTokenResponse.accessToken } 
      };
      const state = authReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        accessToken: mockTokenResponse.accessToken,
        loading: false,
        isAuthenticated: true,
        error: null
      });
    });
  });
});