import React, { useState, useRef, useEffect } from 'react';
import { Tab } from '@ya.praktikum/react-developer-burger-ui-components';
import IngredientCategory from './IngredientCategory';
import styles from './BurgerIngredients.module.css';
import PropTypes from 'prop-types';

const BurgerIngredients = ({ ingredients }) => {
  const [currentTab, setCurrentTab] = useState('bun');
  const tabsRef = useRef(null);
  const ingredientsListRef = useRef(null);
  const categoriesRef = {
    bun: useRef(null),
    sauce: useRef(null),
    main: useRef(null)
  };

  const handleTabClick = (tab) => {
    setCurrentTab(tab);
    const categoryElement = categoriesRef[tab].current;
    
    if (ingredientsListRef.current && categoryElement) {
      const scrollPosition = categoryElement.offsetTop - ingredientsListRef.current.offsetTop;
      ingredientsListRef.current.scrollTo({
        top: scrollPosition - 20,
        behavior: 'smooth'
      });
    }
  };

  const ingredientsByType = {
    bun: ingredients.filter(item => item.type === 'bun'),
    sauce: ingredients.filter(item => item.type === 'sauce'),
    main: ingredients.filter(item => item.type === 'main')
  };

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
          <IngredientCategory 
            key={type}
            ref={categoriesRef[type]}
            title={type === 'bun' ? 'Булки' : type === 'sauce' ? 'Соусы' : 'Начинки'}
            items={items}
          />
        ))}
      </div>
    </section>
  );
};
BurgerIngredients.propTypes = {
  ingredients: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['bun', 'sauce', 'main']).isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      count: PropTypes.number
    })
  ).isRequired
};

export default BurgerIngredients;