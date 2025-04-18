import React from 'react';
import { Counter, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import PropTypes from 'prop-types';
import styles from './IngredientCategory.module.css';
import { IngredientType } from '../../../utils/types';

const IngredientCategory = ({ title, items, onSelect }) => {
  return (
    <div className={styles.category}>
      <h2 className={`${styles.categoryTitle} text text_type_main-medium`}>{title}</h2>
      <div className={styles.ingredientsGrid}>
        {items.map(item => (
          <div 
            key={item._id} 
            className={styles.ingredientCard}
            onClick={() => onSelect(item._id)}
          >
            {item.count > 0 && (
              <Counter count={item.count} size="default" />
            )}
            <img 
              src={item.image} 
              alt={item.name} 
              className={styles.ingredientImage}
            />
            <div className={styles.priceContainer}>
              <span className={`${styles.price} text text_type_digits-default`}>
                {item.price}
              </span>
              <CurrencyIcon type="primary" />
            </div>
            <p className={`${styles.name} text text_type_main-default`}>
              {item.name}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

IngredientCategory.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(IngredientType).isRequired,
  onSelect: PropTypes.func.isRequired
};

export default IngredientCategory;