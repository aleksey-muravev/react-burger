import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import Modal from '../../components/Modal/Modal';
import OrderFullDetails from '../../components/OrderFullDetails/OrderFullDetails';
import OrderDetailsModal from '../../components/OrderDetailsModal/OrderDetailsModal';
import { getOrder } from '../../services/order-details/actions';
import { useAppDispatch, useAppSelector } from '../../hooks/useTypedRedux';
import type { RootState } from '../../services/store';
import type { Order, Ingredient } from '../../utils/types';

const OrderPage: React.FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const background = location.state?.background;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [initialLoad, setInitialLoad] = useState(true);

  const { orders } = useAppSelector((state: RootState) => state.ws);
  const ingredients = useAppSelector((state: RootState) => state.ingredients.items);
  const { order: orderFromApi, loading } = useAppSelector((state: RootState) => state.orderDetails);

  useEffect(() => {
    if (!number) return;

    const orderFromFeed = orders.find((order: Order) => order.number === Number(number));
    if (orderFromFeed) {
      dispatch({ type: 'GET_ORDER_SUCCESS', payload: orderFromFeed });
      setInitialLoad(false);
    } else {
      dispatch(getOrder(number));
      setInitialLoad(false);
    }
  }, [number, orders, dispatch]);

  const handleCloseModal = () => navigate(-1);

  if (initialLoad || loading) {
    return <div className="text text_type_main-medium">Загрузка заказа...</div>;
  }

  const currentOrder = orderFromApi || orders.find((order: Order) => order.number === Number(number));
  
  if (!currentOrder) {
    return <div className="text text_type_main-medium">Заказ не найден</div>;
  }

  const totalPrice = currentOrder.ingredients.reduce((sum: number, id: string) => {
    const ingredient = ingredients.find((item: Ingredient) => item._id === id);
    return sum + (ingredient?.price || 0);
  }, 0);

  const orderData = {
    ...currentOrder,
    ingredientsInfo: ingredients.filter((ing: Ingredient) => 
      currentOrder.ingredients.includes(ing._id)
    ),
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
    <div className="mt-10">
      <OrderFullDetails order={orderData} />
    </div>
  );
};

export default OrderPage;