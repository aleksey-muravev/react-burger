import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ForgotPassword.module.css';
import { useState } from 'react';
import { request } from '../../utils/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await request('/password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      // Устанавливаем флаг посещения forgot-password
      localStorage.setItem('forgotPasswordVisited', 'true');
      navigate('/reset-password', { replace: true });
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
          type="email"
          placeholder="Укажите e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          extraClass="mb-6"
          required
        />
        
        <Button 
          htmlType="submit" 
          type="primary" 
          size="medium"
          disabled={isLoading}
        >
          {isLoading ? 'Отправка...' : 'Восстановить'}
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