import React from 'react';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { Ingredient } from '../../utils/types';
import styles from './OrderFullDetails.module.css';

interface OrderFullDetailsProps {
  order: {
    _id: string;
    number: number;
    name: string;
    status: string;
    ingredients: string[];
    createdAt: string;
    total?: number;
    ingredientsInfo?: Ingredient[];
  };
}

const OrderFullDetails: React.FC<OrderFullDetailsProps> = ({ order }) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const ingredientsWithCount = order.ingredientsInfo 
    ? order.ingredients.reduce((acc, id) => {
        const ingredient = order.ingredientsInfo!.find(item => item._id === id);
        if (!ingredient) return acc;
        
        const existing = acc.find(item => item.ingredient._id === id);
        if (existing) {
          existing.count++;
        } else {
          acc.push({ ingredient, count: 1 });
        }
        return acc;
      }, [] as {ingredient: Ingredient, count: number}[])
    : [];

  const totalPrice = order.total || ingredientsWithCount.reduce(
    (sum, item) => sum + item.ingredient.price * item.count, 
    0
  );

  const statusText = order.status === 'done' ? 'Выполнен' : 'Готовится';
  const statusColor = order.status === 'done' ? '#00CCCC' : '#F2F2F3';

  return (
    <div className={styles.container}>
      <p className={`${styles.number} text text_type_digits-default`}>
        #{order.number}
      </p>
      
      <h1 className={`${styles.title} text text_type_main-medium mt-10`}>
        {order.name}
      </h1>
      
      <p className={`${styles.status} text text_type_main-default mt-3`} style={{ color: statusColor }}>
        {statusText}
      </p>
      
      <h2 className={`${styles.compositionTitle} text text_type_main-medium mt-15`}>
        Состав:
      </h2>
      
      <div className={styles.ingredients}>
        {ingredientsWithCount.map(({ ingredient, count }) => (
          <div key={ingredient._id} className={styles.ingredient}>
            <div className={styles.ingredientImage}>
              <img 
                src={ingredient.image_mobile} 
                alt={ingredient.name}
              />
            </div>
            <p className={`${styles.ingredientName} text text_type_main-default`}>
              {ingredient.name}
            </p>
            <div className={styles.ingredientPrice}>
              <span className="text text_type_digits-default">
                {count} x {ingredient.price}
              </span>
              <CurrencyIcon type="primary" />
            </div>
          </div>
        ))}
      </div>
      
      <div className={styles.footer}>
        <p className="text text_type_main-default text_color_inactive">
          {formatDate(order.createdAt)}
        </p>
        <div className={styles.totalPrice}>
          <span className="text text_type_digits-default">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};

export default OrderFullDetails;