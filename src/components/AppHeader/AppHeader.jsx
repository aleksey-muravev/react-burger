import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon
} from '@ya.praktikum/react-developer-burger-ui-components';
import { useSelector } from 'react-redux';
import styles from './AppHeader.module.css';

const AppHeader = () => {
  const { isAuthenticated } = useSelector(state => state.auth);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/') {
      return location.pathname === '/' || 
             location.pathname.startsWith('/ingredients');
    }
    return location.pathname.startsWith(path);
  };

  const handleFeedClick = (e) => {
    e.preventDefault();
    navigate('/feed');
  };

  const handleProfileClick = (e) => {
    e.preventDefault();
    navigate(isAuthenticated ? '/profile' : '/login');
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
            <BurgerIcon type={isActive('/') ? "primary" : "secondary"} />
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
            <ListIcon type={isActive('/feed') ? "primary" : "secondary"} />
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
            <ProfileIcon type={isActive('/profile') ? "primary" : "secondary"} />
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