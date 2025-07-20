import { useState, FormEvent, ChangeEvent } from 'react';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { login } from '../../services/auth/actions';
import styles from './Login.module.css';
import { useAppDispatch, useAppSelector } from '../../hooks/useTypedRedux';
import type { RootState } from '../../services/store';

export default function Login() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { error, loading } = useAppSelector((state: RootState) => state.auth);
  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(login(email, password));
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Ошибка авторизации:', err);
    }
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-medium mb-6">Вход</h1>
      
      {error && (
        <p className="text text_type_main-default text_color_error mb-4">
          {error}
        </p>
      )}

      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          type={'email'}
          placeholder={'E-mail'}
          name={'email'}
          value={email}
          onChange={handleEmailChange}
          extraClass={'mb-6'}
          required={true}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
        
        <Input
          type={'password'}
          placeholder={'Пароль'}
          name={'password'}
          value={password}
          onChange={handlePasswordChange}
          extraClass={'mb-6'}
          required={true}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
        
        <Button 
          htmlType="submit" 
          type="primary" 
          size="medium"
          extraClass="mb-20"
          disabled={loading}
        >
          {loading ? 'Вход...' : 'Войти'}
        </Button>
      </form>

      <p className="text text_type_main-default text_color_inactive mb-4">
        Вы — новый пользователь?{' '}
        <Link to="/register" className={styles.link}>
          Зарегистрироваться
        </Link>
      </p>
      
      <p className="text text_type_main-default text_color_inactive">
        Забыли пароль?{' '}
        <Link to="/forgot-password" className={styles.link}>
          Восстановить пароль
        </Link>
      </p>
    </div>
  );
}