import React, { FC, KeyboardEvent, useEffect } from 'react';
import ReactDOM from 'react-dom';
import styles from './ModalOverlay.module.css';

interface ModalOverlayProps {
  onClose: () => void;
}

const ModalOverlay: FC<ModalOverlayProps> = ({ onClose }) => {
  const handleEsc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEsc as unknown as EventListener);
    return () => {
      document.removeEventListener('keydown', handleEsc as unknown as EventListener);
    };
  }, [onClose]);

  const modalsRoot = document.getElementById('modals');

  if (!modalsRoot) return null;

  return ReactDOM.createPortal(
    <div 
      className={styles.overlay} 
      onClick={onClose}
      data-testid="modal-overlay"
    />,
    modalsRoot
  );
};

export default ModalOverlay;