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

export function checkTokenExpiration(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000 > Date.now() + 30000; // 30 секунд запаса
  } catch {
    return false;
  }
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
  const token = getCookie('accessToken');
  
  // Предварительная проверка токена
  if (token && !checkTokenExpiration(token)) {
    try {
      const result = await dispatch<any>(updateToken());
      const newToken = result?.accessToken;
      if (!newToken) throw new Error('Failed to refresh token');
      
      options.headers = {
        ...options.headers,
        Authorization: newToken
      };
    } catch (err) {
      console.error('Token refresh failed:', err);
      throw err;
    }
  }

  try {
    return await request<T>(url, options);
  } catch (err) {
    const error = err as { message?: string; status?: number };
    
    if (error.message === 'jwt expired' || error.status === 401) {
      try {
        const result = await dispatch<any>(updateToken());
        const newToken = result?.accessToken;
        if (!newToken) throw new Error('Failed to refresh token');
        
        options.headers = {
          ...options.headers,
          Authorization: newToken
        };
        
        return await request<T>(url, options);
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

export function getCookie(name: string): string | undefined {
  const matches = document.cookie.match(
    new RegExp('(?:^|; )' + name.replace(/([.$?*|{}()[\]\\/+^])/g, '\\$1') + '=([^;]*)')
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