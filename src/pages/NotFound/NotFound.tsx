import React from 'react';
import { Button } from '@ya.praktikum/react-developer-burger-ui-components';
import { useNavigate } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={`${styles.title} text text_type_digits-large`}>404</h1>
        <p className={`${styles.text} text text_type_main-medium`}>Страница не найдена</p>
        <p className={`${styles.subtext} text text_type_main-default text_color_inactive`}>
          Возможно, она была удалена или перенесена на другой адрес
        </p>
        <Button 
          type="primary" 
          size="large"
          onClick={() => navigate(-1)}
          htmlType="button"
          extraClass={styles.button}
        >
          Назад
        </Button>
      </div>
    </div>
  );
}