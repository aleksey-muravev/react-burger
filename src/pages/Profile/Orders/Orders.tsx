import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Orders() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate('/404', { replace: true });
  }, [navigate]);

  return null;
}