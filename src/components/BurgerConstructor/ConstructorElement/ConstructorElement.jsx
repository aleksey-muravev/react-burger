import React from 'react';
import { ConstructorElement, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './ConstructorElement.module.css';

const ConstructorElementWrapper = ({ item, type, isLocked, text, price, thumbnail }) => {
  if (item) {
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
  }

  return (
    <ConstructorElement
      type={type}
      isLocked={isLocked}
      text={text}
      price={price}
      thumbnail={thumbnail}
    />
  );
};

export default ConstructorElementWrapper;