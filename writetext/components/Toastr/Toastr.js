import React, { useEffect, useState } from 'react';
import styles from '../../styles/toastr/Toastr.module.css';
import Image from 'next/image';

const Toastr = ({
  id,
  message,
  type,
  duration = 3000,
  position = 'top-right',
  closeOnClick = false,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Only set timeout if duration is greater than 0
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300); // Wait for fade out animation
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, id, onClose]);

  const handleClick = () => {
    if (closeOnClick) {
      setIsVisible(false);
      setTimeout(() => onClose(id), 300);
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return (
          <Image
            src="/images/ic_verified.svg"
            alt="Success"
            width={20}
            height={20}
            className={styles.icon}
          />
        );
      case 'warning':
        return '⚠';
      case 'error':
        return '✕';
      default:
        return '';
    }
  };

  return (
    <div
      className={`${styles.toastr} ${styles[type]} ${styles[position]} ${
        isVisible ? styles.show : styles.hide
      }`}
      onClick={handleClick}
      role="alert"
    >
      <button
        className={styles.closeButton}
        onClick={(e) => {
          e.stopPropagation();
          setIsVisible(false);
          setTimeout(() => onClose(id), 300);
        }}
        aria-label="Close notification"
      >
        ×
      </button>
      <div className={styles.content}>
        <span className={styles.icon}>{getIcon()}</span>
        <span className={styles.message}>{message}</span>
      </div>
    </div>
  );
};

export default Toastr; 