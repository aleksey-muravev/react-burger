import React, { useEffect } from 'react';
import { wsConnectionStart, wsConnectionClosed } from '../../services/websocket/actions';
import FeedOrderCard from '../../components/OrderCard/FeedOrderCard';
import styles from './FeedPage.module.css';
import { useAppDispatch, useAppSelector } from '../../hooks/useTypedRedux';
import type { RootState } from '../../services/store';
import type { Order } from '../../utils/types';

const FeedPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { orders, total, totalToday } = useAppSelector((state: RootState) => state.ws);
  const ingredients = useAppSelector((state: RootState) => state.ingredients.items);

  useEffect(() => {
    // Передаем URL для публичного канала заказов
    dispatch(wsConnectionStart('wss://norma.nomoreparties.space/orders/all'));
    return () => {
      dispatch(wsConnectionClosed());
    };
  }, [dispatch]);

  const doneOrders = orders
    .filter((order: Order) => order.status === 'done')
    .slice(0, 10)
    .map((order: Order) => order.number);

  const pendingOrders = orders
    .filter((order: Order) => order.status === 'pending')
    .slice(0, 10)
    .map((order: Order) => order.number);

  return (
    <div className={styles.container}>
      <h1 className={styles.mainTitle}>Лента заказов</h1>
      
      <div className={styles.content}>
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Заказы</h2>
          <div className={styles.ordersContainer}>
            {orders.map((order: Order) => (
              <FeedOrderCard 
                key={order._id} 
                order={order} 
                ingredientsData={ingredients}
              />
            ))}
          </div>
        </div>
        
        <div className={styles.section}>
          <div className={styles.statusContainer}>
            <div className={styles.statusColumn}>
              <h3 className={styles.sectionTitle}>Готовы:</h3>
              <div className={styles.ordersGrid}>
                {doneOrders.map((number: number) => (
                  <p key={number} className={`text text_type_digits-default ${styles.orderNumber}`}>
                    #{number}
                  </p>
                ))}
              </div>
            </div>
            <div className={styles.statusColumn}>
              <h3 className={styles.sectionTitle}>В работе:</h3>
              <div className={styles.ordersGrid}>
                {pendingOrders.map((number: number) => (
                  <p key={number} className="text text_type_digits-default">
                    #{number}
                  </p>
                ))}
              </div>
            </div>
          </div>
          
          <div className={styles.totalContainer}>
            <h3 className={styles.sectionTitle}>Выполнено за все время:</h3>
            <p className={`text text_type_digits-large ${styles.totalNumber}`}>{total}</p>
          </div>
          
          <div className={styles.totalContainer}>
            <h3 className={styles.sectionTitle}>Выполнено за сегодня:</h3>
            <p className={`text text_type_digits-large ${styles.totalNumber}`}>{totalToday}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;