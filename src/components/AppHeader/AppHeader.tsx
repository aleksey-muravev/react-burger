import React, { MouseEvent } from 'react';
import { NavLink, useLocation, useNavigate, Location, NavigateFunction } from 'react-router-dom';
import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon,
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';
import { RootState } from '../../services/store';
import styles from './AppHeader.module.css';

interface AuthState {
  isAuthenticated: boolean;
}

type IconType = 'primary' | 'secondary';

const AppHeader = () => {
  const { isAuthenticated } = useSelector((state: RootState) => state.auth as AuthState);
  const location: Location = useLocation();
  const navigate: NavigateFunction = useNavigate();

  const isActive = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/' || 
             location.pathname.startsWith('/ingredients');
    }
    return location.pathname.startsWith(path);
  };

  const handleFeedClick = (e: MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    navigate('/feed');
  };

  const handleProfileClick = (e: MouseEvent<HTMLAnchorElement>): void => {
    e.preventDefault();
    navigate(isAuthenticated ? '/profile' : '/login');
  };

  const getIconType = (path: string): IconType => {
    return isActive(path) ? "primary" : "secondary";
  };

  return (
    <header className={`${styles.header} pt-4 pb-4`}>
      <div className={styles.container}>
        <div className={styles.leftGroup}>
          <NavLink 
            to="/"
            className={({ isActive: isNavActive }) => 
              `${styles.navLink} pl-5 pr-5 ${isNavActive || isActive('/') ? styles.activeText : styles.inactiveText}`
            }
          >
            <BurgerIcon type={getIconType('/')} />
            <span className={`text text_type_main-default ml-2 ${isActive('/') ? styles.activeText : styles.inactiveText}`}>
              Конструктор
            </span>
          </NavLink>
          
          <NavLink 
            to="/feed"
            className={({ isActive: isNavActive }) => 
              `${styles.navLink} pl-5 pr-5 ${isNavActive || isActive('/feed') ? styles.activeText : styles.inactiveText}`
            }
            onClick={handleFeedClick}
          >
            <ListIcon type={getIconType('/feed')} />
            <span className={`text text_type_main-default ml-2 ${isActive('/feed') ? styles.activeText : styles.inactiveText}`}>
              Лента заказов
            </span>
          </NavLink>
        </div>

        <div className={styles.logo}>
          <NavLink to="/">
            <Logo />
          </NavLink>
        </div>

        <div className={styles.rightGroup}>
          <NavLink 
            to={isAuthenticated ? "/profile" : "/login"}
            className={({ isActive: isNavActive }) => 
              `${styles.navLink} pl-5 pr-5 ${isNavActive || isActive('/profile') ? styles.activeText : styles.inactiveText}`
            }
            onClick={handleProfileClick}
          >
            <ProfileIcon type={getIconType('/profile')} />
            <span className={`text text_type_main-default ml-2 ${isActive('/profile') ? styles.activeText : styles.inactiveText}`}>
              {isAuthenticated ? "Личный кабинет" : "Войти"}
            </span>
          </NavLink>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;