import React from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import styles from './ModalOverlay.module.css';

const ModalOverlay = ({ onClose }) => {
  const handleEsc = (e) => {
    if (e.key === 'Escape') onClose();
  };

  React.useEffect(() => {
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const modalsRoot = document.getElementById('modals');

  if (!modalsRoot) return null;

  return ReactDOM.createPortal(
    <div className={styles.overlay} onClick={onClose} />,
    modalsRoot
  );
};

ModalOverlay.propTypes = {
  onClose: PropTypes.func.isRequired
};

export default ModalOverlay;