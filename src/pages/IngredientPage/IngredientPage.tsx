import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import IngredientDetails from '../../components/IngredientDetails/IngredientDetails';
import styles from './IngredientPage.module.css';

type TIngredient = {
  _id: string;
  name: string;
  type: string;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
};

type TIngredientsState = {
  items: TIngredient[];
  currentIngredient: TIngredient | null;
  isLoading: boolean;
  error: null | string;
};

type TRootState = {
  ingredients: TIngredientsState;
};

export default function IngredientPage() {
  const { currentIngredient } = useSelector((state: TRootState) => state.ingredients);

  if (!currentIngredient) {
    return <div className="text text_type_main-default mt-20">Загрузка ингредиента...</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={`${styles.title} text text_type_main-large mt-10`}>
        Детали ингредиента
      </h1>
      <IngredientDetails />
    </div>
  );
}