import React, { useState, useRef, useEffect, useMemo, FC, useCallback } from 'react';
import { Tab, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { useDispatch, useSelector } from 'react-redux';
import { useDrag } from 'react-dnd';
import { useNavigate, useLocation } from 'react-router-dom';
import IngredientCategory from './IngredientCategory/IngredientCategory';
import styles from './BurgerIngredients.module.css';
import { setCurrentIngredient, getIngredients } from '../../services/ingredients/actions';
import { RootState } from '../../services/store';
import type { Ingredient as IngredientType } from '../../utils/types';
import { AnyAction } from '@reduxjs/toolkit';

interface IngredientProps {
  ingredient: IngredientType;
  onClick: (ingredient: IngredientType) => void;
}

interface BurgerConstructorState {
  bun: IngredientType | null;
  ingredients: IngredientType[];
}

interface IngredientsState {
  items: IngredientType[];
  loading: boolean;
  error: string | null;
}

const Ingredient: FC<IngredientProps> = ({ ingredient, onClick }) => {
  const [, dragRef] = useDrag({
    type: 'ingredient',
    item: { id: ingredient._id },
  });

  // Создаем совместимый ref для drag-and-drop
  const setDragRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      dragRef(node);
    }
  }, [dragRef]);

  return (
    <div 
      ref={setDragRef}
      onClick={() => onClick(ingredient)}
      className={styles.ingredient}
      data-testid={`ingredient-${ingredient._id}`}
    >
      <img src={ingredient.image} alt={ingredient.name} />
      <span className={`${styles.price} text text_type_digits-default`}>
        {ingredient.price} <CurrencyIcon type="primary" />
      </span>
      <p className={`${styles.name} text text_type_main-default`}>{ingredient.name}</p>
    </div>
  );
};

const BurgerIngredients: FC = () => {
  const [currentTab, setCurrentTab] = useState<'bun' | 'sauce' | 'main'>('bun');
  const tabsRef = useRef<HTMLDivElement>(null);
  const ingredientsListRef = useRef<HTMLDivElement>(null);
  const categoriesRef = {
    bun: useRef<HTMLDivElement>(null),
    sauce: useRef<HTMLDivElement>(null),
    main: useRef<HTMLDivElement>(null)
  };
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  
  const { items: ingredients } = useSelector((state: RootState) => state.ingredients as IngredientsState);
  const { bun, ingredients: constructorIngredients } = useSelector(
    (state: RootState) => state.burgerConstructor as BurgerConstructorState
  );

  useEffect(() => {
    if (!ingredients.length) {
      dispatch(getIngredients() as unknown as AnyAction);
    }
  }, [dispatch, ingredients.length]);

  const ingredientsWithCount = useMemo(() => {
    return ingredients.map(ingredient => {
      let count = 0;
      if (ingredient.type === 'bun' && bun && bun._id === ingredient._id) {
        count = 2;
      } else {
        count = constructorIngredients.filter(item => item._id === ingredient._id).length;
      }
      return { ...ingredient, count };
    });
  }, [ingredients, bun, constructorIngredients]);

  const ingredientsByType = useMemo(() => ({
    bun: ingredientsWithCount.filter(item => item.type === 'bun'),
    sauce: ingredientsWithCount.filter(item => item.type === 'sauce'),
    main: ingredientsWithCount.filter(item => item.type === 'main')
  }), [ingredientsWithCount]);

  useEffect(() => {
    const container = ingredientsListRef.current;
    if (!container) return;

    const handleScroll = () => {
      const containerTop = container.getBoundingClientRect().top;
      let closestCategory: 'bun' | 'sauce' | 'main' | null = null;
      let smallestDistance = Infinity;

      Object.entries(categoriesRef).forEach(([type, ref]) => {
        if (ref.current) {
          const categoryTop = ref.current.getBoundingClientRect().top;
          const distance = Math.abs(categoryTop - containerTop);
          
          if (distance < smallestDistance) {
            smallestDistance = distance;
            closestCategory = type as 'bun' | 'sauce' | 'main';
          }
        }
      });

      if (closestCategory && currentTab !== closestCategory) {
        setCurrentTab(closestCategory);
      }
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, [currentTab]);

  const handleTabClick = useCallback((tab: 'bun' | 'sauce' | 'main') => {
    setCurrentTab(tab);
    const categoryElement = categoriesRef[tab].current;
    
    if (ingredientsListRef.current && categoryElement) {
      const scrollPosition = categoryElement.offsetTop - ingredientsListRef.current.offsetTop;
      ingredientsListRef.current.scrollTo({
        top: scrollPosition - 20,
        behavior: 'smooth'
      });
    }
  }, []);

  const handleIngredientClick = useCallback((ingredient: IngredientType) => {
    dispatch(setCurrentIngredient(ingredient));
    navigate(`/ingredients/${ingredient._id}`, {
      state: { background: location }
    });
  }, [dispatch, navigate, location]);

  if (!ingredients.length) {
    return <div className="text text_type_main-default">Ингредиенты не найдены</div>;
  }

  return (
    <section className={styles.container}>
      <div className={styles.tabs} ref={tabsRef}>
        <Tab value="bun" active={currentTab === 'bun'} onClick={() => handleTabClick('bun')}>
          Булки
        </Tab>
        <Tab value="sauce" active={currentTab === 'sauce'} onClick={() => handleTabClick('sauce')}>
          Соусы
        </Tab>
        <Tab value="main" active={currentTab === 'main'} onClick={() => handleTabClick('main')}>
          Начинки
        </Tab>
      </div>

      <div className={styles.ingredientsList} ref={ingredientsListRef}>
        {Object.entries(ingredientsByType).map(([type, items]) => (
          <div key={type} ref={categoriesRef[type as 'bun' | 'sauce' | 'main']}>
            <IngredientCategory
              title={type === 'bun' ? 'Булки' : type === 'sauce' ? 'Соусы' : 'Начинки'}
              items={items}
              onIngredientClick={handleIngredientClick}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default BurgerIngredients;