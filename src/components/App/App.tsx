import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import AppHeader from '../AppHeader/AppHeader';
import BurgerIngredients from '../BurgerIngredients/BurgerIngredients';
import BurgerConstructor from '../BurgerConstructor/BurgerConstructor';
import { getIngredients, setCurrentIngredient } from '../../services/ingredients/actions';
import { getUser } from '../../services/auth/actions';
import { ProtectedRoute } from '../ProtectedRoute/ProtectedRoute';
import styles from './App.module.css';
import Modal from '../Modal/Modal';
import IngredientDetails from '../IngredientDetails/IngredientDetails';
import Login from '../../pages/Login/Login';
import Register from '../../pages/Register/Register';
import ForgotPassword from '../../pages/ForgotPassword/ForgotPassword';
import ResetPassword from '../../pages/ResetPassword/ResetPassword';
import Profile from '../../pages/Profile/Profile';
import ProfileOrdersList from '../../pages/Profile/Orders/ProfileOrdersList';
import ProfileOrderPage from '../../pages/Profile/Orders/ProfileOrderPage';
import NotFound from '../../pages/NotFound/NotFound';
import IngredientPage from '../../pages/IngredientPage/IngredientPage';
import FeedPage from '../../pages/Feed/FeedPage';
import OrderDetailsModal from '../OrderDetailsModal/OrderDetailsModal';
import OrderPage from '../../pages/Feed/OrderPage';
import { useBackgroundLocation } from '../../hooks/useBackgroundLocation';
import { useAppDispatch, useAppSelector } from '../../hooks/useTypedRedux';
import type { RootState } from '../../services/store';
import type { Ingredient, Order, OrderDetails } from '../../utils/types';

interface LocationState {
  background?: {
    pathname: string;
    search: string;
    hash: string;
    state: unknown;
    key: string;
  };
  order?: Order;
}

const AppContent = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const state = location.state as LocationState;
  const navigate = useNavigate();
  const background = useBackgroundLocation();
  
  const { 
    items: ingredients, 
    loading: ingredientsLoading, 
    error: ingredientsError,
    currentIngredient
  } = useAppSelector((state: RootState) => state.ingredients);

  useEffect(() => {
    dispatch(getIngredients());
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      dispatch(getUser());
    }
  }, [dispatch]);

  useEffect(() => {
    if (location.pathname.startsWith('/ingredients/') && ingredients.length) {
      const id = location.pathname.split('/')[2];
      const ingredient = ingredients.find((item: Ingredient) => item._id === id);
      if (ingredient) {
        dispatch(setCurrentIngredient(ingredient));
      }
    }
  }, [location.pathname, ingredients, dispatch]);

  if (ingredientsLoading) {
    return <div className="text text_type_main-medium">Загрузка ингредиентов...</div>;
  }

  if (ingredientsError) {
    return (
      <div className="text text_type_main-medium text_color_error">
        Ошибка: {ingredientsError}
      </div>
    );
  }

  const handleCloseModal = () => navigate(-1);

  const prepareOrderData = (order: Order | undefined): OrderDetails | null => {
    if (!order) return null;
    
    const ingredientsInfo = ingredients
      .filter((ing: Ingredient) => order.ingredients.includes(ing._id))
      .map(({ _id, name, price, image_mobile }) => ({ _id, name, price, image_mobile }));

    const total = order.ingredients.reduce((sum: number, id: string) => {
      const ingredient = ingredients.find((item: Ingredient) => item._id === id);
      return sum + (ingredient?.price || 0);
    }, 0);

    return {
      number: order.number,
      name: order.name,
      status: order.status,
      ingredients: order.ingredients,
      ingredientsInfo,
      total,
      createdAt: order.createdAt
    };
  };

  return (
    <>
      <AppHeader />
      <main className={styles.mainContent}>
        <Routes location={background || location}>
          <Route path="/" element={
            <>
              <h1 className={`${styles.title} text text_type_main-large mb-5`}>Соберите бургер</h1>
              <div className={styles.columnsContainer}>
                <div className={styles.ingredientsColumn}>
                  <BurgerIngredients />
                </div>
                <div className={styles.constructorColumn}>
                  <BurgerConstructor />
                </div>
              </div>
            </>
          } />
          
          <Route path="/login" element={
            <ProtectedRoute onlyUnauth>
              <Login />
            </ProtectedRoute>
          } />
          
          <Route path="/register" element={
            <ProtectedRoute onlyUnauth>
              <Register />
            </ProtectedRoute>
          } />
          
          <Route path="/forgot-password" element={
            <ProtectedRoute onlyUnauth>
              <ForgotPassword />
            </ProtectedRoute>
          } />
          
          <Route path="/reset-password" element={
            <ProtectedRoute onlyUnauth>
              <ResetPassword />
            </ProtectedRoute>
          } />

          <Route path="/feed" element={<FeedPage />} />
          <Route path="/feed/:number" element={<OrderPage />} />
          
          <Route path="/profile/orders/:number" element={
            <ProtectedRoute>
              <ProfileOrderPage />
            </ProtectedRoute>
          } />
          
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }>
            <Route index element={<Profile />} />
            <Route path="orders" element={<ProfileOrdersList />} />
          </Route>

          <Route path="/ingredients/:id" element={<IngredientPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>

        {background && (
          <Routes>
            <Route path="/ingredients/:id" element={
              <Modal title="Детали ингредиента" onClose={handleCloseModal}>
                {currentIngredient ? (
                  <IngredientDetails />
                ) : (
                  <div className="text text_type_main-default">Загрузка ингредиента...</div>
                )}
              </Modal>
            } />
            <Route
              path="/feed/:number"
              element={
                <Modal onClose={handleCloseModal}>
                  {state?.order ? (
                    <OrderDetailsModal order={prepareOrderData(state.order)!} />
                  ) : (
                    <div className="text text_type_main-medium">
                      Заказ не найден
                    </div>
                  )}
                </Modal>
              }
            />
            <Route
              path="/profile/orders/:number"
              element={
                <Modal onClose={handleCloseModal}>
                  {state?.order ? (
                    <OrderDetailsModal order={prepareOrderData(state.order)!} />
                  ) : (
                    <ProfileOrderPage />
                  )}
                </Modal>
              }
            />
          </Routes>
        )}
      </main>
    </>
  );
}

const App = () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.app}>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </div>
    </DndProvider>
  );
}

export default App;