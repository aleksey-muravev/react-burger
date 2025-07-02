import { updateToken } from '../services/auth/actions';
import { AppDispatch } from './types';

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
}

interface ErrorResponse {
  message?: string;
  [key: string]: any;
}

/**
 * Базовый запрос к API
 */
export const request = async <T = any>(url: string, options: RequestOptions = {}): Promise<T> => {
  const defaultHeaders = {
    'Content-Type': 'application/json'
  };

  const response = await fetch(`https://norma.nomoreparties.space/api${url}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const error: ErrorResponse = await response.json();
    const errorMessage = error.message || `Ошибка ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return response.json();
};

/**
 * Запрос с автоматическим обновлением токена
 */
export const requestWithRefresh = async <T = any>(
  url: string,
  options: RequestOptions = {},
  dispatch: AppDispatch
): Promise<T> => {
  try {
    return await request<T>(url, options);
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    
    if (errorMessage.includes('jwt expired') || 
        errorMessage.includes('token') || 
        errorMessage.includes('401')) {
      try {
        const newToken = await dispatch(updateToken());
        
        const newOptions: RequestOptions = {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`
          }
        };

        return await request<T>(url, newOptions);
      } catch (refreshError) {
        throw new Error('Необходима повторная авторизация');
      }
    }
    
    throw error instanceof Error ? error : new Error(String(error));
  }
};

/**
 * Получение заголовков с токеном
 */
export const getAuthHeaders = (token: string): { Authorization: string } => {
  if (!token) {
    throw new Error('Токен не предоставлен');
  }
  
  return {
    Authorization: `Bearer ${token}`
  };
};