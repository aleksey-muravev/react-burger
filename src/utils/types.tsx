import { ThunkAction, ThunkDispatch } from 'redux-thunk';
import { AnyAction } from 'redux';

// Базовые типы данных
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

export interface ICookieOptions {
  expires?: number | Date | string;
  [key: string]: any;
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
  accessToken: string | null;
  loading: boolean;
  error: string | null;
}

export interface OrderState {
  order: Order | null;
  loading: boolean;
  error: string | null;
}

// Новое состояние для деталей заказа
export interface OrderDetailsState {
  order: Order | null;
  loading: boolean;
  error: string | null;
}

export interface WsState {
  wsConnected: boolean;
  orders: Order[];
  userOrders: Order[];
  total: number;
  totalToday: number;
  error?: Event;
}

// Корневое состояние с добавлением orderDetails
export interface RootState {
  ingredients: IngredientsState;
  burgerConstructor: ConstructorState;
  auth: AuthState;
  order: OrderState;
  ws: WsState;
  orderDetails: OrderDetailsState;
}

// Типы для Redux
export type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  AnyAction
>;

// Типы для DnD
export interface DragItem {
  id: string;
  type: string;
  index?: number;
}

// Дополнительные типы для API ответов
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface UserResponse {
  success: boolean;
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