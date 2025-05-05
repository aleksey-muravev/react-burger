import React, { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';
import AppHeader from '../AppHeader/AppHeader';
import BurgerIngredients from '../BurgerIngredients/BurgerIngredients';
import BurgerConstructor from '../BurgerConstructor/BurgerConstructor';
import { getIngredients } from '../../services/ingredients/actions';
import styles from './App.module.css';

function App() {
  const dispatch = useDispatch();
  const { items: ingredients, loading, error } = useSelector(state => state.ingredients);

  useEffect(() => {
    dispatch(getIngredients());
  }, [dispatch]);

  if (loading) {
    return <div className="text text_type_main-medium">Загрузка ингредиентов...</div>;
  }

  if (error) {
    return (
      <div className="text text_type_main-medium text_color_error">
        Ошибка: {error}
      </div>
    );
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <div className={styles.app}>
        <AppHeader />
        
        <main className={styles.mainContent}>
          <h1 className={`${styles.title} text text_type_main-large mb-5`}>Соберите бургер</h1>
          
          <div className={styles.columnsContainer}>
            <div className={styles.ingredientsColumn}>
              <BurgerIngredients />
            </div>
            
            <div className={styles.constructorColumn}>
              <BurgerConstructor />
            </div>
          </div>
        </main>
      </div>
    </DndProvider>
  );
}

export default App;