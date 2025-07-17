import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { Ingredient, Order } from '../../utils/types';
import styles from './ProfileOrderCard.module.css';

interface ProfileOrderCardProps {
  order: Order & { ingredientsData: Ingredient[] };
}

const ProfileOrderCard: React.FC<ProfileOrderCardProps> = ({ order }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    navigate(`/profile/orders/${order.number}`, { 
      state: { 
        background: location,
        order: {
          ...order,
          ingredients: order.ingredientsData.map(i => i._id)
        }
      } 
    });
  };

  const statusText = () => {
    switch (order.status) {
      case 'done': return 'Выполнен';
      case 'pending': return 'Готовится';
      case 'created': return 'Создан';
      default: return order.status;
    }
  };

  const statusColor = order.status === 'done' ? '#00CCCC' : '#F2F2F3';

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
        {statusText()}
      </p>
      
      <div className={styles.footer}>
        <div className={styles.ingredients}>
          {order.ingredientsData.slice(0, 6).map((ingredient, i) => (
            <div key={i} className={styles.ingredient} style={{ zIndex: 6 - i }}>
              <img 
                src={ingredient.image_mobile} 
                alt={ingredient.name}
                className={styles.ingredientImage}
              />
              {i === 5 && order.ingredientsData.length > 6 && (
                <span className={styles.remaining}>
                  +{order.ingredientsData.length - 6}
                </span>
              )}
            </div>
          ))}
        </div>
        
        <div className={styles.price}>
          <span className="text text_type_digits-default mr-2">
            {order.ingredientsData.reduce((sum, ing) => sum + ing.price, 0)}
          </span>
          <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};

export default ProfileOrderCard;