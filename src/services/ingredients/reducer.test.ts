import { ingredientsReducer } from './reducer';
import {
  GET_INGREDIENTS_REQUEST,
  GET_INGREDIENTS_SUCCESS,
  GET_INGREDIENTS_FAILED,
  INCREMENT_INGREDIENT_COUNT,
  DECREMENT_INGREDIENT_COUNT,
  RESET_BUN_COUNT,
  SET_CURRENT_INGREDIENT,
  CLEAR_CURRENT_INGREDIENT,
  IngredientsState
} from './types';
import { Ingredient } from '../../utils/types';

// Mock данные
const mockIngredient: Ingredient = {
  _id: '1',
  name: 'Test Ingredient',
  type: 'main',
  price: 100,
  image: 'image.jpg',
  image_mobile: 'image-mobile.jpg',
  image_large: 'image-large.jpg',
  calories: 300,
  proteins: 10,
  fat: 5,
  carbohydrates: 40
};

const mockBun: Ingredient = {
  ...mockIngredient,
  _id: '2',
  type: 'bun'
};

const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null,
  currentIngredient: null
};

describe('ingredients reducer', () => {
  it('should return initial state', () => {
    expect(ingredientsReducer(undefined, {} as any)).toEqual(initialState);
  });

  describe('ingredients fetching', () => {
    it('should handle GET_INGREDIENTS_REQUEST', () => {
      const action = { type: GET_INGREDIENTS_REQUEST };
      const state = ingredientsReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: true,
        error: null
      });
    });

    it('should handle GET_INGREDIENTS_SUCCESS', () => {
      const ingredients = [mockIngredient, mockBun];
      const action = { 
        type: GET_INGREDIENTS_SUCCESS, 
        payload: ingredients 
      };
      const state = ingredientsReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        items: ingredients,
        loading: false
      });
    });

    it('should handle GET_INGREDIENTS_FAILED', () => {
      const error = 'Failed to fetch ingredients';
      const action = { 
        type: GET_INGREDIENTS_FAILED, 
        payload: error 
      };
      const state = ingredientsReducer(initialState, action);
      expect(state).toEqual({
        ...initialState,
        loading: false,
        error
      });
    });
  });

  describe('ingredient counters', () => {
    const stateWithItems: IngredientsState = {
      ...initialState,
      items: [
        { ...mockIngredient, count: 1 },
        { ...mockBun, count: 2 },
        { ...mockBun, _id: 'new-bun-id', count: 0 }
      ]
    };

    it('should handle INCREMENT_INGREDIENT_COUNT', () => {
      const action = { 
        type: INCREMENT_INGREDIENT_COUNT, 
        payload: mockIngredient._id 
      };
      const state = ingredientsReducer(stateWithItems, action);
      expect(state.items.find(i => i._id === mockIngredient._id)?.count).toBe(2);
    });

    it('should handle DECREMENT_INGREDIENT_COUNT', () => {
      const action = { 
        type: DECREMENT_INGREDIENT_COUNT, 
        payload: mockIngredient._id 
      };
      const state = ingredientsReducer(stateWithItems, action);
      expect(state.items.find(i => i._id === mockIngredient._id)?.count).toBe(0);
    });

    it('should handle RESET_BUN_COUNT', () => {
      const newBunId = 'new-bun-id';
      const action = { 
        type: RESET_BUN_COUNT, 
        payload: newBunId 
      };
      const state = ingredientsReducer(stateWithItems, action);
      
      // Проверяем что все булки сбросились, кроме новой
      expect(state.items.find(i => i._id === mockBun._id)?.count).toBe(0);
      expect(state.items.find(i => i._id === newBunId)?.count).toBe(2);
    });
  });

  describe('current ingredient', () => {
    it('should handle SET_CURRENT_INGREDIENT', () => {
      const action = { 
        type: SET_CURRENT_INGREDIENT, 
        payload: mockIngredient 
      };
      const state = ingredientsReducer(initialState, action);
      expect(state.currentIngredient).toEqual(mockIngredient);
    });

    it('should handle CLEAR_CURRENT_INGREDIENT', () => {
      const stateWithCurrent = { 
        ...initialState, 
        currentIngredient: mockIngredient 
      };
      const state = ingredientsReducer(stateWithCurrent, { 
        type: CLEAR_CURRENT_INGREDIENT 
      });
      expect(state.currentIngredient).toBeNull();
    });
  });
});