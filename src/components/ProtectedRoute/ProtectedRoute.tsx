import React, { ReactNode } from 'react';
import { Navigate, useLocation, Location } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../utils/types'; 
interface ProtectedRouteProps {
  children: ReactNode;
  onlyUnauth?: boolean;
}

export const ProtectedRoute = ({ children, onlyUnauth = false }: ProtectedRouteProps) => {
  const location: Location = useLocation();
  const { isAuthenticated, loading } = useSelector((state: RootState) => state.auth);

  if (loading) {
    return <div className="text text_type_main-medium mt-30">Проверка авторизации...</div>;
  }

  if (onlyUnauth && isAuthenticated) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  if (!onlyUnauth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};