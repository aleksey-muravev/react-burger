import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import AppHeader from '../AppHeader/AppHeader';
import BurgerIngredients from '../BurgerIngredients/BurgerIngredients';
import BurgerConstructor from '../BurgerConstructor/BurgerConstructor';
import { getIngredients, setCurrentIngredient } from '../../services/ingredients/actions';
import { getUser } from '../../services/auth/actions';
import { ProtectedRoute, ResetPasswordProtected } from '../ProtectedRoute/ProtectedRoute';
import styles from './App.module.css';
import Modal from '../Modal/Modal';
import IngredientDetails from '../IngredientDetails/IngredientDetails';

// Импорты страниц
import Login from '../../pages/Login/Login';
import Register from '../../pages/Register/Register';
import ForgotPassword from '../../pages/ForgotPassword/ForgotPassword';
import ResetPassword from '../../pages/ResetPassword/ResetPassword';
import Profile from '../../pages/Profile/Profile';
import Orders from '../../pages/Profile/Orders/Orders';
import NotFound from '../../pages/NotFound/NotFound';
import IngredientPage from '../../pages/IngredientPage/IngredientPage';

function AppContent() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { 
    items: ingredients, 
    loading: ingredientsLoading, 
    error: ingredientsError,
    currentIngredient
  } = useSelector(state => state.ingredients);

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
      const ingredient = ingredients.find(item => item._id === id);
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

  const background = location.state?.background;
  const handleCloseModal = () => navigate(-1);

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
              <ResetPasswordProtected>
                <ResetPassword />
              </ResetPasswordProtected>
            </ProtectedRoute>
          } />

          <Route path="/feed" element={<NotFound />} />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }>
            <Route path="orders" element={<NotFound />} />
          </Route>

          <Route path="/ingredients/:id" element={<IngredientPage />} />

          <Route path="*" element={<NotFound />} />
        </Routes>

        {background && (
          <Routes>
            <Route path="/ingredients/:id" element={
              <Modal 
                title="Детали ингредиента" 
                onClose={handleCloseModal}
                centerTitle={true}
              >
                {currentIngredient ? (
                  <IngredientDetails />
                ) : (
                  <div className="text text_type_main-default">Загрузка ингредиента...</div>
                )}
              </Modal>
            } />
          </Routes>
        )}
      </main>
    </>
  );
}

function App() {
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