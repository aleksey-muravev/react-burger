import React from 'react';
import PropTypes from 'prop-types';
import { CheckMarkIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import Vector1 from '../../assets/svg/Vector1';
import Vector2 from '../../assets/svg/Vector2';
import Vector3 from '../../assets/svg/Vector3';
import styles from './OrderDetails.module.css';

const TEST_ORDER_NUMBER = '034536';

const OrderDetails = ({ orderNumber = TEST_ORDER_NUMBER }) => {
  return (
    <div className={styles.container}>
      <h2 className={`${styles.orderNumber} text text_type_digits-large`}>
        {orderNumber}
      </h2>
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
          <CheckMarkIcon type="primary" />
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
  orderNumber: PropTypes.string
};

export default OrderDetails;