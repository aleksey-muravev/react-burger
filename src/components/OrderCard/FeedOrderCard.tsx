import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { Ingredient, Order } from '../../utils/types';
import styles from './FeedOrderCard.module.css';

interface FeedOrderCardProps {
  order: Order;
  ingredientsData: Ingredient[];
}

const FeedOrderCard: React.FC<FeedOrderCardProps> = ({ order, ingredientsData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const totalPrice = order.ingredients.reduce((sum, id) => {
    const ingredient = ingredientsData.find(item => item._id === id);
    return sum + (ingredient?.price || 0);
  }, 0);

  const statusText = order.status === 'done' ? 'Выполнен' : 'Готовится';
  const statusColor = order.status === 'done' ? '#00CCCC' : '#F2F2F3';

  const handleClick = () => {
    navigate(`/feed/${order.number}`, { 
      state: { 
        background: location,
        order: {
          ...order,
          ingredientsData,
          totalPrice
        }
      } 
    });
  };

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.header}>
        <span className="text text_type_digits-default">#{order.number}</span>
        <span className="text text_type_main-default text_color_inactive">
          {new Date(order.createdAt).toLocaleDateString('ru-RU', {
            day: 'numeric',
            month: 'long',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </span>
      </div>
      
      <h3 className={`${styles.title} text text_type_main-medium mt-6`}>
        {order.name}
      </h3>
      
      <p className={`text text_type_main-default mt-2`} style={{ color: statusColor }}>
        {statusText}
      </p>
      
      <div className={styles.footer}>
        <div className={styles.ingredients}>
          {order.ingredients.slice(0, 6).map((id, i) => {
            const ingredient = ingredientsData.find(item => item._id === id);
            return (
              <div key={i} className={styles.ingredient} style={{ zIndex: 6 - i }}>
                {ingredient && (
                  <img 
                    src={ingredient.image_mobile} 
                    alt={ingredient.name}
                    className={styles.ingredientImage}
                  />
                )}
                {i === 5 && order.ingredients.length > 6 && (
                  <span className={styles.remaining}>
                    +{order.ingredients.length - 6}
                  </span>
                )}
              </div>
            );
          })}
        </div>
        
        <div className={styles.price}>
          <span className="text text_type_digits-default mr-2">
            {totalPrice}
          </span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};

export default FeedOrderCard;