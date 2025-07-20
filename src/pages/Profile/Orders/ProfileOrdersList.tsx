import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { wsUserConnectionStart, wsConnectionClosed } from '../../../services/websocket/actions';
import { getCookie } from '../../../utils/cookie';
import styles from './ProfileOrdersList.module.css';
import { CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { formatDate } from '../../../utils/date';
import { useAppDispatch, useAppSelector } from '../../../hooks/useTypedRedux';
import type { RootState } from '../../../services/store';
import type { Ingredient, Order } from '../../../utils/types';

const ProfileOrdersList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { userOrders, wsConnected, error } = useAppSelector((state: RootState) => state.ws);
  const { isAuthenticated, user } = useAppSelector((state: RootState) => state.auth);
  const ingredients = useAppSelector((state: RootState) => state.ingredients.items);
  
  const [connectionAttempts, setConnectionAttempts] = useState(0);
  const [showLoader, setShowLoader] = useState(true);
  const [connectionError, setConnectionError] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (isAuthenticated && user) {
      const token = getCookie('accessToken');
      if (token) {
        dispatch(wsUserConnectionStart(token));
        
        // Таймер для отображения ошибки, если соединение не установилось
        timeoutId = setTimeout(() => {
          if (!wsConnected && connectionAttempts < 3) {
            setConnectionAttempts(prev => prev + 1);
            dispatch(wsUserConnectionStart(token));
          } else if (!wsConnected) {
            setShowLoader(false);
            setConnectionError(true);
          }
        }, 5000);
      }
    }

    return () => {
      clearTimeout(timeoutId);
      dispatch(wsConnectionClosed());
    };
  }, [dispatch, isAuthenticated, user, connectionAttempts]);

  useEffect(() => {
    // Сбрасываем состояние ошибки при успешном подключении
    if (wsConnected) {
      setConnectionError(false);
      setShowLoader(false);
      setConnectionAttempts(0);
    }
  }, [wsConnected]);

  const enrichedOrders = userOrders.map((order: Order) => ({
    ...order,
    ingredientsData: order.ingredients
      .map((id: string) => ingredients.find((ing: Ingredient) => ing._id === id))
      .filter(Boolean) as Ingredient[],
    price: order.ingredients.reduce((sum: number, id: string) => {
      const ingredient = ingredients.find((ing: Ingredient) => ing._id === id);
      return sum + (ingredient?.price || 0);
    }, 0)
  }));

  const renderIngredientsPreview = (ingredients: Ingredient[]) => {
    const visibleIngredients = ingredients.slice(0, 6);
    const remaining = ingredients.length - 6;

    return (
      <div className={styles.ingredientsPreview}>
        {visibleIngredients.reverse().map((ingredient: Ingredient, index: number) => (
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
          ingredients: order.ingredientsData.map((i: Ingredient) => i._id)
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

  if (connectionError) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-default mt-10 text_color_error">
          Не удалось подключиться к серверу. Пожалуйста, обновите страницу.
        </p>
        <button 
          className={`${styles.retryButton} text text_type_main-default mt-4`}
          onClick={() => window.location.reload()}
        >
          Обновить
        </button>
      </div>
    );
  }

  if (showLoader || !wsConnected) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-default mt-10">
          {connectionAttempts > 0 
            ? `Попытка подключения (${connectionAttempts}/3)...` 
            : 'Подключаемся к серверу...'}
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

  return (
    <div className={styles.container}>
      <div className={styles.ordersContainer}>
        {enrichedOrders.length > 0 ? (
          enrichedOrders.map((order: typeof enrichedOrders[0]) => (
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