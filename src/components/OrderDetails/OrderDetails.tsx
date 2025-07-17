import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { CheckMarkIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import Vector1 from '../../assets/svg/Vector1';
import Vector2 from '../../assets/svg/Vector2';
import Vector3 from '../../assets/svg/Vector3';
import styles from './OrderDetails.module.css';
import { RootState } from '../../utils/types';
import { shallowEqual } from 'react-redux';

const OrderDetails: FC = () => {
  const { order, loading, error } = useSelector((state: RootState) => ({
    order: state.order.order,
    loading: state.order.loading,
    error: state.order.error
  }), shallowEqual); // Добавляем shallowEqual для сравнения

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

  if (!order) {
    return (
      <div className={styles.container}>
        <p className="text text_type_main-default">Не удалось получить данные заказа</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <p className={`${styles.orderNumber} text text_type_digits-large`}>
        {order.number}
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

export default OrderDetails;