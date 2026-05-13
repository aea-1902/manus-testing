import React from 'react';
import Image from 'next/image';
import styles from '../../styles/styling/Templates/InfoAlert.module.css';

const hasHtmlTags = (message) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(message, 'text/html');
  return doc.body.innerHTML !== message;
}

const InfoAlert = ({message}) => {
  return (
    <div className={styles.alertContainer}>
      <Image 
        src="/images/ic_info.svg"
        alt="info"
        width={16}
        height={16}
        className={styles.infoIcon}
      />
      <div className={styles.alertText} dangerouslySetInnerHTML={{ __html: message }} />
    </div>
  );
};

export default InfoAlert;
