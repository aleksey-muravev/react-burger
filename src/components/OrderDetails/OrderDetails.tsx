import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { CheckMarkIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import Vector1 from '../../assets/svg/Vector1';
import Vector2 from '../../assets/svg/Vector2';
import Vector3 from '../../assets/svg/Vector3';
import styles from './OrderDetails.module.css';
import { RootState } from '../../utils/types';

// Тип для данных заказа в Redux store
interface OrderData {
  success?: boolean;
  name?: string;
  order?: {
    number: number;
  };
}

const OrderDetailsComponent: FC = () => {
  const { order, loading, error } = useSelector((state: RootState) => ({
    order: state.order.order as OrderData | null,
    loading: state.order.loading,
    error: state.order.error
  }));

  // Отладочный вывод
  console.log('Current order data:', order);

  if (loading) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-default">Загрузка данных заказа...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-default text_color_error">
          Ошибка: {error}
        </p>
      </div>
    );
  }

  if (!order?.success) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-default">Не удалось получить данные заказа</p>
      </div>
    );
  }

  const orderNumber = order?.order?.number;

  if (!orderNumber) {
    console.error('Invalid order data structure:', order);
    return (
      <div className={styles.container}>
        <p className="text text_type_main-default text_color_error">
          Номер заказа недоступен
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <p className={`${styles.orderNumber} text text_type_digits-large`}>
        {orderNumber}
      </p>
      
      <div className={styles.statusIndicator}>
        <div className={styles.vectorsContainer}>
          <div className={`${styles.vector} ${styles.vector1}`}><Vector1 /></div>
          <div className={`${styles.vector} ${styles.vector2}`}><Vector2 /></div>
          <div className={`${styles.vector} ${styles.vector3}`}><Vector3 /></div>
        </div>
        <div className={styles.checkmark}>
          <CheckMarkIcon type="primary" />
        </div>
      </div>
      
      <p className="text text_type_main-default">Ваш заказ начали готовить</p>
      <p className={`text text_type_main-default text_color_inactive ${styles.waitText}`}>
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};

export default OrderDetailsComponent;