import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ children, onlyUnauth = false }) => {
  const location = useLocation();
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  if (loading) {
    return (
      <div className="text text_type_main-medium mt-30">
        Проверка авторизации...
      </div>
    );
  }

  // Для маршрутов, доступных только неавторизованным
  if (onlyUnauth && isAuthenticated) {
    const from = location.state?.from || '/';
    return <Navigate to={from} replace />;
  }

  // Для защищенных маршрутов
  if (!onlyUnauth && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

// Отдельный компонент для защиты reset-password
export const ResetPasswordProtected = ({ children }) => {
  const forgotPasswordVisited = localStorage.getItem('forgotPasswordVisited');
  
  if (!forgotPasswordVisited) {
    return <Navigate to="/forgot-password" replace />;
  }

  return children;
};