import {
  GET_INGREDIENTS_REQUEST,
  GET_INGREDIENTS_SUCCESS,
  GET_INGREDIENTS_FAILED,
  SET_CURRENT_INGREDIENT,
  CLEAR_CURRENT_INGREDIENT,
  INCREMENT_INGREDIENT_COUNT,
  DECREMENT_INGREDIENT_COUNT,
  RESET_BUN_COUNT
} from './types';
import { request } from '../../utils/api';
import { AppThunk } from '../../utils/types';
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
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to load ingredients';
    console.error('Ingredients fetch failed:', err);
    dispatch({
      type: GET_INGREDIENTS_FAILED,
      payload: message
    });
  }
};

export const setCurrentIngredient = (ingredient: Ingredient) => ({
  type: SET_CURRENT_INGREDIENT,
  payload: ingredient
} as const);

export const clearCurrentIngredient = () => ({
  type: CLEAR_CURRENT_INGREDIENT
} as const);

export const incrementIngredientCount = (id: string) => ({
  type: INCREMENT_INGREDIENT_COUNT,
  payload: id
} as const);

export const decrementIngredientCount = (id: string) => ({
  type: DECREMENT_INGREDIENT_COUNT,
  payload: id
} as const);

export const resetBunCount = (id: string) => ({
  type: RESET_BUN_COUNT,
  payload: id
} as const);