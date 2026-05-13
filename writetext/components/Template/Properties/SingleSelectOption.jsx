import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import styles from '../../../styles/styling/Templates/SingleSelectOption.module.css';

const SingleSelectOption = ({ 
  label = "", 
  options = [], 
  defaultValue = "", 
  onChange = () => {},
  blockIndex,
  propertyIndex,
  propertyId,
  block,
  properties = [],
  values = [],
  warningMessage = "",
  disabled = false,
  readOnly = false
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  useEffect(() => {
    // Update selectedValue when values prop changes
    if (values && values.length > 0) {
      setSelectedValue(values[0]);
    } else {
      setSelectedValue("");
    }
  }, [values]);
  useEffect(() => {
    if (properties && properties.length > 0) {
      if (propertyId !== "structure") {
        if (propertyId === "alignment")
          {
            setSelectedValue(values[0] === '' ? defaultValue : values[0]);
          }
        else
        {
          setSelectedValue(values[0] === '' ? properties[0].id : values[0]);
        }
      }else 
      {
        setSelectedValue(values[0] === '' ? defaultValue : values[0]);
      }
    }
  }, [properties]);
  const handleOptionClick = (optionId) => {
    if (disabled || readOnly) return;
    // If clicking the currently selected option, unselect it
    if (optionId === selectedValue) {
      //setSelectedValue("");
      // Update the values array to be empty
      // const updatedProperties = options.map(option => ({
      //   ...option,
      //   values: []
      // }));
      // onChange(blockIndex, propertyIndex, updatedProperties, propertyId);
      return;
    }

    setSelectedValue(optionId);
    
    // Update the values array in the properties
    const updatedProperties = options.map(option => ({
      ...option,
      values: option.id === optionId ? [option.id] : []
    }));
    
    onChange(blockIndex, propertyIndex, updatedProperties, propertyId);
  };
  const isFromImage = () => {
    if (block.id.includes('image')) {
      return true;
    }
    return false;
  }
  const shouldDisable = () => {
    if (isFromImage()) {
      if (propertyId === 'structure')
      {
        if (block.groups.find(group => group.id === 'image').properties.find(prop => prop.id === 'include').values[0] === 'true') {
          return false;
        }else{
          return true;
        }
      }
      
      if (propertyId === 'heading_text_tag') {
        const sectionHeadingGroup = block.groups.find(group => group.id === 'section_heading');
        const headingTextProperty = sectionHeadingGroup?.properties.find(prop => prop.id === 'heading_text');
        const headingTextValue = headingTextProperty?.values?.[0];
        
        const imageGroup = block.groups.find(group => group.id === 'image');
        const includeProperty = imageGroup?.properties.find(prop => prop.id === 'include');
        const includeValue = includeProperty?.values?.[0];
        
        if (headingTextValue === 'none' || includeValue === 'false') {
          return true;
        }else{
          return false;
        }
      }
        return false;
    }
    else
    {
      if (propertyId === 'heading_text_tag') {
        if (block.groups.find(group => group.id === 'section_heading').properties.find(prop => prop.id === 'heading_text').values[0] !== 'none') {
          return false;
        }else{
          return true;
        }
      }
  }

    return false;
  }
  if (label === "") {
    return null;
  }
  
  return (
    <div className={`${styles.container} ${shouldDisable() ? 'field-hidden' : 'field-show'} ${propertyId === "structure" || propertyId === "alignment" ? `${styles.structureContainer}` : ''}`}>
      
      {options.map((option, index) => (
        <div key={index} className={styles.buttonGroup}>
          <button 
            className={`${styles.formatButton} ${selectedValue === option.id ? styles.active : ''} ${styles[option.id]} ${propertyId === "heading_text_tag" && warningMessage !== '' ? styles.hasWarning : ''} ${propertyId === "alignment" && styles.alignment} ${disabled || readOnly ? styles.disabled : ''}`}
            onClick={() => handleOptionClick(option.id)}
            disabled={disabled || readOnly}
          > 
          
            {propertyId === "structure" ? (
              (() => {
                switch (option.id) {
                  case "paragraph":
                    return <p>¶ {option.text}</p>;
                  case "bullet_list":
                    return <p>• {option.text}</p>;
                  case "number_list":
                    return <p>1. {option.text}</p>;
                  default:
                    return option.text;
                }
              })()
            ) : propertyId === "alignment" ? (
              (() => {
                switch (option.id) {
                  case "left":
                    return <p><Image src="/images/ic_left.svg" width={13} height={13} alt="Align left" /> {option.text}</p>;
                  case "center": 
                    return <p><Image src="/images/ic_center.svg" width={13} height={13} alt="Align center" /> {option.text}</p>;
                  case "right":
                    return <p><Image src="/images/ic_right.svg" width={13} height={13} alt="Align right" /> {option.text}</p>;
                  default:
                    return option.text;
                }
              })()
            ) : (
              option.text
            )}
            
          </button>
        </div>
      ))}
    </div>
  );
};

export default SingleSelectOption;
