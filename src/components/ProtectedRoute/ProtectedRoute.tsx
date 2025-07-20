import React, { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useTypedRedux';
import type { RootState } from '../../services/store';

interface ProtectedRouteProps {
  children: ReactNode;
  onlyUnauth?: boolean;
  checkAuth?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  onlyUnauth = false,
  checkAuth = true
}: ProtectedRouteProps) => {
  const location = useLocation();
  const { isAuthenticated, loading } = useAppSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (checkAuth && !isAuthenticated && !loading) {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.log('No token found, redirecting to login');
      }
    }
  }, [isAuthenticated, loading, checkAuth]);

  if (loading && checkAuth) {
    return <div className="text text_type_main-medium mt-30">Проверка авторизации...</div>;
  }

  if (onlyUnauth && isAuthenticated) {
    return <Navigate to={location.state?.from || '/'} replace />;
  }

  if (!onlyUnauth && !isAuthenticated && checkAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};