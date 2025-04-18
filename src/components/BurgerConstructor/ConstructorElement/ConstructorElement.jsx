import React from 'react';
import PropTypes from 'prop-types';
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


ConstructorElement.propTypes = {
  item: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    price: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired
  }),
  type: PropTypes.oneOf(['top', 'bottom']),
  isLocked: PropTypes.bool,
  text: PropTypes.string,
  price: PropTypes.number,
  thumbnail: PropTypes.string
};

export default ConstructorElementWrapper;