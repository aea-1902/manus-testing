import React, { useState, useEffect } from 'react';
import styles from '../../../styles/styling/Templates/TextStructure.module.css';  

const TextStructure = ({ label = "", properties = [],  blockIndex = 0,
  propertyIndex = 0, onChange = () => {} }) => {
  const [activeButtons, setActiveButtons] = useState([]);

  useEffect(() => {
    const initiallyActive = properties
      .filter(value => value.active)
      .map(value => value.format);
    setActiveButtons(initiallyActive);
  }, [properties]);

  const handleButtonClick = (button, option, blockIndex, propertyIndex) => {
    let activeButtonsUpdated = [...activeButtons];
    
    // Toggle the button state
    if (activeButtonsUpdated.includes(button)) {
      activeButtonsUpdated = activeButtonsUpdated.filter(btn => btn !== button);
    } else {
      activeButtonsUpdated.push(button);
    }
    
    setActiveButtons(activeButtonsUpdated);
    
    properties.map(property => {
      if(activeButtonsUpdated.includes(property.format)) {
        property.active = true;
      } else {
        property.active = false;
      }
    });
    onChange(blockIndex, propertyIndex, properties);
  };
  if (label === "") {
    return null;
  }
  return (
    <div className={styles.container}>
      {properties.map((property, index) => (
        <div key={index} className={styles.buttonGroup}>
          <button 
            className={`${styles.formatButton} ${activeButtons.includes(property.format) ? styles.active : ''} ${styles[property.format.toLowerCase()]}`}
            onClick={() => handleButtonClick(property.format, property.valueLabel, blockIndex, propertyIndex)}
          > 
            {property.valueLabel}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TextStructure;

