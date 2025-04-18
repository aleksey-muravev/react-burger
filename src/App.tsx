import React from 'react';
import AppHeader from './components/AppHeader';
import BurgerIngredients from './components/BurgerIngredients';
import BurgerConstructor from './components/BurgerConstructor';
import { ingredientsData } from './utils/data';
import styles from './App.module.css';

function App() {
  return (
    <div className={styles.app}>
      <AppHeader />
      
      <main className={styles.mainContent}>
        <h1 className={`${styles.title} text text_type_main-large mb-5`}>Соберите бургер</h1>
        
        <div className={styles.columnsContainer}>
          {/* Левая колонка - ингредиенты */}
          <div className={styles.ingredientsColumn}>
            <BurgerIngredients ingredients={ingredientsData} />
          </div>
          
          {/* Правая колонка - конструктор */}
          <div className={styles.constructorColumn}>
            <BurgerConstructor ingredients={ingredientsData} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;