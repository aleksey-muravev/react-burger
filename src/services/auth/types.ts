import { User } from '../../utils/types';

export const REGISTER_REQUEST = 'REGISTER_REQUEST';
export const REGISTER_SUCCESS = 'REGISTER_SUCCESS';
export const REGISTER_FAILED = 'REGISTER_FAILED';

export const LOGIN_REQUEST = 'LOGIN_REQUEST';
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
export const LOGIN_FAILED = 'LOGIN_FAILED';

export const LOGOUT_REQUEST = 'LOGOUT_REQUEST';
export const LOGOUT_SUCCESS = 'LOGOUT_SUCCESS';
export const LOGOUT_FAILED = 'LOGOUT_FAILED';

export const GET_USER_REQUEST = 'GET_USER_REQUEST';
export const GET_USER_SUCCESS = 'GET_USER_SUCCESS';
export const GET_USER_FAILED = 'GET_USER_FAILED';

export const UPDATE_TOKEN_REQUEST = 'UPDATE_TOKEN_REQUEST';
export const UPDATE_TOKEN_SUCCESS = 'UPDATE_TOKEN_SUCCESS';
export const UPDATE_TOKEN_FAILED = 'UPDATE_TOKEN_FAILED';

export const UPDATE_USER_REQUEST = 'UPDATE_USER_REQUEST';
export const UPDATE_USER_SUCCESS = 'UPDATE_USER_SUCCESS';
export const UPDATE_USER_FAILED = 'UPDATE_USER_FAILED';

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

interface RegisterRequestAction {
  type: typeof REGISTER_REQUEST;
}

interface RegisterSuccessAction {
  type: typeof REGISTER_SUCCESS;
  payload: {
    user: User;
    accessToken: string;
  };
}

interface RegisterFailedAction {
  type: typeof REGISTER_FAILED;
  payload: string;
}

interface LoginRequestAction {
  type: typeof LOGIN_REQUEST;
}

interface LoginSuccessAction {
  type: typeof LOGIN_SUCCESS;
  payload: {
    user: User;
    accessToken: string;
  };
}

interface LoginFailedAction {
  type: typeof LOGIN_FAILED;
  payload: string;
}

interface LogoutRequestAction {
  type: typeof LOGOUT_REQUEST;
}

interface LogoutSuccessAction {
  type: typeof LOGOUT_SUCCESS;
}

interface LogoutFailedAction {
  type: typeof LOGOUT_FAILED;
  payload: string;
}

interface GetUserRequestAction {
  type: typeof GET_USER_REQUEST;
}

interface GetUserSuccessAction {
  type: typeof GET_USER_SUCCESS;
  payload: User;
}

interface GetUserFailedAction {
  type: typeof GET_USER_FAILED;
  payload: string;
}

interface UpdateTokenRequestAction {
  type: typeof UPDATE_TOKEN_REQUEST;
}

interface UpdateTokenSuccessAction {
  type: typeof UPDATE_TOKEN_SUCCESS;
  payload: {
    accessToken: string;
  };
}

interface UpdateTokenFailedAction {
  type: typeof UPDATE_TOKEN_FAILED;
  payload: string;
}

interface UpdateUserRequestAction {
  type: typeof UPDATE_USER_REQUEST;
}

interface UpdateUserSuccessAction {
  type: typeof UPDATE_USER_SUCCESS;
  payload: User;
}

interface UpdateUserFailedAction {
  type: typeof UPDATE_USER_FAILED;
  payload: string;
}

export type AuthActionTypes =
  | RegisterRequestAction
  | RegisterSuccessAction
  | RegisterFailedAction
  | LoginRequestAction
  | LoginSuccessAction
  | LoginFailedAction
  | LogoutRequestAction
  | LogoutSuccessAction
  | LogoutFailedAction
  | GetUserRequestAction
  | GetUserSuccessAction
  | GetUserFailedAction
  | UpdateTokenRequestAction
  | UpdateTokenSuccessAction
  | UpdateTokenFailedAction
  | UpdateUserRequestAction
  | UpdateUserSuccessAction
  | UpdateUserFailedAction;