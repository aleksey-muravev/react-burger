import React from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import IngredientDetails from '../../components/IngredientDetails/IngredientDetails';
import styles from './IngredientPage.module.css';

export default function IngredientPage() {
  const { id } = useParams();
  const { items: ingredients, currentIngredient } = useSelector(state => state.ingredients);

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