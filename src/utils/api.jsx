import { updateToken } from '../services/auth/actions';

/**
 * Базовый запрос к API
 * @param {string} url - endpoint API
 * @param {object} options - параметры запроса
 * @returns {Promise} - промис с ответом от сервера
 */
export const request = async (url, options = {}) => {
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
    const error = await response.json();
    const errorMessage = error.message || `Ошибка ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return response.json();
};

/**
 * Запрос с автоматическим обновлением токена при истечении
 * @param {string} url - endpoint API
 * @param {object} options - параметры запроса
 * @param {function} dispatch - функция dispatch из Redux
 * @returns {Promise} - промис с ответом от сервера
 */
export const requestWithRefresh = async (url, options = {}, dispatch) => {
  try {
    return await request(url, options);
  } catch (error) {
    if (error.message.includes('jwt expired') || 
        error.message.includes('token') || 
        error.message.includes('401')) {
      try {
        const newToken = await dispatch(updateToken());
        
        const newOptions = {
          ...options,
          headers: {
            ...options.headers,
            Authorization: `Bearer ${newToken}`
          }
        };

        return await request(url, newOptions);
      } catch (refreshError) {
        throw new Error('Необходима повторная авторизация');
      }
    }
    
    throw error;
  }
};

/**
 * Вспомогательная функция для формирования заголовков с токеном
 * @param {string} token - токен авторизации
 * @returns {object} - headers для запроса
 */
export const getAuthHeaders = (token) => {
  if (!token) {
    throw new Error('Токен не предоставлен');
  }
  
  return {
    Authorization: `Bearer ${token}`
  };
};