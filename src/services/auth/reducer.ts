import { User } from '../../utils/types'; 
import {
  REGISTER_REQUEST,
  REGISTER_SUCCESS,
  REGISTER_FAILED,
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILED,
  LOGOUT_REQUEST,
  LOGOUT_SUCCESS,
  LOGOUT_FAILED,
  GET_USER_REQUEST,
  GET_USER_SUCCESS,
  GET_USER_FAILED,
  UPDATE_TOKEN_REQUEST,
  UPDATE_TOKEN_SUCCESS,
  UPDATE_TOKEN_FAILED,
  AuthState,
  AuthActionTypes
} from './types';
import { setCookie, deleteCookie } from '../../utils/api';

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

interface TokenResponse {
  accessToken: string;
  refreshToken?: string;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

export const authReducer = (
  state = initialState,
  action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case LOGOUT_REQUEST:
    case GET_USER_REQUEST:
    case UPDATE_TOKEN_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS: {
      if (!action.payload) {
        return {
          ...state,
          loading: false,
          error: 'Invalid payload',
          isAuthenticated: false
        };
      }

      const { user, accessToken, refreshToken } = action.payload as AuthResponse;
      
      if (!accessToken) {
        return {
          ...state,
          loading: false,
          error: 'No access token provided',
          isAuthenticated: false
        };
      }

      setCookie('accessToken', accessToken, { expires: 20 * 60 });
      
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }

      return {
        ...state,
        user,
        accessToken,
        loading: false,
        isAuthenticated: true,
        error: null
      };
    }
    
    case UPDATE_TOKEN_SUCCESS: {
      if (!action.payload) {
        return {
          ...state,
          loading: false,
          error: 'Invalid token payload',
          isAuthenticated: false
        };
      }

      const { accessToken } = action.payload as TokenResponse;
      
      if (!accessToken) {
        return {
          ...state,
          loading: false,
          error: 'No access token provided',
          isAuthenticated: false
        };
      }

      setCookie('accessToken', accessToken, { expires: 20 * 60 });
      
      return {
        ...state,
        accessToken,
        loading: false,
        isAuthenticated: true,
        error: null
      };
    }
    
    case GET_USER_SUCCESS: {
      if (!action.payload) {
        return {
          ...state,
          loading: false,
          error: 'Invalid user data',
          isAuthenticated: false
        };
      }

      return {
        ...state,
        user: action.payload as User,
        loading: false,
        isAuthenticated: true,
        error: null
      };
    }
    
    case LOGOUT_SUCCESS:
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');
      return initialState;
    
    case REGISTER_FAILED:
    case LOGIN_FAILED:
    case LOGOUT_FAILED:
    case GET_USER_FAILED:
    case UPDATE_TOKEN_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload ? (action.payload as string) : 'Unknown error occurred',
        isAuthenticated: false,
        accessToken: null,
        user: null
      };
    
    default:
      return state;
  }
};