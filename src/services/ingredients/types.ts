import { Ingredient } from '../../utils/types';

export const GET_INGREDIENTS_REQUEST = 'GET_INGREDIENTS_REQUEST';
export const GET_INGREDIENTS_SUCCESS = 'GET_INGREDIENTS_SUCCESS';
export const GET_INGREDIENTS_FAILED = 'GET_INGREDIENTS_FAILED';
export const SET_CURRENT_INGREDIENT = 'SET_CURRENT_INGREDIENT';
export const CLEAR_CURRENT_INGREDIENT = 'CLEAR_CURRENT_INGREDIENT';
export const INCREMENT_INGREDIENT_COUNT = 'INCREMENT_INGREDIENT_COUNT';
export const DECREMENT_INGREDIENT_COUNT = 'DECREMENT_INGREDIENT_COUNT';
export const RESET_BUN_COUNT = 'RESET_BUN_COUNT';

export interface IngredientsState {
  items: Ingredient[];
  loading: boolean;
  error: string | null;
  currentIngredient: Ingredient | null;
}

interface GetIngredientsRequestAction {
  type: typeof GET_INGREDIENTS_REQUEST;
}

interface GetIngredientsSuccessAction {
  type: typeof GET_INGREDIENTS_SUCCESS;
  payload: Ingredient[];
}

interface GetIngredientsFailedAction {
  type: typeof GET_INGREDIENTS_FAILED;
  payload: string;
}

interface SetCurrentIngredientAction {
  type: typeof SET_CURRENT_INGREDIENT;
  payload: Ingredient;
}

interface ClearCurrentIngredientAction {
  type: typeof CLEAR_CURRENT_INGREDIENT;
}

interface IncrementIngredientCountAction {
  type: typeof INCREMENT_INGREDIENT_COUNT;
  payload: string; // id ингредиента
}

interface DecrementIngredientCountAction {
  type: typeof DECREMENT_INGREDIENT_COUNT;
  payload: string; // id ингредиента
}

interface ResetBunCountAction {
  type: typeof RESET_BUN_COUNT;
  payload: string; // id булки
}

export type IngredientsActionTypes =
  | GetIngredientsRequestAction
  | GetIngredientsSuccessAction
  | GetIngredientsFailedAction
  | SetCurrentIngredientAction
  | ClearCurrentIngredientAction
  | IncrementIngredientCountAction
  | DecrementIngredientCountAction
  | ResetBunCountAction;