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
import { request, requestWithRefresh } from '../../utils/api';
import { AppThunk } from '../store';
import { User } from '../../utils/types';
import { setCookie, deleteCookie } from '../../utils/cookie';

interface AuthResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: User;
  message?: string;
}

interface UserResponse {
  success: boolean;
  user: User;
  message?: string;
}

let tokenUpdateInProgress: Promise<{ accessToken: string }> | null = null;
let userFetchInProgress: Promise<User> | null = null;

const ensureBearerToken = (token: string): string => {
  return token && !token.startsWith('Bearer ') ? `Bearer ${token}` : token;
};

export const register = (
  email: string,
  password: string,
  name: string
): AppThunk<Promise<AuthResponse>> => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const res = await request<AuthResponse>('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    
    const accessToken = ensureBearerToken(res.accessToken);
    setCookie('accessToken', accessToken, { expires: 20 * 60 });
    localStorage.setItem('refreshToken', res.refreshToken);
    
    dispatch({
      type: REGISTER_SUCCESS,
      payload: { user: res.user, accessToken }
    });
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ошибка регистрации';
    dispatch({ type: REGISTER_FAILED, payload: message });
    throw err;
  }
};

export const login = (
  email: string,
  password: string
): AppThunk<Promise<AuthResponse>> => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const res = await request<AuthResponse>('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const accessToken = ensureBearerToken(res.accessToken);
    setCookie('accessToken', accessToken, { expires: 20 * 60 });
    localStorage.setItem('refreshToken', res.refreshToken);
    
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user: res.user, accessToken }
    });
    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ошибка авторизации';
    dispatch({ type: LOGIN_FAILED, payload: message });
    throw err;
  }
};

export const logout = (): AppThunk<Promise<void>> => async (dispatch) => {
  dispatch({ type: LOGOUT_REQUEST });
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');
    
    await request('/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshToken })
    });
    
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ошибка выхода';
    dispatch({ type: LOGOUT_FAILED, payload: message });
    throw err;
  }
};

export const updateToken = (): AppThunk<Promise<{ accessToken: string }>> => async (dispatch) => {
  if (tokenUpdateInProgress) {
    return tokenUpdateInProgress;
  }

  dispatch({ type: UPDATE_TOKEN_REQUEST });
  try {
    tokenUpdateInProgress = (async () => {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) throw new Error('No refresh token');
      
      const res = await request<AuthResponse>('/auth/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: refreshToken })
      });
      
      const accessToken = ensureBearerToken(res.accessToken);
      setCookie('accessToken', accessToken, { expires: 20 * 60 });
      localStorage.setItem('refreshToken', res.refreshToken);
      
      dispatch({ 
        type: UPDATE_TOKEN_SUCCESS,
        payload: { accessToken }
      });
      return { accessToken };
    })();

    return await tokenUpdateInProgress;
  } catch (err) {
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
    dispatch({ type: UPDATE_TOKEN_FAILED, payload: 'Ошибка обновления токена' });
    throw err;
  } finally {
    tokenUpdateInProgress = null;
  }
};

export const getUser = (): AppThunk<Promise<User>> => async (dispatch, getState) => {
  if (userFetchInProgress) {
    return userFetchInProgress;
  }

  dispatch({ type: GET_USER_REQUEST });
  try {
    userFetchInProgress = (async () => {
      const { auth } = getState();
      let accessToken = auth.accessToken;
      
      if (!accessToken) {
        const { accessToken: newToken } = await dispatch(updateToken());
        accessToken = newToken;
      }

      const res = await requestWithRefresh<UserResponse>('/auth/user', {
        method: 'GET',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: accessToken 
        }
      }, dispatch);
      
      dispatch({ type: GET_USER_SUCCESS, payload: res.user });
      return res.user;
    })();

    return await userFetchInProgress;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ошибка получения пользователя';
    dispatch({ type: GET_USER_FAILED, payload: message });
    throw err;
  } finally {
    userFetchInProgress = null;
  }
};

export const updateUser = (
  userData: Partial<User>
): AppThunk<Promise<User>> => async (dispatch, getState) => {
  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const { auth } = getState();
    let accessToken = auth.accessToken;
    
    if (!accessToken) {
      const { accessToken: newToken } = await dispatch(updateToken());
      accessToken = newToken;
    }

    const res = await requestWithRefresh<UserResponse>('/auth/user', {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: accessToken 
      },
      body: JSON.stringify(userData)
    }, dispatch);
    
    dispatch({ type: UPDATE_USER_SUCCESS, payload: res.user });
    return res.user;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Ошибка обновления данных';
    dispatch({ type: UPDATE_USER_FAILED, payload: message });
    throw err;
  }
};