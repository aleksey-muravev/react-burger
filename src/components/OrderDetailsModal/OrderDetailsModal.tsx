import React from 'react';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './OrderDetailsModal.module.css';

interface OrderDetailsModalProps {
  order: {
    number: number;
    name: string;
    status: string;
    ingredients: string[]; // массив ID ингредиентов в заказе
    ingredientsInfo: Array<{
      _id: string;
      name: string;
      price: number;
      image_mobile: string;
    }>;
    total: number;
    createdAt: string;
  };
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({ order }) => {
  if (!order) {
    return <div className="text text_type_main-medium">Загрузка данных...</div>;
  }

  // Создаем массив уникальных ингредиентов с количеством
  const ingredientsWithCount = order.ingredients.reduce((acc, id) => {
    const ingredient = order.ingredientsInfo.find(item => item._id === id);
    if (!ingredient) return acc;
    
    const existing = acc.find(item => item.ingredient._id === id);
    if (existing) {
      existing.count++;
    } else {
      acc.push({ ingredient, count: 1 });
    }
    return acc;
  }, [] as {ingredient: typeof order.ingredientsInfo[0], count: number}[]);

  const statusText = order.status === 'done' ? 'Выполнен' : 'Готовится';
  const statusColor = order.status === 'done' ? '#00CCCC' : '#F2F2F3';

  return (
    <div className={styles.container}>
      <p className={`${styles.number} text text_type_digits-default`}>
        #{order.number}
      </p>
      
      <h2 className={`${styles.title} text text_type_main-medium mt-10`}>
        {order.name}
      </h2>
      
      <p className={`${styles.status} text text_type_main-default mt-3`} style={{ color: statusColor }}>
        {statusText}
      </p>
      
      <h3 className={`${styles.compositionTitle} text text_type_main-medium mt-15`}>
        Состав:
      </h3>
      
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
          {new Date(order.createdAt).toLocaleString('ru-RU', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
        <div className={styles.totalPrice}>
          <span className="text text_type_digits-default">{order.total}</span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};

export default OrderDetailsModal;