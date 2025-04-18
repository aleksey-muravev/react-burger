import React, { useMemo, useState } from 'react';
import { Button, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import ConstructorElementWrapper from './ConstructorElement/ConstructorElement';
import Modal from '../modals/common/Modal/Modal';
import OrderDetails from '../modals/content/OrderDetails/OrderDetails';
import { testOrder } from '../../utils/orderDetails-test';
import styles from './BurgerConstructor.module.css';
import PropTypes from 'prop-types'; 

const BurgerConstructor = ({ ingredients }) => {
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  const { bun, fillings } = useMemo(() => ({
    bun: ingredients.find(item => item.type === 'bun'),
    fillings: ingredients.filter(item => item.type !== 'bun')
  }), [ingredients]);

  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    return bunPrice + fillings.reduce((sum, item) => sum + item.price, 0);
  }, [bun, fillings]);

  const handleOrderClick = () => {
    if (!bun) {
      alert('Пожалуйста, выберите булку!');
      return;
    }
    setIsOrderModalOpen(true);
  };

  const closeOrderModal = () => {
    setIsOrderModalOpen(false);
  };

  return (
    <>
      <section className={`${styles.container} ml-10`}>
        {/* Верхняя булка */}
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

        {/* Список ингредиентов (начинки и соусы) */}
        <div className={styles.fillingsContainer}>
          {fillings.map((item, index) => (
            <ConstructorElementWrapper 
              key={`${item._id}_${index}`}
              item={item}
            />
          ))}
        </div>

        {/* Нижняя булка */}
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

        {/* Блок с суммой и кнопкой */}
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
            onClick={handleOrderClick}
            disabled={!bun}
          >
            Оформить заказ
          </Button>
        </div>
      </section>

      {/* Модальное окно заказа */}
      {isOrderModalOpen && (
        <Modal onClose={closeOrderModal}>
          <OrderDetails />
        </Modal>
      )}
    </>
  );
};

BurgerConstructor.propTypes = {
  ingredients: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['bun', 'sauce', 'main']).isRequired,
      price: PropTypes.number.isRequired,
      image: PropTypes.string.isRequired,
      // Остальные необходимые поля
    })
  ).isRequired
};

export default BurgerConstructor;