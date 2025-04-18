import React, { useState, useEffect } from 'react';
import AppHeader from '../AppHeader/AppHeader';
import BurgerIngredients from '../BurgerIngredients/BurgerIngredients';
import BurgerConstructor from '../BurgerConstructor/BurgerConstructor';
import { API_URL } from '../../utils/api';
import styles from './App.module.css';

interface IIngredient {
  _id: string;
  name: string;
  type: 'bun' | 'sauce' | 'main';
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_mobile: string;
  image_large: string;
  __v: number;
}

function App() {
  const [ingredients, setIngredients] = useState<IIngredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const response = await fetch(`${API_URL}/ingredients`);
        if (!response.ok) {
          throw new Error(`Ошибка HTTP: ${response.status}`);
        }
        const data = await response.json();
        setIngredients(data.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Неизвестная ошибка');
        }
        console.error('Ошибка при загрузке ингредиентов:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

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
    <div className={styles.app}>
      <AppHeader />
      
      <main className={styles.mainContent}>
        <h1 className={`${styles.title} text text_type_main-large mb-5`}>Соберите бургер</h1>
        
        <div className={styles.columnsContainer}>
          <div className={styles.ingredientsColumn}>
            <BurgerIngredients ingredients={ingredients} />
          </div>
          
          <div className={styles.constructorColumn}>
            <BurgerConstructor ingredients={ingredients} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;