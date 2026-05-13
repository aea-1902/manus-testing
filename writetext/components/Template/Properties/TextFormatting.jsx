import React, { useState, useEffect } from 'react';
import styles from '../../../styles/styling/Templates/TextFormatting.module.css';  

const TextFormatting = ({ label = "", properties = [], values = [], blockIndex = 0,
  propertyIndex = 0, groupId = "", onChange = () => {}, disabled = false, readOnly = false, property = "", block = null }) => {
  const [activeButtons, setActiveButtons] = useState([]);

  useEffect(() => {
    // Get the active values from the parent component
    if (values.length > 0) {
     
      setActiveButtons(values);
    }else{
      const activeValues = properties.filter(property => 
        property.values && property.values.includes(property.id)
      ).map(property => property.id);
      setActiveButtons(activeValues);
    }
  }, [properties]);


  const handleButtonClick = (buttonId, blockIndex, propertyIndex) => {
    if (disabled || readOnly) return;
    let activeButtonsUpdated = [...activeButtons];
    
    // Toggle the button state
    if (activeButtonsUpdated.includes(buttonId)) {
      activeButtonsUpdated = activeButtonsUpdated.filter(id => id !== buttonId);
    } else {
      activeButtonsUpdated.push(buttonId);
    }
    
    setActiveButtons(activeButtonsUpdated);
    // Update the values array in the properties
    const updatedProperties = properties.map(property => ({
      ...property,
      values: activeButtonsUpdated.includes(property.id) ? [property.id] : []
    }));
    onChange(blockIndex, property.id, propertyIndex, updatedProperties);
  };

  const isFromImage = () => {
    if (block.id.includes('image')) {
      return true;
    }
    return false;
  }

  const shouldDisable = () => {
    if (isFromImage()) {
      if (property.id === 'formatting')
      {
        if (block.groups.find(group => group.id === 'image').properties.find(prop => prop.id === 'include').values[0] === 'true') {
          return false;
        }else{
          return true;
        }
      }
      else{
        return false;
      }
    }
    return false;
  }
  if (properties.id === "structure" || properties.id === "answer_formatting") {
    return (
      <div className={`${styles.container} ${shouldDisable() ? 'field-hidden' : 'field-show'}`}>
        {JSON.stringify(properties)}
        {properties.map((property, index) => (
          <div key={index} className={styles.buttonGroup}>
            <button 
              className={`${styles.textStructureButton} ${styles.formatButton} ${property.id} ${activeButtons.includes(property.id) ? styles.active : ''} ${styles[property.id.toLowerCase()]}`}
              onClick={() => handleButtonClick(property.id, blockIndex, propertyIndex)}
            > 
              {property.text}
            </button>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${shouldDisable() ? 'field-hidden' : 'field-show'}`}>
      {properties.map((property, index) => (
        <div key={index} className={styles.buttonGroup}>
          <button 
            className={`${label} ${styles.formatButton} ${activeButtons.includes(property.id) ? styles.active : ''} ${styles[property.id.toLowerCase()]}`}
            onClick={() => handleButtonClick(property.id, blockIndex, propertyIndex)}
          > 
            {property.text}
          </button>
        </div>
      ))}
    </div>
  );
};

export default TextFormatting;

