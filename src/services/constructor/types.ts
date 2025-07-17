import { Ingredient, ConstructorIngredient } from '../../utils/types';

export const ADD_CONSTRUCTOR_ITEM = 'ADD_CONSTRUCTOR_ITEM';
export const REMOVE_CONSTRUCTOR_ITEM = 'REMOVE_CONSTRUCTOR_ITEM';
export const SET_CONSTRUCTOR_BUN = 'SET_CONSTRUCTOR_BUN';
export const CLEAR_CONSTRUCTOR = 'CLEAR_CONSTRUCTOR';
export const MOVE_CONSTRUCTOR_ITEM = 'MOVE_CONSTRUCTOR_ITEM';

export interface ConstructorState {
  bun: Ingredient | null;
  ingredients: ConstructorIngredient[];
}

interface AddConstructorItemAction {
  type: typeof ADD_CONSTRUCTOR_ITEM;
  payload: ConstructorIngredient;
}

interface RemoveConstructorItemAction {
  type: typeof REMOVE_CONSTRUCTOR_ITEM;
  payload: string; // uuid
}

interface SetConstructorBunAction {
  type: typeof SET_CONSTRUCTOR_BUN;
  payload: Ingredient;
}

interface ClearConstructorAction {
  type: typeof CLEAR_CONSTRUCTOR;
}

interface MoveConstructorItemAction {
  type: typeof MOVE_CONSTRUCTOR_ITEM;
  payload: {
    dragIndex: number;
    hoverIndex: number;
  };
}

export type ConstructorActionTypes =
  | AddConstructorItemAction
  | RemoveConstructorItemAction
  | SetConstructorBunAction
  | ClearConstructorAction
  | MoveConstructorItemAction;