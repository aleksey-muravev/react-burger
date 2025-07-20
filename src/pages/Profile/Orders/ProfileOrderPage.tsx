import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Modal from '../../../components/Modal/Modal';
import OrderDetailsModal from '../../../components/OrderDetailsModal/OrderDetailsModal';
import OrderFullDetails from '../../../components/OrderFullDetails/OrderFullDetails';
import { getOrder } from '../../../services/order-details/actions';
import styles from './ProfileOrderPage.module.css';
import { useAppDispatch, useAppSelector } from '../../../hooks/useTypedRedux';
import type { RootState } from '../../../services/store';
import type { Order, Ingredient } from '../../../utils/types';

const ProfileOrderPage: React.FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const background = location.state?.background;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [initialLoad, setInitialLoad] = useState(true);

  const { userOrders } = useAppSelector((state: RootState) => state.ws);
  const ingredients = useAppSelector((state: RootState) => state.ingredients.items);
  const { order: orderFromApi, loading } = useAppSelector((state: RootState) => state.orderDetails);

  useEffect(() => {
    if (!number) return;

    const orderFromHistory = userOrders.find((order: Order) => order.number === Number(number));
    if (orderFromHistory) {
      dispatch({ type: 'GET_ORDER_SUCCESS', payload: orderFromHistory });
      setInitialLoad(false);
    } else {
      dispatch(getOrder(number));
      setInitialLoad(false);
    }
  }, [number, userOrders, dispatch]);

  const handleCloseModal = () => navigate(-1);

  if (initialLoad || loading) {
    return (
      <div className={styles.container}>
        <div className="text text_type_main-medium">Загрузка заказа...</div>
      </div>
    );
  }

  const currentOrder = orderFromApi || userOrders.find((order: Order) => order.number === Number(number));
  
  if (!currentOrder) {
    return (
      <div className={styles.container}>
        <div className="text text_type_main-medium">Заказ не найден</div>
      </div>
    );
  }

  const totalPrice = currentOrder.ingredients.reduce((sum: number, id: string) => {
    const ingredient = ingredients.find((item: Ingredient) => item._id === id);
    return sum + (ingredient?.price || 0);
  }, 0);

  const orderData = {
    ...currentOrder,
    ingredientsInfo: ingredients.filter((ing: Ingredient) => currentOrder.ingredients.includes(ing._id)),
    total: totalPrice
  };

  if (background) {
    return (
      <Modal onClose={handleCloseModal}>
        <OrderDetailsModal order={orderData} />
      </Modal>
    );
  }

  return (
    <div className={styles.container}>
      <OrderFullDetails order={orderData} />
    </div>
  );
};

export default ProfileOrderPage;