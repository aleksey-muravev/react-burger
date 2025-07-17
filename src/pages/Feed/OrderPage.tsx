import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Modal from '../../components/Modal/Modal';
import OrderFullDetails from '../../components/OrderFullDetails/OrderFullDetails';
import OrderDetailsModal from '../../components/OrderDetailsModal/OrderDetailsModal';
import { RootState, AppDispatch } from '../../utils/types';
import { getOrder } from '../../services/order-details/actions';

const OrderPage: React.FC = () => {
  const { number } = useParams<{ number: string }>();
  const location = useLocation();
  const background = location.state?.background;
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [initialLoad, setInitialLoad] = useState(true);

  const { orders } = useSelector((state: RootState) => state.ws);
  const ingredients = useSelector((state: RootState) => state.ingredients.items);
  const { order: orderFromApi, loading } = useSelector((state: RootState) => state.orderDetails);

  useEffect(() => {
    if (!number) return;

    const orderFromFeed = orders.find(order => order.number === Number(number));
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

  const currentOrder = orderFromApi || orders.find(order => order.number === Number(number));
  
  if (!currentOrder) {
    return <div className="text text_type_main-medium">Заказ не найден</div>;
  }

  const totalPrice = currentOrder.ingredients.reduce((sum, id) => {
    const ingredient = ingredients.find(item => item._id === id);
    return sum + (ingredient?.price || 0);
  }, 0);

  const orderData = {
    ...currentOrder,
    ingredientsInfo: ingredients.filter(ing => currentOrder.ingredients.includes(ing._id)),
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