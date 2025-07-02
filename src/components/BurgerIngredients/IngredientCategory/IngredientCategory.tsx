import React, { FC, forwardRef } from 'react';
import { useDrag } from 'react-dnd';
import { Counter, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './IngredientCategory.module.css';
import type { Ingredient as IngredientType } from '../../../utils/types';

interface IngredientItemProps {
  ingredient: IngredientType;
  onClick: (ingredient: IngredientType) => void;
}

const IngredientItem: FC<IngredientItemProps> = ({ ingredient, onClick }) => {
  const [_, dragRef] = useDrag({
    type: 'ingredient',
    item: { id: ingredient._id },
  });

  // Создаем совместимый ref
  const compatibleRef = (node: HTMLDivElement | null) => {
    if (node) {
      dragRef(node);
    }
  };

  return (
    <div 
      ref={compatibleRef}
      className={styles.ingredientCard}
      onClick={() => onClick(ingredient)}
      data-testid={`ingredient-${ingredient._id}`}
    >
      {ingredient.count && ingredient.count > 0 && (
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

interface IngredientCategoryProps {
  title: string;
  items: IngredientType[];
  onIngredientClick: (ingredient: IngredientType) => void;
}

const IngredientCategory = forwardRef<HTMLDivElement, IngredientCategoryProps>(
  ({ title, items, onIngredientClick }, ref) => {
    return (
      <div ref={ref} className={styles.category}>
        <h2 className={`${styles.categoryTitle} text text_type_main-medium`}>{title}</h2>
        <div className={styles.ingredientsGrid}>
          {items.map((item) => (
            <IngredientItem
              key={item._id}
              ingredient={item}
              onClick={onIngredientClick}
            />
          ))}
        </div>
      </div>
    );
  }
);

IngredientCategory.displayName = 'IngredientCategory';

export default IngredientCategory;