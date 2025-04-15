import React from 'react';
import { ConstructorElement, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerConstructor.module.css';

const ConstructorElementWrapper = ({ item }) => {
  return (
    <div className={styles.filling}>
      <DragIcon type="primary" className={styles.dragIcon} />
      <ConstructorElement
        text={item.name}
        price={item.price}
        thumbnail={item.image}
      />
    </div>
  );
};

export default ConstructorElementWrapper;