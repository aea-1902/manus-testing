
import React from 'react'
import styles from '../styles/LoadingScreen.module.css'

const LoggingInScreen = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Logging you in...</p>
    </div>
  )
}

export default LoggingInScreen
