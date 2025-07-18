import { combineReducers } from 'redux';
import { ingredientsReducer } from '../ingredients/reducer';
import { constructorReducer } from '../constructor/reducer';
import { orderReducer } from '../order/reducer';
import { authReducer } from '../auth/reducer';

export default combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  auth: authReducer
});