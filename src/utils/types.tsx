import { ThunkDispatch, AnyAction } from '@reduxjs/toolkit';

// Типы данных приложения
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
  success?: boolean;
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
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

// Состояния Redux
export interface IngredientsState {
  items: Ingredient[];
  loading: boolean;
  error: string | null;
  currentIngredient: Ingredient | null;
}

export interface ConstructorState {
  bun: Ingredient | null;
  ingredients: ConstructorIngredient[];
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export interface OrderState {
  order: Order | null;
  loading: boolean;
  error: string | null;
}

export interface AppState {
  ingredients: IngredientsState;
  burgerConstructor: ConstructorState;
  auth: AuthState;
  order: OrderState;
}

// Типы для Redux
export type RootState = AppState;
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

// Декларация для store
declare module '../services/store' {
  export type RootState = AppState;
  export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
}

// Типы для DnD
export interface DragItem {
  id: string;
  type: string;
  index?: number;
}