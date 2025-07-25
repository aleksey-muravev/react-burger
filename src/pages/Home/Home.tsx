import React from 'react';
import styles from './Home.module.css';
import BurgerIngredients from '../../components/BurgerIngredients/BurgerIngredients';
import BurgerConstructor from '../../components/BurgerConstructor/BurgerConstructor';

export const HomePage: React.FC = () => {
  return (
    <>
      <h1 className={`${styles.title} text text_type_main-large mb-5`}>
        Соберите бургер
      </h1>
      <div className={styles.columnsContainer}>
        <div className={styles.ingredientsColumn}>
          <BurgerIngredients />
        </div>
        <div className={styles.constructorColumn}>
          <BurgerConstructor />
        </div>
      </div>
    </>
  );
};