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
  UPDATE_USER_REQUEST,
  UPDATE_USER_SUCCESS,
  UPDATE_USER_FAILED
} from './types';

const initialState = {
  user: null,
  accessToken: null,
  loading: false,
  error: null,
  isAuthenticated: false
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case REGISTER_REQUEST:
    case LOGIN_REQUEST:
    case LOGOUT_REQUEST:
    case GET_USER_REQUEST:
    case UPDATE_TOKEN_REQUEST:
    case UPDATE_USER_REQUEST:
      return {
        ...state,
        loading: true,
        error: null
      };
    
    case REGISTER_SUCCESS:
    case LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        accessToken: action.payload.accessToken,
        loading: false,
        isAuthenticated: true,
        error: null
      };
    
    case GET_USER_SUCCESS:
    case UPDATE_USER_SUCCESS:
      return {
        ...state,
        user: action.payload,
        loading: false,
        isAuthenticated: true,
        error: null
      };
    
    case UPDATE_TOKEN_SUCCESS:
      return {
        ...state,
        accessToken: action.payload.accessToken,
        loading: false,
        error: null
      };
    
    case LOGOUT_SUCCESS:
      return {
        ...initialState
      };
    
    case REGISTER_FAILED:
    case LOGIN_FAILED:
    case LOGOUT_FAILED:
    case GET_USER_FAILED:
    case UPDATE_TOKEN_FAILED:
    case UPDATE_USER_FAILED:
      return {
        ...state,
        loading: false,
        error: action.payload,
        isAuthenticated: false
      };
    
    default:
      return state;
  }
};