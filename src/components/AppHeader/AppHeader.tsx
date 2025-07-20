import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Logo, BurgerIcon, ListIcon, ProfileIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import { useAppSelector } from '../../hooks/useTypedRedux';
import styles from './AppHeader.module.css';

const AppHeader = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const location = useLocation();

  const isActive = (path: string): boolean => {
    if (path === '/') {
      return location.pathname === '/' || location.pathname.startsWith('/ingredients');
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className={`${styles.header} pt-4 pb-4`}>
      <div className={styles.container}>
        <nav className={styles.nav}>
          {/* Левый блок меню */}
          <div className={styles.leftGroup}>
            <NavLink 
              to="/"
              className={`${styles.navLink} pl-5 pr-5`}
              style={({ isActive }) => ({
                color: isActive ? '#F2F2F3' : '#8585AD'
              })}
            >
              <BurgerIcon type={isActive('/') ? 'primary' : 'secondary'} />
              <span className="text text_type_main-default ml-2">
                Конструктор
              </span>
            </NavLink>
            
            <NavLink 
              to="/feed"
              className={`${styles.navLink} pl-5 pr-5`}
              style={({ isActive }) => ({
                color: isActive ? '#F2F2F3' : '#8585AD'
              })}
            >
              <ListIcon type={isActive('/feed') ? 'primary' : 'secondary'} />
              <span className="text text_type_main-default ml-2">
                Лента заказов
              </span>
            </NavLink>
          </div>

          {/* Логотип */}
          <div className={styles.logo}>
            <NavLink to="/">
              <Logo />
            </NavLink>
          </div>

          {/* Правый блок меню */}
          <div className={styles.rightGroup}>
            <NavLink 
              to={isAuthenticated ? "/profile" : "/login"}
              className={`${styles.navLink} pl-5 pr-5`}
              style={({ isActive }) => ({
                color: isActive ? '#F2F2F3' : '#8585AD'
              })}
            >
              <ProfileIcon type={isActive('/profile') ? 'primary' : 'secondary'} />
              <span className="text text_type_main-default ml-2">
                {isAuthenticated ? "Личный кабинет" : "Войти"}
              </span>
            </NavLink>
          </div>
        </nav>
      </div>
    </header>
  );
};

export default AppHeader;