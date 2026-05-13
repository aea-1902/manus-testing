
import React from 'react'
import styles from '../styles/LoadingScreen.module.css'

const LoadingScreen = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Loading...</p>
    </div>
  )
}

export default LoadingScreen
