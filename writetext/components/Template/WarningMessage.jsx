import React from 'react';
import Image from 'next/image';
import styles from '../../styles/styling/Templates/AlertMessage.module.css';

const WarningMessage = ({ 
  message = "",
  icon = "/images/ico_exclamation_orange.svg",
  index = 0
}) => {
    if (message === "") {
        return null;
    }
  return (
    <div className={styles.alertWarningContainer}>
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

export default WarningMessage;
