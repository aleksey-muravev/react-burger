import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux'; // Добавлен импорт useSelector
import { CheckMarkIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import Vector1 from '../../assets/svg/Vector1';
import Vector2 from '../../assets/svg/Vector2';
import Vector3 from '../../assets/svg/Vector3';
import styles from './OrderDetails.module.css';

const OrderDetails = () => {
  const { order, loading, error } = useSelector(state => state.order);

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
        <p className="text text_type_main-default">
          Не удалось получить данные заказа
        </p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <p className={`${styles.orderNumber} text text_type_digits-large`}>
        {order.order.number}
      </p>
      <p className={`text text_type_main-medium ${styles.orderIdText}`}>
        идентификатор заказа
      </p>
      
      <div className={styles.statusIndicator}>
        <div className={styles.vectorsContainer}>
          <div className={`${styles.vector} ${styles.vector1}`}>
            <Vector1 />
          </div>
          <div className={`${styles.vector} ${styles.vector2}`}>
            <Vector2 />
          </div>
          <div className={`${styles.vector} ${styles.vector3}`}>
            <Vector3 />
          </div>
        </div>
        <div className={styles.checkmark}>
          <CheckMarkIcon type="primary" size={64} />
        </div>
      </div>
      
      <p className="text text_type_main-default">
        Ваш заказ начали готовить
      </p>
      <p className={`text text_type_main-default text_color_inactive ${styles.waitText}`}>
        Дождитесь готовности на орбитальной станции
      </p>
    </div>
  );
};

OrderDetails.propTypes = {
  order: PropTypes.shape({
    success: PropTypes.bool,
    order: PropTypes.shape({
      number: PropTypes.number
    })
  }),
  loading: PropTypes.bool,
  error: PropTypes.string
};

export default OrderDetails;