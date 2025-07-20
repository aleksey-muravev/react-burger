import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { NavLink, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { logout, updateUser } from '../../services/auth/actions';
import { Input, Button } from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './Profile.module.css';
import { useAppDispatch, useAppSelector } from '../../hooks/useTypedRedux';
import type { RootState } from '../../services/store';

interface IUserForm {
  name: string;
  email: string;
  password: string;
}

// Вспомогательный компонент для Input с фильтрацией лишних пропсов
const FilteredInput = (props: any) => {
  const filteredProps = { ...props };
  delete filteredProps.onPointerEnterCapture;
  delete filteredProps.onPointerLeaveCapture;
  return <Input {...filteredProps} />;
};

export default function Profile() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation(); 
  const { user } = useAppSelector((state: RootState) => state.auth);
  
  const [form, setForm] = useState<IUserForm>({
    name: '',
    email: '',
    password: ''
  });
  
  const [isChanged, setIsChanged] = useState(false);

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        email: user.email || '',
        password: ''
      });
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: value
    }));
    setIsChanged(true);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await dispatch(updateUser(form));
      setIsChanged(false);
    } catch (err) {
      console.error('Ошибка при обновлении данных:', err);
    }
  };

  const handleCancel = () => {
    if (user) {
      setForm({
        name: user.name,
        email: user.email,
        password: ''
      });
      setIsChanged(false);
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout());
      navigate('/login', { replace: true });
    } catch (err) {
      console.error('Ошибка выхода:', err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.sidebar}>
        <nav className={styles.navigation}>
          <NavLink
            to="/profile"
            end
            className={({ isActive }) => 
              `${styles.link} ${isActive ? styles.active : ''} text text_type_main-medium`
            }
          >
            Профиль
          </NavLink>
          
          <NavLink
            to="/profile/orders"
            className={({ isActive }) => 
              `${styles.link} ${isActive ? styles.active : ''} text text_type_main-medium`
            }
          >
            История заказов
          </NavLink>
          
          <button
            type="button"
            onClick={handleLogout}
            className={`${styles.link} ${styles.logout} text text_type_main-medium`}
          >
            Выход
          </button>
        </nav>
        
        <p className={`${styles.hint} text text_type_main-default text_color_inactive mt-20`}>
          {location.pathname.includes('/orders') 
            ? 'В этом разделе вы можете просмотреть свою историю заказов'
            : 'В этом разделе вы можете изменить свои персональные данные'}
        </p>
      </div>
      
      <div className={styles.content}>
        {!location.pathname.includes('/orders') ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className="mb-6">
              <FilteredInput
                type={'text'}
                placeholder={'Имя'}
                name={'name'}
                value={form.name}
                onChange={handleChange}
                icon={'EditIcon'}
              />
            </div>
            
            <div className="mb-6">
              <FilteredInput
                type={'email'}
                placeholder={'Логин'}
                name={'email'}
                value={form.email}
                onChange={handleChange}
                icon={'EditIcon'}
              />
            </div>
            
            <div className="mb-6">
              <FilteredInput
                type={'password'}
                placeholder={'Пароль'}
                name={'password'}
                value={form.password}
                onChange={handleChange}
                icon={'EditIcon'}
              />
            </div>
            
            {isChanged && (
              <div className={styles.buttons}>
                <Button 
                  type="secondary" 
                  htmlType="button"
                  onClick={handleCancel}
                >
                  Отмена
                </Button>
                <Button 
                  type="primary" 
                  htmlType="submit"
                >
                  Сохранить
                </Button>
              </div>
            )}
          </form>
        ) : (
          <Outlet />
        )}
      </div>
    </div>
  );
}