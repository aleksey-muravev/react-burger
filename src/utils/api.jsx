const API_URL = 'https://norma.nomoreparties.space/api';

function checkResponse(res) {
  if (!res.ok) {
    return Promise.reject(`Ошибка ${res.status}`);
  }
  return res.json();
}

export function request(url, options) {
  return fetch(`${API_URL}${url}`, options).then(checkResponse);
}