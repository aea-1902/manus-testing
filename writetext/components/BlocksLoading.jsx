import React from 'react';
import styles from '../styles/BlocksLoading.module.css';

const BlocksLoading = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.loadingText}>Loading...</p>
    </div>
  );
};

export default BlocksLoading; 