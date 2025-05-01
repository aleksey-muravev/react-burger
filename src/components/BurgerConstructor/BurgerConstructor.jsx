import React, { useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDrop } from 'react-dnd';
import { Button, CurrencyIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import ConstructorElementWrapper from './ConstructorElement/ConstructorElement';
import Modal from '../Modal/Modal';
import OrderDetails from '../OrderDetails/OrderDetails';
import styles from './BurgerConstructor.module.css';
import {
  addConstructorItem,
  removeConstructorItem,
  setConstructorBun,
  clearConstructor,
  moveConstructorItem
} from '../../services/constructor/actions';
import { createOrder } from '../../services/order/actions';
import {
  incrementIngredientCount,
  decrementIngredientCount,
  resetBunCount
} from '../../services/ingredients/actions';
import PropTypes from 'prop-types';
import { ingredientPropType } from '../../utils/types';

const BurgerConstructor = () => {
  const dispatch = useDispatch();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  
  const { items: allIngredients } = useSelector(state => state.ingredients);
  const { bun, ingredients } = useSelector(state => state.burgerConstructor);
  const { loading: orderLoading } = useSelector(state => state.order);

  const [, dropTarget] = useDrop({
    accept: ['ingredient', 'constructorItem'],
    drop(item) {
      if (item.type === 'constructorItem') return;
      
      const ingredient = allIngredients.find(ing => ing._id === item.id);
      if (!ingredient) return;

      if (ingredient.type === 'bun') {
        dispatch(setConstructorBun(ingredient));
        dispatch(resetBunCount(ingredient._id));
      } else {
        dispatch(addConstructorItem(ingredient));
        dispatch(incrementIngredientCount(ingredient._id));
      }
    },
  });

  const moveItem = useCallback((dragIndex, hoverIndex) => {
    dispatch(moveConstructorItem(dragIndex, hoverIndex));
  }, [dispatch]);

  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = ingredients.reduce((sum, item) => sum + item.price, 0);
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  const handleRemove = useCallback((uuid, ingredientId) => {
    dispatch(removeConstructorItem(uuid));
    dispatch(decrementIngredientCount(ingredientId));
  }, [dispatch]);

  const handleOrderClick = async (e) => {
    e.preventDefault();
    
    if (!bun) {
      alert('Пожалуйста, выберите булку!');
      return;
    }

    if (ingredients.length === 0) {
      alert('Добавьте хотя бы один ингредиент!');
      return;
    }

    try {
      const ingredientIds = [
        bun._id,
        ...ingredients.map(item => item._id),
        bun._id
      ];

      const result = await dispatch(createOrder(ingredientIds));
      
      if (result?.payload?.success) {
        setIsOrderModalOpen(true);
      } else {
        throw new Error(result?.error?.message || 'Не удалось оформить заказ');
      }
    } catch (err) {
      console.error('Ошибка оформления заказа:', err);
      alert(err.message);
    }
  };

  const closeOrderModal = useCallback(() => {
    setIsOrderModalOpen(false);
    dispatch(clearConstructor());
  }, [dispatch]);

  return (
    <div className={`${styles.container} ml-10`} ref={dropTarget}>
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

      {/* Список ингредиентов с возможностью перетаскивания */}
      <div className={styles.fillingsContainer}>
        {ingredients.map((item, index) => (
          <ConstructorElementWrapper
            key={item.uuid}
            id={item.uuid}
            index={index}
            moveItem={moveItem}
            type={undefined}
            isLocked={false}
            text={item.name}
            price={item.price}
            thumbnail={item.image}
            handleClose={() => handleRemove(item.uuid, item._id)}
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
          onClick={handleOrderClick}
          disabled={!bun || ingredients.length === 0 || orderLoading}
        >
          {orderLoading ? 'Оформляем...' : 'Оформить заказ'}
        </Button>
      </div>

      {/* Модальное окно с номером заказа */}
      {isOrderModalOpen && (
        <Modal onClose={closeOrderModal} title="">
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

BurgerConstructor.propTypes = {
  bun: ingredientPropType,
  ingredients: PropTypes.arrayOf(ingredientPropType).isRequired,
  orderLoading: PropTypes.bool.isRequired,
  allIngredients: PropTypes.arrayOf(ingredientPropType).isRequired
};

export default BurgerConstructor;