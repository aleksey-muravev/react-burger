import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';
import styles from './ForgotPassword.module.css';
import { useState, FormEvent, ChangeEvent } from 'react';
import { request } from '../../utils/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await request('/password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      localStorage.setItem('forgotPasswordVisited', 'true');
      navigate('/reset-password', { replace: true });
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
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
          type={'email'}
          placeholder={'Укажите e-mail'}
          value={email}
          onChange={handleEmailChange}
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