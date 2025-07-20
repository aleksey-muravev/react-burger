import React from 'react';
import styles from './IngredientDetails.module.css';
import { useAppSelector } from '../../hooks/useTypedRedux';
import type { RootState } from '../../services/store';

interface Ingredient {
  image_large: string;
  name: string;
  calories: number;
  proteins: number;
  fat: number;
  carbohydrates: number;
}

interface IngredientDetailsProps {
  className?: string;
}

const IngredientDetails = ({ className = '' }: IngredientDetailsProps) => {
  const currentIngredient = useAppSelector(
    (state: RootState) => state.ingredients.currentIngredient
  );

  if (!currentIngredient) {
    return <div className="text text_type_main-default">Ингредиент не загружен</div>;
  }

  return (
    <div className={`${styles.container} ${className}`}>
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