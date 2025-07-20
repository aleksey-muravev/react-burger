import {
  GET_INGREDIENTS_REQUEST,
  GET_INGREDIENTS_SUCCESS,
  GET_INGREDIENTS_FAILED,
  INCREMENT_INGREDIENT_COUNT,
  DECREMENT_INGREDIENT_COUNT,
  RESET_BUN_COUNT,
  SET_CURRENT_INGREDIENT
} from './types';
import { request } from '../../utils/api';
import { AppThunk } from '../store';
import { Ingredient } from '../../utils/types';

interface IngredientsResponse {
  success: boolean;
  data: Ingredient[];
}

export const getIngredients = (): AppThunk => async (dispatch) => {
  dispatch({ type: GET_INGREDIENTS_REQUEST });
  
  try {
    const data = await request<IngredientsResponse>('/ingredients');
    if (data.success) {
      dispatch({
        type: GET_INGREDIENTS_SUCCESS,
        payload: data.data.map(item => ({ ...item, count: 0 }))
      });
    } else {
      throw new Error('API returned unsuccessful response');
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load ingredients';
    dispatch({
      type: GET_INGREDIENTS_FAILED,
      payload: message
    });
  }
};

export const incrementIngredientCount = (id: string) => ({
  type: INCREMENT_INGREDIENT_COUNT,
  payload: id
});

export const decrementIngredientCount = (id: string) => ({
  type: DECREMENT_INGREDIENT_COUNT,
  payload: id
});

export const resetBunCount = (id: string) => ({
  type: RESET_BUN_COUNT,
  payload: id
});

export const setCurrentIngredient = (ingredient: Ingredient) => ({
  type: SET_CURRENT_INGREDIENT,
  payload: ingredient
});