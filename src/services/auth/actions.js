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
import { request } from '../../utils/api';

const ensureBearerToken = (token) => {
  return token && !token.startsWith('Bearer ') ? `Bearer ${token}` : token;
};

// Регистрация пользователя
export const register = (email, password, name) => async (dispatch) => {
  dispatch({ type: REGISTER_REQUEST });
  try {
    const res = await request('/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    
    const accessToken = ensureBearerToken(res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    
    dispatch({
      type: REGISTER_SUCCESS,
      payload: { 
        user: res.user, 
        accessToken
      }
    });
    return res;
  } catch (err) {
    const errorMessage = err.message === 'User already exists' 
      ? 'Пользователь с таким email уже существует' 
      : 'Ошибка при регистрации';
    dispatch({ type: REGISTER_FAILED, payload: errorMessage });
    throw new Error(errorMessage);
  }
};

// Авторизация пользователя
export const login = (email, password) => async (dispatch) => {
  dispatch({ type: LOGIN_REQUEST });
  try {
    const res = await request('/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const accessToken = ensureBearerToken(res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    
    dispatch({
      type: LOGIN_SUCCESS,
      payload: { 
        user: res.user, 
        accessToken 
      }
    });
    return res;
  } catch (err) {
    const errorMessage = err.message === 'email or password are incorrect' 
      ? 'Неверный email или пароль' 
      : 'Ошибка при авторизации';
    dispatch({ type: LOGIN_FAILED, payload: errorMessage });
    throw new Error(errorMessage);
  }
};

// Выход из системы
export const logout = () => async (dispatch) => {
  dispatch({ type: LOGOUT_REQUEST });
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    await request('/auth/logout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshToken })
    });
    
    localStorage.removeItem('refreshToken');
    dispatch({ type: LOGOUT_SUCCESS });
  } catch (err) {
    dispatch({ type: LOGOUT_FAILED, payload: 'Ошибка при выходе из системы' });
    throw new Error('Ошибка при выходе из системы');
  }
};

// Обновление токена
export const updateToken = () => async (dispatch) => {
  dispatch({ type: UPDATE_TOKEN_REQUEST });
  try {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) throw new Error('No refresh token');
    
    const res = await request('/auth/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: refreshToken })
    });
    
    const accessToken = ensureBearerToken(res.accessToken);
    localStorage.setItem('refreshToken', res.refreshToken);
    
    dispatch({
      type: UPDATE_TOKEN_SUCCESS,
      payload: { accessToken }
    });
    return accessToken;
  } catch (err) {
    localStorage.removeItem('refreshToken');
    dispatch({ type: UPDATE_TOKEN_FAILED, payload: 'Сессия истекла' });
    throw new Error('Сессия истекла. Требуется повторная авторизация');
  }
};

// Получение данных пользователя
export const getUser = () => async (dispatch, getState) => {
  dispatch({ type: GET_USER_REQUEST });
  try {
    let { accessToken } = getState().auth;
    
    // Если нет токена, но есть refreshToken - пробуем обновить
    if (!accessToken) {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        accessToken = await dispatch(updateToken());
      } else {
        throw new Error('Требуется авторизация');
      }
    }

    const res = await request('/auth/user', {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: accessToken 
      }
    });
    
    if (!res.success) {
      throw new Error(res.message || 'Ошибка сервера');
    }
    
    dispatch({ type: GET_USER_SUCCESS, payload: res.user });
    return res.user;
  } catch (err) {
    console.error('Get user error:', err);
    
    // Для ошибок токена пробуем обновить
    if (err.message.includes('token') || err.message.includes('jwt')) {
      try {
        const newToken = await dispatch(updateToken());
        const res = await request('/auth/user', {
          method: 'GET',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: newToken 
          }
        });
        dispatch({ type: GET_USER_SUCCESS, payload: res.user });
        return res.user;
      } catch (updateErr) {
        console.error('Token update failed:', updateErr);
        dispatch({ type: GET_USER_FAILED, payload: 'Необходима повторная авторизация' });
        throw new Error('Необходима повторная авторизация');
      }
    }
    
    dispatch({ type: GET_USER_FAILED, payload: err.message });
    throw err;
  }
};

// Обновление данных пользователя
export const updateUser = (userData) => async (dispatch, getState) => {
  dispatch({ type: UPDATE_USER_REQUEST });
  try {
    const { accessToken } = getState().auth;
    const res = await request('/auth/user', {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: accessToken 
      },
      body: JSON.stringify(userData)
    });
    
    dispatch({
      type: UPDATE_USER_SUCCESS,
      payload: res.user
    });
    return res.user;
  } catch (err) {
    if (err.message.includes('token') || err.message.includes('jwt')) {
      try {
        const newToken = await dispatch(updateToken());
        const res = await request('/auth/user', {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            Authorization: newToken 
          },
          body: JSON.stringify(userData)
        });
        dispatch({ type: UPDATE_USER_SUCCESS, payload: res.user });
        return res.user;
      } catch (updateErr) {
        const errorMessage = updateErr.message === 'Email already exists' 
          ? 'Пользователь с таким email уже существует' 
          : 'Ошибка при обновлении данных';
        dispatch({ type: UPDATE_USER_FAILED, payload: errorMessage });
        throw new Error(errorMessage);
      }
    }
    
    const errorMessage = err.message === 'Email already exists' 
      ? 'Пользователь с таким email уже существует' 
      : 'Ошибка при обновлении данных';
    
    dispatch({ type: UPDATE_USER_FAILED, payload: errorMessage });
    throw new Error(errorMessage);
  }
};

export default {
  register,
  login,
  logout,
  getUser,
  updateToken,
  updateUser
};