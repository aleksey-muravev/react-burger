import React from 'react';
import PropTypes from 'prop-types';
import { CheckMarkIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './OrderDetails.module.css';

// Локальные тестовые данные (временное решение)
const testOrder = {
  number: '034536',
  status: 'Ваш заказ начали готовить',
  message: 'Дождитесь готовности на орбитальной станции'
};

const OrderDetails = () => {
  return (
    <div className={styles.container}>
      <h2 className={`${styles.number} text text_type_digits-large mb-8`}>
        {testOrder.number}
      </h2>
      <p className="text text_type_main-medium mb-15">
        идентификатор заказа
      </p>
      
      <div className={`${styles.icon} mb-15`}>
        <CheckMarkIcon type="primary" />
      </div>
      
      <p className="text text_type_main-default mb-2">
        {testOrder.status}
      </p>
      <p className="text text_type_main-default text_color_inactive">
        {testOrder.message}
      </p>
    </div>
  );
};

OrderDetails.propTypes = {
  orderNumber: PropTypes.string,
  status: PropTypes.string,
  message: PropTypes.string
};

OrderDetails.defaultProps = {
  orderNumber: '000000',
  status: 'Ваш заказ начали готовить',
  message: 'Дождитесь готовности на орбитальной станции'
};

export default OrderDetails;