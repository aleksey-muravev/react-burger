import {
  ADD_CONSTRUCTOR_ITEM,
  REMOVE_CONSTRUCTOR_ITEM,
  SET_CONSTRUCTOR_BUN,
  CLEAR_CONSTRUCTOR,
  MOVE_CONSTRUCTOR_ITEM
} from './types';
import {
  incrementIngredientCount,
  decrementIngredientCount,
  resetBunCount
} from '../ingredients/actions';


export const addConstructorItem = (item) => (dispatch) => {
  dispatch({
    type: ADD_CONSTRUCTOR_ITEM,
    payload: item
  });

  if (item.type !== 'bun') {
    dispatch(incrementIngredientCount(item._id));
  }
};


export const removeConstructorItem = (uuid, ingredientId) => (dispatch) => {
  dispatch({
    type: REMOVE_CONSTRUCTOR_ITEM,
    payload: uuid
  });
  dispatch(decrementIngredientCount(ingredientId));
};


export const setConstructorBun = (bun) => (dispatch) => {
  dispatch({
    type: SET_CONSTRUCTOR_BUN,
    payload: bun
  });
  dispatch(resetBunCount(bun._id));
};


export const moveConstructorItem = (dragIndex, hoverIndex) => ({
  type: MOVE_CONSTRUCTOR_ITEM,
  payload: { dragIndex, hoverIndex }
});


export const clearConstructor = () => (dispatch, getState) => {
  const { bun, ingredients } = getState().burgerConstructor;
  
  dispatch({ type: CLEAR_CONSTRUCTOR });
  
  if (bun) {
    dispatch(resetBunCount(bun._id));
  }
  ingredients.forEach(item => {
    dispatch(decrementIngredientCount(item._id));
  });
};