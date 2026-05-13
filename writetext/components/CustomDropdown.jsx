import React, { useState, useRef, useEffect } from 'react';
import styles from '../styles/styling/CustomDropdown.module.css';

const CustomDropdown = ({
  options = [],
  value = '',
  onChange = () => {},
  placeholder = 'Select an option',
  className = '',
  disabled = false,
  warningMessage = ''
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);
  const dropdownRef = useRef(null);

  useEffect(() => {
    setSelectedValue(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option) => {
    setSelectedValue(option);
    onChange(option);
    setIsOpen(false);
  };

  return (
    <div 
      ref={dropdownRef} 
      className={`${styles.dropdown} ${className} ${disabled ? styles.disabled : ''}`}
    >
      <button
        type="button"
        className={styles.dropdownToggle}
        onClick={handleToggle}
        disabled={disabled}
        style={{borderColor : warningMessage !== '' ? '#FFA500' : '#E0E0E0'}}
      >
        <span className={styles.selectedValue} style={{color : warningMessage !== '' ? '#FFA500' : '#000000'}}>
          {selectedValue || placeholder}
        </span>
        <span className={styles.caret}></span>
      </button>
      
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {options.map((option, index) => (
            option !== "Select template/s" && (
              <button
                key={index}
                className={`${styles.dropdownItem} ${selectedValue === option ? styles.selected : ''}`}
                onClick={() => handleSelect(option)}
              >
                {option}
              </button>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default CustomDropdown; 