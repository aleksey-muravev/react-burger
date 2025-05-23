import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import { Counter, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './IngredientCategory.module.css';

const Ingredient = ({ ingredient, onClick }) => {
  const [, dragRef] = useDrag({
    type: 'ingredient',
    item: { id: ingredient._id },
  });

  return (
    <div 
      ref={dragRef}
      className={styles.ingredientCard}
      onClick={() => onClick(ingredient)}
      data-testid={`ingredient-${ingredient._id}`}
    >
      {ingredient.count > 0 && (
        <Counter count={ingredient.count} size="default" />
      )}
      <img 
        src={ingredient.image} 
        alt={ingredient.name} 
        className={styles.ingredientImage}
      />
      <div className={styles.priceContainer}>
        <span className={`${styles.price} text text_type_digits-default`}>
          {ingredient.price}
        </span>
        <CurrencyIcon type="primary" />
      </div>
      <p className={`${styles.name} text text_type_main-default`}>
        {ingredient.name}
      </p>
    </div>
  );
};

const IngredientCategory = forwardRef(({ title, items, onIngredientClick }, ref) => {
  return (
    <div ref={ref} className={styles.category}>
      <h2 className={`${styles.categoryTitle} text text_type_main-medium`}>{title}</h2>
      <div className={styles.ingredientsGrid}>
        {items.map(item => (
          <Ingredient
            key={item._id}
            ingredient={item}
            onClick={onIngredientClick}
          />
        ))}
      </div>
    </div>
  );
});

IngredientCategory.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['bun', 'sauce', 'main']).isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      count: PropTypes.number,
    })
  ).isRequired,
  onIngredientClick: PropTypes.func.isRequired
};

export default IngredientCategory;