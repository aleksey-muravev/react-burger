import React, { useMemo, useState, useCallback } from 'react';
import { useDrop, DropTargetMonitor } from 'react-dnd';
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
import { useAppDispatch, useAppSelector } from '../../hooks/useTypedRedux';
import type { RootState } from '../../services/store';
import type { ConstructorIngredient, Ingredient } from '../../utils/types';

interface DragItem {
  id: string;
  type: string;
  index?: number;
}

const BurgerConstructor = () => {
  const dispatch = useAppDispatch();
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const ingredients = useAppSelector((state: RootState) => state.ingredients.items);
  const { bun, ingredients: constructorIngredients } = useAppSelector(
    (state: RootState) => state.burgerConstructor
  );

  const [{ isHover }, dropTarget] = useDrop({
    accept: ['ingredient', 'constructorItem'],
    drop: (item: DragItem) => {
      if (item.type === 'constructorItem') return;
      
      const ingredient = ingredients.find((ing: Ingredient) => ing._id === item.id);
      if (!ingredient) return;

      if (ingredient.type === 'bun') {
        dispatch(setConstructorBun(ingredient));
        dispatch(resetBunCount(ingredient._id));
      } else {
        const ingredientWithUuid: ConstructorIngredient = {
          ...ingredient,
          uuid: `${ingredient._id}-${Date.now()}`
        };
        dispatch(addConstructorItem(ingredientWithUuid));
        dispatch(incrementIngredientCount(ingredient._id));
      }
    },
    collect: (monitor: DropTargetMonitor) => ({
      isHover: monitor.isOver()
    })
  });

  const moveItem = useCallback((dragIndex: number, hoverIndex: number) => {
    dispatch(moveConstructorItem(dragIndex, hoverIndex));
  }, [dispatch]);

  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0;
    const ingredientsPrice = constructorIngredients.reduce(
      (sum: number, item: ConstructorIngredient) => sum + item.price, 0
    );
    return bunPrice + ingredientsPrice;
  }, [bun, constructorIngredients]);

  const handleRemove = useCallback((uuid: string, ingredientId: string) => {
    dispatch(removeConstructorItem(uuid, ingredientId));
    dispatch(decrementIngredientCount(ingredientId));
  }, [dispatch]);

  const handleOrderClick = useCallback((e?: React.SyntheticEvent<Element, Event>) => {
    if (e) e.preventDefault();
    
    if (!bun) {
      alert('Пожалуйста, выберите булку!');
      return;
    }

    setIsProcessing(true);
    const ingredientIds = [bun._id, ...constructorIngredients.map(
      (item: ConstructorIngredient) => item._id
    ), bun._id];
    
    dispatch(createOrder(ingredientIds))
      .then(() => {
        setIsOrderModalOpen(true);
      })
      .catch((error: unknown) => {
        alert(error instanceof Error ? error.message : 'Ошибка при оформлении заказа');
      })
      .finally(() => {
        setIsProcessing(false);
      });
  }, [bun, constructorIngredients, dispatch]);

  const closeOrderModal = useCallback(() => {
    setIsOrderModalOpen(false);
    dispatch(clearConstructor());
  }, [dispatch]);

  const setDropRef = useCallback((node: HTMLDivElement | null) => {
    if (node) dropTarget(node);
  }, [dropTarget]);

  return (
    <div className={`${styles.container} ml-10`} ref={setDropRef}>
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
        {constructorIngredients.map((item: ConstructorIngredient, index: number) => (
          <ConstructorElementWrapper
            key={item.uuid}
            id={item.uuid}
            index={index}
            moveItem={moveItem}
            text={item.name}
            price={item.price}
            thumbnail={item.image}
            handleClose={() => handleRemove(item.uuid, item._id)}
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
          onClick={handleOrderClick}
          disabled={!bun || constructorIngredients.length === 0 || isProcessing}
          htmlType="button"
        >
          {isProcessing ? 'Оформляем...' : 'Оформить заказ'}
        </Button>
      </div>

      {isOrderModalOpen && (
        <Modal onClose={closeOrderModal} title="">
          <OrderDetails />
        </Modal>
      )}
    </div>
  );
};

export default BurgerConstructor;