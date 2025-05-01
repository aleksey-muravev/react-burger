import { API_URL } from '../../utils/api';
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

export const getIngredients = () => async (dispatch) => {
  dispatch({ type: GET_INGREDIENTS_REQUEST });
  
  try {
    const res = await fetch(`${API_URL}/ingredients`);
    const data = await res.json();
    
    if (data.success) {
      dispatch({
        type: GET_INGREDIENTS_SUCCESS,
        payload: data.data.map(item => ({ ...item, count: 0 }))
      });
    } else {
      throw new Error('Ошибка при получении данных');
    }
  } catch (err) {
    dispatch({
      type: GET_INGREDIENTS_FAILED,
      payload: err.message
    });
  }
};

export const setCurrentIngredient = (ingredient) => ({
  type: SET_CURRENT_INGREDIENT,
  payload: ingredient
});

export const clearCurrentIngredient = () => ({
  type: CLEAR_CURRENT_INGREDIENT
});

export const incrementIngredientCount = (id) => ({
  type: INCREMENT_INGREDIENT_COUNT,
  payload: id
});

export const decrementIngredientCount = (id) => ({
  type: DECREMENT_INGREDIENT_COUNT,
  payload: id
});

export const resetBunCount = (id) => ({
  type: RESET_BUN_COUNT,
  payload: id
});