import { Ingredient, ConstructorIngredient } from '../../utils/types';

export const ADD_CONSTRUCTOR_ITEM = 'ADD_CONSTRUCTOR_ITEM';
export const REMOVE_CONSTRUCTOR_ITEM = 'REMOVE_CONSTRUCTOR_ITEM';
export const SET_CONSTRUCTOR_BUN = 'SET_CONSTRUCTOR_BUN';
export const CLEAR_CONSTRUCTOR = 'CLEAR_CONSTRUCTOR';
export const MOVE_CONSTRUCTOR_ITEM = 'MOVE_CONSTRUCTOR_ITEM';

export interface ConstructorState {
  readonly bun: Ingredient | null;
  readonly ingredients: ConstructorIngredient[];
}

interface AddConstructorItemAction {
  readonly type: typeof ADD_CONSTRUCTOR_ITEM;
  readonly payload: ConstructorIngredient;
}

interface RemoveConstructorItemAction {
  readonly type: typeof REMOVE_CONSTRUCTOR_ITEM;
  readonly payload: string; // uuid
}

interface SetConstructorBunAction {
  readonly type: typeof SET_CONSTRUCTOR_BUN;
  readonly payload: Ingredient;
}

interface ClearConstructorAction {
  readonly type: typeof CLEAR_CONSTRUCTOR;
}

interface MoveConstructorItemAction {
  readonly type: typeof MOVE_CONSTRUCTOR_ITEM;
  readonly payload: {
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