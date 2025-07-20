import React, { KeyboardEvent, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import styles from './ModalOverlay.module.css';

interface ModalOverlayProps {
  onClose: () => void;
}

const ModalOverlay = ({ onClose }: ModalOverlayProps) => {
  const handleEsc = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    const escHandler = handleEsc as unknown as EventListener;
    document.addEventListener('keydown', escHandler);
    return () => {
      document.removeEventListener('keydown', escHandler);
    };
  }, [handleEsc]);

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