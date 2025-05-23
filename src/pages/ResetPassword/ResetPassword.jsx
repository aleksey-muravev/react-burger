import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ResetPassword.module.css';
import { useState } from 'react';
import { request } from '../../utils/api';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await request('/password-reset/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, token })
      });
      // Очищаем флаг после успешного сброса
      localStorage.removeItem('forgotPasswordVisited');
      navigate('/login', { state: { fromReset: true }, replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>
      
      {error && (
        <p className="text text_type_main-default text_color_error mb-4">
          {error}
        </p>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          type="password"
          placeholder="Введите новый пароль"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          extraClass="mb-6"
          icon="ShowIcon"
          required
        />
        
        <Input
          type="text"
          placeholder="Введите код из письма"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          extraClass="mb-6"
          required
        />
        
        <Button 
          htmlType="submit" 
          type="primary" 
          size="medium"
          disabled={isLoading}
        >
          {isLoading ? 'Сохранение...' : 'Сохранить'}
        </Button>
      </form>

      <p className="text text_type_main-default text_color_inactive mt-20">
        Вспомнили пароль?{' '}
        <Link to="/login" className={styles.link}>
          Войти
        </Link>
      </p>
    </div>
  );
}