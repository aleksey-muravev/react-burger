import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { RootState } from '../../../utils/types';
import { wsUserConnectionStart, wsConnectionClosed } from '../../../services/websocket/actions';
import { getCookie } from '../../../utils/cookie';
import styles from './ProfileOrdersList.module.css';
import { Ingredient } from '../../../utils/types';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { formatDate } from '../../../utils/date';

const ProfileOrdersList: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userOrders, wsConnected, error } = useSelector((state: RootState) => state.ws);
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const ingredients = useSelector((state: RootState) => state.ingredients.items);

  useEffect(() => {
    if (isAuthenticated && user) {
      const token = getCookie('accessToken');
      if (token) {
        dispatch(wsUserConnectionStart(token));
      }
    }

    return () => {
      dispatch(wsConnectionClosed());
    };
  }, [dispatch, isAuthenticated, user]);

  const enrichedOrders = userOrders.map(order => ({
    ...order,
    ingredientsData: order.ingredients
      .map(id => ingredients.find(ing => ing._id === id))
      .filter(Boolean) as Ingredient[],
    price: order.ingredients.reduce((sum, id) => {
      const ingredient = ingredients.find(ing => ing._id === id);
      return sum + (ingredient?.price || 0);
    }, 0)
  }));

  const renderIngredientsPreview = (ingredients: Ingredient[]) => {
    const visibleIngredients = ingredients.slice(0, 6);
    const remaining = ingredients.length - 6;

    return (
      <div className={styles.ingredientsPreview}>
        {visibleIngredients.reverse().map((ingredient, index) => (
          <div key={index} className={styles.ingredientCircle}>
            <img 
              src={ingredient.image_mobile} 
              alt={ingredient.name}
              className={styles.ingredientImage}
            />
          </div>
        ))}
        {remaining > 0 && (
          <div className={styles.remainingIngredients}>+{remaining}</div>
        )}
      </div>
    );
  };

  const handleOrderClick = (order: typeof enrichedOrders[0]) => {
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

  if (!isAuthenticated) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-default mt-10">
          Для просмотра истории заказов необходимо авторизоваться
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-default mt-10 text_color_error">
          {typeof error === 'string' ? error : 'Ошибка подключения'}
        </p>
      </div>
    );
  }

  if (!wsConnected) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-default mt-10">
          Подключаемся к серверу...
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.ordersContainer}>
        {enrichedOrders.length > 0 ? (
          enrichedOrders.map(order => (
            <div 
              key={order._id}
              className={styles.orderCard}
              onClick={() => handleOrderClick(order)}
            >
              <div className={styles.orderHeader}>
                <span className={styles.orderNumber}>#{order.number}</span>
                <span className={styles.orderDate}>
                  {formatDate(order.createdAt)}
                </span>
              </div>
              <h3 className={styles.orderName}>{order.name}</h3>
              <p className={`${styles.orderStatus} ${
                order.status === 'done' ? styles.done : ''
              }`}>
                {order.status === 'done' ? 'Выполнен' : 
                 order.status === 'pending' ? 'Готовится' : 'Создан'}
              </p>
              <div className={styles.orderBottom}>
                {renderIngredientsPreview(order.ingredientsData)}
                <div className={styles.priceContainer}>
                  <span className={styles.price}>{order.price}</span>
                  <CurrencyIcon type="primary" />
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text text_type_main-default mt-10">
            {wsConnected ? 'У вас пока нет заказов' : 'Нет данных о заказах'}
          </p>
        )}
      </div>
    </div>
  );
};

export default ProfileOrdersList;