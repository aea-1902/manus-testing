import React from 'react';
import Image from 'next/image';
import styles from '../../styles/styling/NoCannibalizationDetected.module.css';

const NoCannibalizationDetected = ({ 
  index = 0,
  title = "No keyword cannibalization detected",
  message = "Good news! We didn't detect any keyword cannibalization.",
  subMessage = "No pages within this domain (or other domains in your account) are currently competing for the same keywords. Keep monitoring to catch any overlaps as your content grows."
}) => {
  return (
    <div className={styles.container}>
      <div className={styles.iconWrapper}>
        <Image 
          src="/images/ic_exclamation_blue.svg"
          alt="Exclamation Icon"
          className={styles.icon}
          width={20}
          height={20}
        />
      </div>
      <div className={styles.textContent}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.message}>{message}</p>
        <p className={styles.message}>{subMessage}</p>
      </div>
    </div>
  );
};

export default NoCannibalizationDetected;

