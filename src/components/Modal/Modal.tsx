import React, { FC, ReactNode, KeyboardEvent, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { CloseIcon } from '@ya.praktikum/react-developer-burger-ui-components';
import ModalOverlay from '../ModalOverlay/ModalOverlay';
import styles from './Modal.module.css';

interface ModalProps {
  title?: string;
  onClose: () => void;
  children: ReactNode;
}

const Modal: FC<ModalProps> = ({ title, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    
    document.addEventListener('keydown', handleEsc as unknown as EventListener);
    return () => document.removeEventListener('keydown', handleEsc as unknown as EventListener);
  }, [onClose]);

  const modalsRoot = document.getElementById('modals');

  if (!modalsRoot) return null;

  return ReactDOM.createPortal(
    <>
      <ModalOverlay onClose={onClose} />
      <div className={styles.modal}>
        <div className={styles.header}>
          <div className={styles.titleContainer}>
            {title && <h2 className={`${styles.title} text text_type_main-large`}>{title}</h2>}
          </div>
          <button 
            className={styles.closeButton} 
            onClick={onClose}
            data-testid="modal-close-button"
            aria-label="Закрыть модальное окно"
          >
            <CloseIcon type="primary" />
          </button>
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </>,
    modalsRoot
  );
};

export default Modal;