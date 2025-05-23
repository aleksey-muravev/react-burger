import React, { memo } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import { CheckMarkIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import Vector1 from '../../assets/svg/Vector1';
import Vector2 from '../../assets/svg/Vector2';
import Vector3 from '../../assets/svg/Vector3';
import styles from './OrderDetails.module.css';

// Компоненты вынесены в отдельные функции
const LoadingView = () => (
  <div className={styles.container}>
    <p className="text text_type_main-default">Загрузка данных заказа...</p>
  </div>
);

const ErrorView = ({ error }) => (
  <div className={styles.container}>
    <p className="text text_type_main-default text_color_error">
      Ошибка: {error}
    </p>
  </div>
);

const NoOrderView = () => (
  <div className={styles.container}>
    <p className="text text_type_main-default">Не удалось получить данные заказа</p>
  </div>
);

const OrderNumber = ({ number }) => (
  <p className={`${styles.orderNumber} text text_type_digits-large`}>
    {number}
  </p>
);

const StatusIndicator = () => (
  <div className={styles.statusIndicator}>
    <div className={styles.vectorsContainer}>
      <div className={`${styles.vector} ${styles.vector1}`}><Vector1 /></div>
      <div className={`${styles.vector} ${styles.vector2}`}><Vector2 /></div>
      <div className={`${styles.vector} ${styles.vector3}`}><Vector3 /></div>
    </div>
    <div className={styles.checkmark}>
      <CheckMarkIcon type="primary" size={64} />
    </div>
  </div>
);

const OrderStatusText = () => (
  <>
    <p className="text text_type_main-default">Ваш заказ начали готовить</p>
    <p className={`text text_type_main-default text_color_inactive ${styles.waitText}`}>
      Дождитесь готовности на орбитальной станции
    </p>
  </>
);

// Основной компонент
const OrderDetailsComponent = () => {
  const { order, loading, error } = useSelector(state => ({
    order: state.order.order,
    loading: state.order.loading,
    error: state.order.error
  }), shallowEqual);

  if (loading) return <LoadingView />;
  if (error) return <ErrorView error={error} />;
  if (!order?.success) return <NoOrderView />;

  return (
    <div className={styles.container}>
      <OrderNumber number={order.order.number} />
      <StatusIndicator />
      <OrderStatusText />
    </div>
  );
};


export default memo(OrderDetailsComponent);