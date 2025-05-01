import React, { useState } from 'react';
import {
  Logo,
  BurgerIcon,
  ListIcon,
  ProfileIcon
} from '@ya.praktikum/react-developer-burger-ui-components';
import styles from './AppHeader.module.css';

const AppHeader = () => {
  const [activeTab, setActiveTab] = useState('constructor');

  return (
    <header className={`${styles.header} pt-4 pb-4`}>
      <div className={styles.container}>
        <div className={styles.leftGroup}>
          <nav 
            className={`${styles.navLink} pl-5 pr-5`} 
            onClick={() => setActiveTab('constructor')}
          >
            <BurgerIcon type={activeTab === 'constructor' ? 'primary' : 'secondary'} />
            <span className={`text text_type_main-default ml-2 ${activeTab === 'constructor' ? '' : 'text_color_inactive'}`}>
              Конструктор
            </span>
          </nav>
          
          <nav 
            className={`${styles.navLink} pl-5 pr-5`} 
            onClick={() => setActiveTab('orders')}
          >
            <ListIcon type={activeTab === 'orders' ? 'primary' : 'secondary'} />
            <span className={`text text_type_main-default ml-2 ${activeTab === 'orders' ? '' : 'text_color_inactive'}`}>
              Лента заказов
            </span>
          </nav>
        </div>

        <div className={styles.logo}>
          <Logo />
        </div>

        <div className={styles.rightGroup}>
          <nav 
            className={`${styles.navLink} pl-5 pr-5`} 
            onClick={() => setActiveTab('profile')}
          >
            <ProfileIcon type={activeTab === 'profile' ? 'primary' : 'secondary'} />
            <span className={`text text_type_main-default ml-2 ${activeTab === 'profile' ? '' : 'text_color_inactive'}`}>
              Личный кабинет
            </span>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;