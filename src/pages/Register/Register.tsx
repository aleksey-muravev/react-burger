import { useState, FormEvent, ChangeEvent } from 'react';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register } from '../../services/auth/actions';
import styles from './Register.module.css';
import {AppDispatch } from '../../utils/types';


export default function Register() {
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const dispatch: AppDispatch = useDispatch();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(register(email, password, name));
      navigate('/');
    } catch (err) {
      console.error('Ошибка регистрации:', err);
    }
  };

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className={styles.container}>
      <h1 className="text text_type_main-medium mb-6">Регистрация</h1>
      
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          type={'text'}
          placeholder={'Имя'}
          name={'name'}
          value={name}
          onChange={handleNameChange}
          extraClass={'mb-6'}
          required={true}
          onPointerEnterCapture={() => {}}
          onPointerLeaveCapture={() => {}}
        />
        
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
        >
          Зарегистрироваться
        </Button>
      </form>

      <p className="text text_type_main-default text_color_inactive">
        Уже зарегистрированы?{' '}
        <Link to="/login" className={styles.link}>
          Войти
        </Link>
      </p>
    </div>
  );
}