import React, { useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import { useDrop } from 'react-dnd';
import { useNavigate, useLocation } from 'react-router-dom';
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

const BurgerConstructor = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Встроенные мемоизированные селекторы
  const selectIngredients = useMemo(
    () => createSelector(
      state => state.ingredients,
      (ingredients) => ingredients.items
    ),
    []
  );

  const selectConstructor = useMemo(
    () => createSelector(
      state => state.burgerConstructor,
      ({ bun, ingredients }) => ({ bun, ingredients })
    ),
    []
  );

  const selectAuth = useMemo(
    () => createSelector(
      state => state.auth,
      (auth) => auth.isAuthenticated
    ),
    []
  );

  // Использование селекторов
  const allIngredients = useSelector(selectIngredients);
  const { bun, ingredients } = useSelector(selectConstructor);
  const isAuthenticated = useSelector(selectAuth);

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

  const handleOrderClick = useCallback(async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location } });
      return;
    }
    
    if (!bun) {
      alert('Пожалуйста, выберите булку!');
      return;
    }

    try {
      setIsProcessing(true);
      const ingredientIds = [bun._id, ...ingredients.map(item => item._id), bun._id];
      const result = await dispatch(createOrder(ingredientIds));
      
      if (result?.payload?.success) {
        setIsOrderModalOpen(true);
      }
    } catch (error) {
      if (error.message.includes('jwt') || error.message.includes('token')) {
        alert('Сессия истекла. Пожалуйста, войдите снова');
        navigate('/login', { state: { from: location } });
      } else {
        alert(error.message || 'Ошибка при оформлении заказа');
      }
    } finally {
      setIsProcessing(false);
    }
  }, [isAuthenticated, bun, ingredients, dispatch, navigate, location]);

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

      {/* Список ингредиентов */}
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
          disabled={!bun || ingredients.length === 0 || isProcessing}
          htmlType="button"
        >
          {isProcessing ? 'Оформляем...' : 'Оформить заказ'}
        </Button>
      </div>

      {/* Модальное окно */}
      {isOrderModalOpen && (
        <Modal onClose={closeOrderModal} title="">
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default React.memo(BurgerConstructor);