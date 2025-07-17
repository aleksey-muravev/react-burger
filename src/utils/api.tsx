import { AppDispatch } from '../services/store';
import { updateToken } from '../services/auth/actions';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export function checkResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    return res.json().then(err => Promise.reject(err));
  }
  return res.json();
}

export async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
  try {
    const res = await fetch(`https://norma.nomoreparties.space/api${url}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    return await checkResponse<T>(res);
  } catch (err) {
    console.error('Request failed:', err);
    throw err;
  }
}

export async function requestWithRefresh<T>(
  url: string,
  options: RequestInit = {},
  dispatch: AppDispatch
): Promise<T> {
  try {
    return await request<T>(url, options);
  } catch (err) {
    const error = err as { message?: string; status?: number };
    
    if (error.message === 'jwt expired' || error.status === 401) {
      try {
        // Явное приведение типа для dispatch
        const result = await dispatch<any>(updateToken());
        
        // Безопасное извлечение токена
        const accessToken = result?.accessToken;
        if (!accessToken) {
          throw new Error('Failed to refresh token');
        }

        const newOptions = {
          ...options,
          headers: {
            ...options.headers,
            Authorization: accessToken
          }
        };
        
        return await request<T>(url, newOptions);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        throw refreshError;
      }
    }
    
    throw err;
  }
}

export function createSocketConnection(url: string, token?: string): WebSocket {
  const wsUrl = token 
    ? `wss://norma.nomoreparties.space${url}?token=${token}`
    : `wss://norma.nomoreparties.space${url}`;
  
  const socket = new WebSocket(wsUrl);
  
  socket.onerror = (error) => {
    console.error('WebSocket error:', error);
  };
  
  return socket;
}

// Вспомогательные функции для работы с cookies
export function getCookie(name: string): string | undefined {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

export function setCookie(
  name: string,
  value: string,
  options: { [key: string]: any } = {}
): void {
  options = {
    path: '/',
    ...options
  };

  let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

  for (const optionKey in options) {
    updatedCookie += '; ' + optionKey;
    const optionValue = options[optionKey];
    if (optionValue !== true) {
      updatedCookie += '=' + optionValue;
    }
  }

  document.cookie = updatedCookie;
}

export function deleteCookie(name: string): void {
  setCookie(name, '', { 'max-age': -1 });
}