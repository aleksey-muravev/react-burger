import { v4 as uuidv4 } from 'uuid';
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
import { AppThunk } from '../../utils/types';
import { Ingredient, ConstructorIngredient } from '../../utils/types';

export const addConstructorItem = (item: Ingredient): AppThunk => (dispatch) => {
  const itemWithId: ConstructorIngredient = {
    ...item,
    uuid: uuidv4()
  };

  dispatch({
    type: ADD_CONSTRUCTOR_ITEM,
    payload: itemWithId
  });

  if (item.type !== 'bun') {
    dispatch(incrementIngredientCount(item._id));
  }
};

export const removeConstructorItem = (uuid: string, ingredientId: string): AppThunk => (dispatch) => {
  dispatch({
    type: REMOVE_CONSTRUCTOR_ITEM,
    payload: uuid
  });
  dispatch(decrementIngredientCount(ingredientId));
};

export const setConstructorBun = (bun: Ingredient): AppThunk => (dispatch, getState) => {
  const currentBun = getState().burgerConstructor.bun;
  
  if (currentBun) {
    dispatch(resetBunCount(currentBun._id));
  }

  dispatch({
    type: SET_CONSTRUCTOR_BUN,
    payload: bun
  });
  dispatch(resetBunCount(bun._id));
};

export const moveConstructorItem = (dragIndex: number, hoverIndex: number) => ({
  type: MOVE_CONSTRUCTOR_ITEM,
  payload: { dragIndex, hoverIndex }
} as const);

export const clearConstructor = (): AppThunk => (dispatch, getState) => {
  const { bun, ingredients } = getState().burgerConstructor;
  
  dispatch({ type: CLEAR_CONSTRUCTOR });
  
  if (bun) {
    dispatch(resetBunCount(bun._id));
  }
  ingredients.forEach(item => {
    dispatch(decrementIngredientCount(item._id));
  });
};