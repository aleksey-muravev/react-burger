import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ResetPassword.module.css';
import { useState, FormEvent, ChangeEvent } from 'react';
import { request } from '../../utils/api';

export default function ResetPassword() {
  const [password, setPassword] = useState<string>('');
  const [token, setToken] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleTokenChange = (e: ChangeEvent<HTMLInputElement>) => {
    setToken(e.target.value);
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
          type={'password'}
          placeholder={'Введите новый пароль'}
          value={password}
          onChange={handlePasswordChange}
          extraClass={'mb-6'}
          icon={'ShowIcon'}
          required={true}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
        
        <Input
          type={'text'}
          placeholder={'Введите код из письма'}
          value={token}
          onChange={handleTokenChange}
          extraClass={'mb-6'}
          required={true}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
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