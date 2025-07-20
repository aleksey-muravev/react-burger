export interface Ingredient {
  _id: string;
  name: string;
  type: 'bun' | 'sauce' | 'main';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v?: number;
  count?: number;
  uuid?: string;
}

export interface ConstructorIngredient extends Ingredient {
  uuid: string;
}

export interface Order {
  _id: string;
  ingredients: string[];
  status: 'created' | 'pending' | 'done';
  name: string;
  createdAt: string;
  updatedAt: string;
  number: number;
}

export interface OrderDetails {
  number: number;
  name: string;
  status: string;
  ingredients: string[];
  ingredientsInfo: {
    _id: string;
    name: string;
    price: number;
    image_mobile: string;
  }[];
  total: number;
  createdAt: string;
}

export interface User {
  email: string;
  name: string;
}

export interface AuthResponse {
  success: boolean;
  accessToken: string;
  refreshToken: string;
  user: User;
  message?: string;
}

export interface OrderResponse {
  success: boolean;
  orders: Order[];
  message?: string;
}

export interface SingleOrderResponse {
  success: boolean;
  orders: Order[];
  message?: string;
}