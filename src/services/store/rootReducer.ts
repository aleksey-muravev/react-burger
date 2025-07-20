import { combineReducers } from 'redux';
import { ingredientsReducer } from '../../services/ingredients/reducer';
import { constructorReducer } from '../../services/constructor/reducer';
import { orderReducer } from '../../services/order/reducer';
import { authReducer } from '../../services/auth/reducer';
import { wsReducer } from '../../services/websocket/reducer';
import { orderDetailsReducer } from '../../services/order-details/reducer';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  auth: authReducer,
  ws: wsReducer,
  orderDetails: orderDetailsReducer
});