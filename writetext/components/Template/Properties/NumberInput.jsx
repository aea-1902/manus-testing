import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import styles from '../../../styles/styling/Templates/NumberSelector.module.css';

// Custom debounce hook
const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

const NumberSelector = ({block, values, onChange, properties, label, disabled = false, readOnly = false, property = null, parentId , group = null, preview = false }) => {
  const [inputValue, setInputValue] = useState(values || '0');
  const [debounceTimer, setDebounceTimer] = useState(null);

  const getMaxLength = () => {
    if (!group || !group.properties) return null;
    const maxLengthProperty = group.properties.find(p => p.id === property.id).maxLimit;
    if (maxLengthProperty) {
      return parseInt(maxLengthProperty);
    }
    else
    {
      return 1000;
    }
  };
  const getPropertyLabel = () => {
    if (!properties) return null;
    
    const isNumberofItemsGroup = properties.some(prop => prop.id.includes('number'));
    if (isNumberofItemsGroup) 
    {
      return null; 
    }
    const property = properties.find(prop => prop.id === 'min' || prop.id === 'max' || prop.id.includes('number'));
    return property?.label || null;
  };

  const getPropertyId = () => {
    if (!properties) return null;
    const isNumberofItemsGroup = properties.some(prop => prop.id.includes('number_'));
    if (isNumberofItemsGroup){
      return 'number';
    } 

    const targetLengthGroup = properties.some(prop => prop.id === 'min' || prop.id === 'max');
    if (targetLengthGroup)
    {
      return 'target_length';
    }
    return null;
  };

  // Sync with parent values
  useEffect(() => {
    setInputValue(values || '0');
  }, [values]);

  const validateAndUpdateValue = useCallback((newValue) => {

    if (newValue === ''){
      newValue = '1';
    }
    const prop = property;
    const element = properties.some(prop => prop.id === 'min' || prop.id === 'max' || prop.id.includes('number_') || prop.id.includes('spacing_'));

    const isMinMaxElement = properties.some(prop => prop.id === 'min' || prop.id === 'max');
    let finalValue = newValue;
    const originalValue = inputValue;
    if (!element) {
      if (parseInt(finalValue) < 1) {
        finalValue = '1';
      }
    } else {
      if (isMinMaxElement)
        if (parseInt(finalValue) < 1) {
          finalValue = '1';
        }
    }

    const maxProperty = properties.find(p => p.id === 'max');
    const minProperty = properties.find(p => p.id === 'min');
    if (prop.id === 'min')
    {
      if (parseInt(finalValue) >= getMaxLength())
      {
        finalValue = (parseInt(getMaxLength()) - 1).toString();
        // maxProperty.values[0] = getMaxLength().toString();
      }
      if (parseInt(finalValue) >= parseInt(maxProperty.values[0]))
      {
        //maxProperty.values[0] = (parseInt(finalValue) + 1).toString();
        finalValue = minProperty.values[0];
      }
      if (parseInt(finalValue) < 10)
      {
        finalValue = '10';
        // maxProperty.values[0] = (parseInt(finalValue) + 1).toString();
      }
     setInputValue(finalValue.toString());
     onChange?.(finalValue.toString());
    }
    if (prop.id === 'max')
    {
      if (parseInt(finalValue) >= parseInt(getMaxLength()))
      {
        finalValue = getMaxLength().toString();
        // minProperty.values[0] = (parseInt(getMaxLength()) - 1).toString();
      }
      if (parseInt(finalValue) <= parseInt(minProperty.values[0]))
      {
        finalValue = maxProperty.values[0];
        // minProperty.values[0] = (finalValue - 1).toString();
      }
      
      if (parseInt(finalValue) <= 10)
      {
        finalValue = '11';
        // minProperty.values[0] = '10';
      }
     setInputValue(finalValue.toString());
     onChange?.(finalValue.toString());
    }
    

    if (prop.id.includes("spacing_"))
    {
      if (parseInt(finalValue) <= 0)
      {
        setInputValue(originalValue.toString());
        onChange?.(originalValue.toString());
      }
      else
        {
          setInputValue(finalValue.toString());
          onChange?.(finalValue.toString());
        }
    }
  }, [onChange, properties]);

  const handleDirectInput = (e) => {
    if (disabled || readOnly) return;
    
    const newValue = e.target.value;
    if (newValue === '' || /^\d+$/.test(newValue)) {
      setInputValue(newValue);
    }
  };

  const handleBlur = () => {
    validateAndUpdateValue(inputValue);
  };

  const handleIncrement = () => {
    const currentValue = parseInt(inputValue);
    const newValue = (currentValue + 1).toString();
    if (newValue > getMaxLength()) return;
    validateAndUpdateValue(newValue);
  };

  const handleDecrement = () => {
    const currentValue = parseInt(inputValue);
    const newValue = (currentValue - 1).toString();
    const isMinMax   = properties.some(prop => prop.id === 'min' || prop.id === 'max');
    if (!isMinMax) {
      if (newValue <= 0) return;
    } else {
      if (newValue < 1) return;
    }
    validateAndUpdateValue(newValue);
  };

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  const hasDependentProperties = () => {
    if (property.id === 'spacing_lines') {
      return true;
    }
    return false;
  }

  if (hasDependentProperties()) {
    const element = document.getElementById(`property-${parentId}`);
    if (element){
      element.style.paddingTop = '4px';
    }
  }
  
  const shouldRender = () => {
    if (!properties) return false;
    if (group.id === 'content')
    {
      if (property.id === 'min' || property.id === 'max')
        {
          const contentTextProperty = properties.find(prop => prop.id === 'content_text');
          if (contentTextProperty)
          {
            if (contentTextProperty.values[0] !== 'custom')
            {
              return true;
            }
            else{
              return false;
            }
          }
            
      }

      const structure = properties.find(prop => prop.id === 'structure');
      if (!structure) return true;

      if (structure?.values[0] === 'paragraph')
      {
        return true;
      }
      else{
        return false;
      }
    }
    
    if (block.id.includes('image'))
    {
      if (group.id === 'image')
      {
        
        if (property.id === 'spacing_image_lines')
        {
          const spacing = properties.find(prop => prop.id === 'spacing_image');
          if (!spacing) return true;
    
          if (spacing?.values[0] === 'n_lines')
          {
            return true;
          }
          else{
            return false;
          }
        }
      }
      if (group.id === 'spacing')
      {
        if (property.id === 'spacing_lines')
        {
          const spacing = properties.find(prop => prop.id === 'spacing');
          if (!spacing) return true;
    
          if (spacing?.values[0] === 'n_lines')
          {
            return true;
          }
          else{
            return false;
          }
        }
      }
    }
   
      if (block.id === 'conclusion')
      { 
        
    }

    const isNumberofItemsGroup = properties.some(prop => prop.id.includes('number_'));
    if (isNumberofItemsGroup) return true;

    // Skip spacing check if the group is target_length
    const isTargetLengthGroup = properties.some(prop => prop.id === 'min' || prop.id === 'max'  );
    if (isTargetLengthGroup)
      {
        return true;
      } 

    

    const spacingProperty = properties.find(prop => prop.id === 'spacing'|| prop.id === 'spacing_qa' || prop.id === 'spacing_questions');
    if (!spacingProperty) return false;
    return spacingProperty.values[0] === 'n_lines';
  };
  const isFromImage = () => {
    if (block.id.includes('image')) {
      return true;
    }
    return false;
  }

  const shouldDisable = () => {
    if (isFromImage()) {
      if (property.id === 'min' || property.id === 'max' || property.id === 'spacing_image_lines')
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
  

  const propertyLabel = getPropertyLabel();
  const propertyId = getPropertyId();

  if (isFromImage()) {
    return (
      <>
      
      {property.id === "min" && <p>Min</p>}
      {property.id === "max" && <p>Max</p>}
      
    <div className={`${styles.numberSelectorWrapper} ${!preview ? (shouldDisable() ? 'field-hidden' : (!shouldRender() ? 'field-hidden' : 'field-show')) : ''}`}>
        
        {/* {propertyId != "target_length" && propertyId != "number" && <p className={styles.label}></p>} */}
        {/* {propertyLabel && <span className={styles.propertyLabel}>{label}</span>} */}
        <div className={styles.numberSelector}>
          <div className={styles.numberSelectorContent}>
            <input
              type="text"
              className={`${styles.numberSelectorValue} `}
              value={inputValue}
              onChange={handleDirectInput}
              onBlur={handleBlur}
              inputMode="numeric"
              pattern="[0-9]*"
              disabled={disabled}
              readOnly={readOnly}
            />
            <div className={styles.numberSelectorControls}>
              <button 
                className={`${styles.numberSelectorButton} `} 
                onClick={handleIncrement}
                disabled={disabled || readOnly}
              >
                <Image 
                  src="/images/num-up.svg" 
                  alt="increment" 
                  width="21" 
                  height="14"
                />
              </button>
              <button 
                className={`${styles.numberSelectorButton} ${disabled || readOnly ? styles.disabled : ''}`} 
                onClick={handleDecrement}
                disabled={disabled || readOnly}
              >
                <Image 
                  src="/images/num-down.svg" 
                  alt="decrement" 
                  width="21" 
                  height="14"
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      </>
    );
  }
  return (
    <>
    
    {property.id === "min" && <p>Min</p>}
    {property.id === "max" && <p>Max</p>}
    
    <div className={`${styles.numberSelectorWrapper} ${!preview ? (shouldRender() ? 'field-show' : 'field-hidden') : ''}`}>
      
      {/* {propertyId != "target_length" && propertyId != "number" && <p className={styles.label}></p>} */}
      {/* {propertyLabel && <span className={styles.propertyLabel}>{label}</span>} */}
      <div className={styles.numberSelector}>
        <div className={styles.numberSelectorContent}>
          <input
            type="text"
            className={`${styles.numberSelectorValue} `}
            value={inputValue}
            onChange={handleDirectInput}
            onBlur={handleBlur}
            inputMode="numeric"
            pattern="[0-9]*"
            disabled={disabled}
            readOnly={readOnly}
          />
          <div className={styles.numberSelectorControls}>
            <button 
              className={`${styles.numberSelectorButton} `} 
              onClick={handleIncrement}
              disabled={disabled || readOnly}
            >
              <Image 
                src="/images/num-up.svg" 
                alt="increment" 
                width="21" 
                height="14"
              />
            </button>
            <button 
              className={`${styles.numberSelectorButton} ${disabled || readOnly ? styles.disabled : ''}`} 
              onClick={handleDecrement}
              disabled={disabled || readOnly}
            >
              <Image 
                src="/images/num-down.svg" 
                alt="decrement" 
                width="21" 
                height="14"
              />
            </button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default NumberSelector;