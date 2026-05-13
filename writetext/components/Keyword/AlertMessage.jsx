import React from 'react';
import Image from 'next/image';
import styles from '../../styles/styling/AlertMessage.module.css';

const AlertMessage = ({ 
  index = 0,
  title = "Domain not ranking for any keywords",
  message = "We couldn't find any ranking keywords for this domain.",
  description = "Double-check that your domain is correctly connected and has active content indexed by search engines. You can also try again later after your pages have had time to rank.",
  type = "warning" // warning, success, error, info
}) => {
  return (
    <div className={styles.alertContainer}>
      <div className={styles.iconWrapper}>
        <Image 
          src="/images/ic_exclamation.svg"
          alt="Alert Icon"
          className={styles.icon}
          width={20}
          height={20}
        />
      </div>
      <div className={styles.contentWrapper}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.message}>{message}</p>
        <p className={styles.description}>{description}</p>
      </div>
    </div>
  );
};

export default AlertMessage;

