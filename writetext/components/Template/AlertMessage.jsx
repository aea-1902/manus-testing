import React from 'react';
import Image from 'next/image';
import styles from '../../styles/styling/Templates/AlertMessage.module.css';

const AlertMessage = ({ 
  message = "",
  icon = "/images/ic_exclamation.svg"
}) => {
    if (message === "") {
        return null;
    }
  return (
    <div className={styles.alertContainer}>
      <Image 
        src={icon}
        alt="Alert Icon"
        className={styles.alertIcon}
        width={16}
        height={16}
      />
      <div className={styles.alertMessage}>{message}</div>
    </div>
  );
};

export default AlertMessage;
