import { constructorReducer } from './reducer';
import {
  ADD_CONSTRUCTOR_ITEM,
  REMOVE_CONSTRUCTOR_ITEM,
  SET_CONSTRUCTOR_BUN,
  CLEAR_CONSTRUCTOR,
  MOVE_CONSTRUCTOR_ITEM,
  ConstructorState
} from './types';
import { Ingredient, ConstructorIngredient } from '../../utils/types';

// Mock данные
const mockBun: Ingredient = {
  _id: '1',
  name: 'Test Bun',
  type: 'bun',
  price: 100,
  image: 'image.jpg',
  image_mobile: 'image-mobile.jpg',
  image_large: 'image-large.jpg',
  calories: 300,
  proteins: 10,
  fat: 5,
  carbohydrates: 40
};

const mockIngredient: ConstructorIngredient = {
  ...mockBun,
  uuid: 'unique-id-1',
  type: 'main' // меняем тип для теста
};

const mockIngredient2: ConstructorIngredient = {
  ...mockBun,
  uuid: 'unique-id-2',
  type: 'sauce',
  _id: '2'
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: []
};

describe('constructor reducer', () => {
  it('should return initial state', () => {
    expect(constructorReducer(undefined, {} as any)).toEqual(initialState);
  });

  it('should handle SET_CONSTRUCTOR_BUN', () => {
    const action = { 
      type: SET_CONSTRUCTOR_BUN, 
      payload: mockBun 
    };
    const state = constructorReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      bun: mockBun
    });
  });

  it('should handle ADD_CONSTRUCTOR_ITEM', () => {
    const action = { 
      type: ADD_CONSTRUCTOR_ITEM, 
      payload: mockIngredient 
    };
    const state = constructorReducer(initialState, action);
    expect(state).toEqual({
      ...initialState,
      ingredients: [mockIngredient]
    });
  });

  it('should handle REMOVE_CONSTRUCTOR_ITEM', () => {
    const stateWithItems = {
      ...initialState,
      ingredients: [mockIngredient, mockIngredient2]
    };
    const action = { 
      type: REMOVE_CONSTRUCTOR_ITEM, 
      payload: 'unique-id-1' 
    };
    const state = constructorReducer(stateWithItems, action);
    expect(state).toEqual({
      ...initialState,
      ingredients: [mockIngredient2]
    });
  });

  it('should handle MOVE_CONSTRUCTOR_ITEM', () => {
    const stateWithItems = {
      ...initialState,
      ingredients: [mockIngredient, mockIngredient2]
    };
    const action = { 
      type: MOVE_CONSTRUCTOR_ITEM, 
      payload: { 
        dragIndex: 0, 
        hoverIndex: 1 
      } 
    };
    const state = constructorReducer(stateWithItems, action);
    expect(state).toEqual({
      ...initialState,
      ingredients: [mockIngredient2, mockIngredient]
    });
  });

  it('should handle CLEAR_CONSTRUCTOR', () => {
    const stateWithItems = {
      bun: mockBun,
      ingredients: [mockIngredient, mockIngredient2]
    };
    const state = constructorReducer(stateWithItems, { type: CLEAR_CONSTRUCTOR });
    expect(state).toEqual(initialState);
  });
});