import {
  ADD_CONSTRUCTOR_ITEM,
  REMOVE_CONSTRUCTOR_ITEM,
  SET_CONSTRUCTOR_BUN,
  CLEAR_CONSTRUCTOR,
  MOVE_CONSTRUCTOR_ITEM
} from './types';

const initialState = {
  bun: null,
  ingredients: []
};

export const constructorReducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_CONSTRUCTOR_ITEM:
      return {
        ...state,
        ingredients: [
          ...state.ingredients,
          action.payload // Получаем готовый объект с UUID
        ]
      };
      
    case REMOVE_CONSTRUCTOR_ITEM:
      return {
        ...state,
        ingredients: state.ingredients.filter(item => item.uuid !== action.payload)
      };
      
    case SET_CONSTRUCTOR_BUN:
      return {
        ...state,
        bun: action.payload
      };
      
    case CLEAR_CONSTRUCTOR:
      return initialState;

    case MOVE_CONSTRUCTOR_ITEM: {
      const { dragIndex, hoverIndex } = action.payload;
      const newIngredients = [...state.ingredients];
      const draggedItem = newIngredients[dragIndex];
      
      newIngredients.splice(dragIndex, 1);
      newIngredients.splice(hoverIndex, 0, draggedItem);
      
      return {
        ...state,
        ingredients: newIngredients
      };
    }
      
    default:
      return state;
  }
};