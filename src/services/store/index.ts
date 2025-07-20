import { createStore, applyMiddleware, compose, AnyAction } from 'redux';
import thunk, { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { rootReducer } from './rootReducer';
import { socketMiddleware, TWsActions } from '../../services/websocket/middleware';
import { WsActionTypes } from '../../services/websocket/types';

declare global {
  interface Window {
    __REDUX_DEVTOOLS_EXTENSION_COMPOSE__?: typeof compose;
  }
}

const wsActions: TWsActions = {
  wsInit: WsActionTypes.CONNECTION_START,
  wsUserInit: WsActionTypes.USER_CONNECTION_START,
  wsConnectionSuccess: WsActionTypes.CONNECTION_SUCCESS,
  wsConnectionError: WsActionTypes.CONNECTION_ERROR,
  wsConnectionClosed: WsActionTypes.CONNECTION_CLOSED,
  wsGetMessage: WsActionTypes.GET_MESSAGE,
  wsInvalidTokenError: WsActionTypes.INVALID_TOKEN_ERROR
};

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const enhancer = composeEnhancers(
  applyMiddleware(
    thunk,
    socketMiddleware(wsActions)
  )
);

export const store = createStore(rootReducer, enhancer);

export type RootState = ReturnType<typeof rootReducer>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;