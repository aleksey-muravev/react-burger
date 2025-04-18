import React, { useMemo } from 'react';
import { Button, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import ConstructorElementWrapper from './ConstructorElement/ConstructorElement';
import PropTypes from 'prop-types';
import styles from './BurgerConstructor.module.css';
import { IngredientType } from '../../utils/types';

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
    <section className={`${styles.container} ml-10`}>
      {bun && (
        <div className={`${styles.constructorItem} ${styles.bun} mb-4`}>
          <ConstructorElementWrapper 
            type="top"
            isLocked={true}
            text={`${bun.name} (верх)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      )}

      <div className={styles.fillingsContainer}>
        {fillings.map((item, index) => (
          <ConstructorElementWrapper 
            key={`${item._id}_${index}`}
            item={item}
          />
        ))}
      </div>

      {bun && (
        <div className={`${styles.constructorItem} ${styles.bun} mt-4`}>
          <ConstructorElementWrapper
            type="bottom"
            isLocked={true}
            text={`${bun.name} (низ)`}
            price={bun.price}
            thumbnail={bun.image}
          />
        </div>
      )}

      <div className={`${styles.orderSection} mt-10`}>
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
  ingredients: PropTypes.arrayOf(IngredientType).isRequired
};

export default BurgerConstructor;