import {
  GET_INGREDIENTS_REQUEST,
  GET_INGREDIENTS_SUCCESS,
  GET_INGREDIENTS_FAILED,
  SET_CURRENT_INGREDIENT,
  CLEAR_CURRENT_INGREDIENT,
  INCREMENT_INGREDIENT_COUNT,
  DECREMENT_INGREDIENT_COUNT,
  RESET_BUN_COUNT,
  IngredientsState,
  IngredientsActionTypes
} from './types';

const initialState: IngredientsState = {
  items: [],
  loading: false,
  error: null,
  currentIngredient: null
};

export const ingredientsReducer = (
  state = initialState,
  action: IngredientsActionTypes
): IngredientsState => {
  switch (action.type) {
    case GET_INGREDIENTS_REQUEST:
      return { ...state, loading: true, error: null };
    case GET_INGREDIENTS_SUCCESS:
      return { ...state, items: action.payload, loading: false };
    case GET_INGREDIENTS_FAILED:
      return { ...state, loading: false, error: action.payload };
    case SET_CURRENT_INGREDIENT:
      return { ...state, currentIngredient: action.payload };
    case CLEAR_CURRENT_INGREDIENT:
      return { ...state, currentIngredient: null };
    case INCREMENT_INGREDIENT_COUNT:
      return {
        ...state,
        items: state.items.map(item => 
          item._id === action.payload 
            ? { ...item, count: (item.count || 0) + 1 } 
            : item
        )
      };
    case DECREMENT_INGREDIENT_COUNT:
      return {
        ...state,
        items: state.items.map(item => 
          item._id === action.payload && (item.count || 0) > 0
            ? { ...item, count: (item.count || 0) - 1 } 
            : item
        )
      };
    case RESET_BUN_COUNT:
      return {
        ...state,
        items: state.items.map(item => 
          item.type === 'bun' 
            ? { ...item, count: item._id === action.payload ? 2 : 0 } 
            : item
        )
      };
    default:
      return state;
  }
};