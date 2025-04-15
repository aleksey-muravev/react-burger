import React, { useMemo } from 'react';
import { ConstructorElement, Button, CurrencyIcon, DragIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './BurgerConstructor.module.css';
import PropTypes from 'prop-types';

const BurgerConstructor = ({ ingredients }) => {
  const { bun, fillings } = useMemo(() => ({
    bun: ingredients.find(item => item.type === 'bun'),
    fillings: ingredients.filter(item => item.type !== 'bun')
  }), [ingredients]);

  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    return bunPrice + fillings.reduce((sum, item) => sum + item.price, 0);
  }, [bun, fillings]);

  return (
    <section className={styles.container}>
      {bun && (
        <div className={`${styles.constructorItem} ${styles.bun}`}>
          <ConstructorElement
            type="top"
            isLocked={true}
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      )}

      <div className={styles.fillingsContainer}>
        {fillings.map((item) => (
          <div key={item._id} className={styles.filling}>
            <DragIcon type="primary" className={styles.dragIcon} />
            <ConstructorElement
              text={item.name}
              price={item.price}
              thumbnail={item.image}
            />
          </div>
        ))}
      </div>

      {bun && (
        <div className={`${styles.constructorItem} ${styles.bun}`}>
          <ConstructorElement
            type="bottom"
            isLocked={true}
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      )}

      <div className={styles.orderSection}>
        <div className={styles.totalPrice}>
          <span className="text text_type_digits-medium">{totalPrice}</span>
          <CurrencyIcon type="primary" />
        </div>
        <Button 
          type="primary" 
          size="large"
          htmlType="button"
          extraClass={styles.orderButton}
        >
          Оформить заказ
        </Button>
      </div>
    </section>
  );
};

BurgerConstructor.propTypes = {
  ingredients: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
    })
  ).isRequired
};

export default BurgerConstructor;