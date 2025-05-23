import React from 'react';
import { useSelector } from 'react-redux';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './IngredientDetails.module.css';

const IngredientDetails = () => {
  const { currentIngredient } = useSelector(state => state.ingredients);

  if (!currentIngredient) return null;

  return (
    <div className={styles.container}>
      <img 
        src={currentIngredient.image_large} 
        alt={currentIngredient.name}
        className={styles.image}
      />
      <h3 className={`${styles.name} text text_type_main-medium mt-4 mb-8`}>
        {currentIngredient.name}
      </h3>
      
      <div className={styles.nutrition}>
        <div className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Калории,ккал
          </span>
          <span className="text text_type_digits-default text_color_inactive mt-2">
            {currentIngredient.calories}
          </span>
        </div>
        <div className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Белки,г
          </span>
          <span className="text text_type_digits-default text_color_inactive mt-2">
            {currentIngredient.proteins}
          </span>
        </div>
        <div className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Жиры,г
          </span>
          <span className="text text_type_digits-default text_color_inactive mt-2">
            {currentIngredient.fat}
          </span>
        </div>
        <div className={styles.nutritionItem}>
          <span className="text text_type_main-default text_color_inactive">
            Углеводы,г
          </span>
          <span className="text text_type_digits-default text_color_inactive mt-2">
            {currentIngredient.carbohydrates}
          </span>
        </div>
      </div>
    </div>
  );
};

export default IngredientDetails;