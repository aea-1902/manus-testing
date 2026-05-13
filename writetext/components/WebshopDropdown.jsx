import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/router';
import FollowTooltip from "../components/FollowTooltip";
import styles from '../styles/styling/WebshopCustomDropdown.module.css';

// Helper function to process options (handle both array and CSV string formats)
const processOptions = (options) => {
  if (Array.isArray(options)) {
    const sortedOptions = options.sort((a, b) => a.localeCompare(b));
    return sortedOptions;
  }
  if (typeof options === 'string' && options.includes(',')) {
    const sortedOptions = options.split(',').map(option => option.trim()).filter(Boolean);
    sortedOptions.sort((a, b) => a.localeCompare(b));
    return sortedOptions;
  }

  return [options].filter(Boolean);
};

// Component for dropdown items with conditional tooltip and checkbox
const DropdownItem = ({ option, isSelected, onClick, index, isIndeterminate = false }) => {
  const [isTextOverflowing, setIsTextOverflowing] = useState(false);
  const buttonRef = useRef(null);
  
  // Use the option directly since we're now working with arrays
  const displayName = option;

  useEffect(() => {
    const checkTextOverflow = () => {
      if (buttonRef.current) {
        // Find the text element (checkboxLabel span) within the button
        const textElement = buttonRef.current.querySelector(`.${styles.checkboxLabel}`);
        if (textElement) {
          const isOverflowing = textElement.scrollWidth > textElement.clientWidth;
          setIsTextOverflowing(isOverflowing);
        } else {
          // Fallback: check the button itself if we can't find the text element
          const element = buttonRef.current;
          const isOverflowing = element.scrollWidth > element.clientWidth;
          setIsTextOverflowing(isOverflowing);
        }
      }
    };

    // Use setTimeout to ensure the element is rendered and measured correctly
    const timer = setTimeout(checkTextOverflow, 0);
    window.addEventListener('resize', checkTextOverflow);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkTextOverflow);
    };
  }, [option]);

  // Also check if text is too long as a backup
  useEffect(() => {
    if (displayName.length > 30) {
      setIsTextOverflowing(true);
    }
  }, [displayName]);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onClick();
  };

  const renderButton = () => (
    <button
      ref={buttonRef}
      className={`${styles.dropdownItem} ${isSelected ? styles.selected : ''}`}
      onClick={handleClick}
    >
      <div className={styles.checkboxContainer}>
        <input
          type="checkbox"
          checked={isSelected}
          ref={(input) => {
            if (input) {
              input.indeterminate = isIndeterminate;
            }
          }}
          readOnly
          className={styles.checkbox}
        />
        <span className={styles.checkboxLabel}>{displayName}</span>
      </div>
    </button>
  );

  return isTextOverflowing ? (
    <FollowTooltip key={index} content={displayName}>
      {renderButton()}
    </FollowTooltip>
  ) : (
    renderButton()
  );
};

const WebshopCustomDropdown = ({
  options = [],
  value = [],
  onChange = () => {},
  placeholder = 'Select options',
  className = '',
  disabled = false,
  templateType = '',
  multiple = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValues, setSelectedValues] = useState([]);
  const [showAbove, setShowAbove] = useState(false);
  const dropdownRef = useRef(null);
  const router = useRouter();

  // Process options to handle both array and CSV string formats
  const processedOptions = processOptions(options);

  // Process selected values to handle both array and string formats
  const processSelectedValues = (val) => {
    if (Array.isArray(val)) {
      return val;
    }
    // If it's a string, treat it as a single value (legacy support)
    if (typeof val === 'string') {
      return [val].filter(Boolean);
    }
    return [val].filter(Boolean);
  };

  useEffect(() => {
    const processedValues = processSelectedValues(value);
    setSelectedValues(processedValues);
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
      if (!isOpen) {
        // Check if there's enough space below
        const rect = dropdownRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const dropdownHeight = 250; // max-height of dropdown
        setShowAbove(spaceBelow < dropdownHeight);
      }
      setIsOpen(!isOpen);
    }
  };

  const handleSelect = (option) => {
    let newSelectedValues;
    // const emptyGuid = "00000000-0000-0000-0000-000000000000";
    
    // if (option === "No template") {
    //   // Toggle "No template" - if it's already selected, deselect it and clear all
    //   if (selectedValues.includes(emptyGuid)) {
    //     newSelectedValues = [];
    //   } else {
    //     // Select "No template" and clear all other selections
    //     newSelectedValues = [emptyGuid];
    //   }
    // } else 
    if (multiple) {
      // If selecting a regular template, remove "No template" from selection
      if (selectedValues.includes(option)) {
        newSelectedValues = selectedValues.filter(val => val !== option);
      } else {
        // newSelectedValues = [...selectedValues.filter(val => val !== emptyGuid), option];
        newSelectedValues = [...selectedValues, option];
      }
    } else {
      newSelectedValues = [option];
    }
    setSelectedValues(newSelectedValues);
    
    // Format output based on the original input format
    let outputValue;
    if (multiple) {
      // Always return array for multiple selection
      outputValue = newSelectedValues;
    } else {
      outputValue = newSelectedValues[0];
    }
    onChange(outputValue);
    
    if (!multiple) {
      setIsOpen(false);
    }
  };

  const handleSelectAll = () => {
    const allOptions = processedOptions.filter(option => option !== "Select template/s");
    const newSelectedValues = selectedValues.length === allOptions.length ? [] : allOptions;
    setSelectedValues(newSelectedValues);
    onChange(newSelectedValues);
  };

  const handleUnselectAll = () => {
    // Clear all templates and select "No template" with empty GUID
    // const emptyGuid = "00000000-0000-0000-0000-000000000000";
    // setSelectedValues([emptyGuid]);
    // onChange([emptyGuid]);
    
    // Clear all templates
    setSelectedValues([]);
    onChange([]);
  };

  const handleCreateNew = (templateType) => {
    //add template type to session storage
      sessionStorage.removeItem('templateObjects');
    sessionStorage.setItem('addTemplateType', templateType);
    router.push('/templates/add');
  };

  const getDisplayText = () => {
    if (selectedValues.length === 0) {
      return "Select template/s";
    }
    if (selectedValues.length === 1) {
      // Check if "No template" is selected
      // if (selectedValues[0] === "00000000-0000-0000-0000-000000000000") {
      //   return "No template";
      // }
      return "1 template";
    }
    return `${selectedValues.length} templates`;
  };



  // Calculate select all state
  const allOptions = processedOptions.filter(option => option !== "Select template/s");
  // const emptyGuid = "00000000-0000-0000-0000-000000000000";
  
  // Filter out empty GUID from selected values for counting purposes
  // const selectedRegularTemplates = selectedValues.filter(val => val !== emptyGuid);
  
  // const isAllSelected = selectedRegularTemplates.length === allOptions.length && allOptions.length > 0;
  // const isIndeterminate = selectedRegularTemplates.length > 0 && selectedRegularTemplates.length < allOptions.length;
  
  const isAllSelected = selectedValues.length === allOptions.length && allOptions.length > 0;
  const isIndeterminate = selectedValues.length > 0 && selectedValues.length < allOptions.length;

  const renderButton = (buttonContent) => (
    <button
      type="button"
      className={styles.dropdownToggle}
      onClick={handleToggle}
      disabled={disabled}
      style={selectedValues.length === 0 ? {color: '#888888'} : {}}
    >
      <span className={styles.selectedValue}>
        {getDisplayText()}
      </span>
      <span className={styles.caret}></span>
    </button>
  );

  return (
    <div 
      ref={dropdownRef} 
      className={`${styles.dropdown} ${className} ${disabled ? styles.disabled : ''}`}
    >
      {renderButton()}
      
      {isOpen && (
        <div className={`${styles.dropdownMenu} ${showAbove ? styles.top : ''}`}>
          {/* Action buttons at the top */}
          <button 
            className={styles.dropdownItem} 
            onClick={() => handleCreateNew(templateType)}
            style={{borderBottom: '1px solid #E9ECEF'}}
          >
            Create new template
          </button>
          
          {/* No template option - commented out
          <button
            className={`${styles.dropdownItem}`}
            onClick={() => handleSelect("No template")}
            style={{borderBottom: '1px solid #E9ECEF'}}
          >
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={selectedValues.includes("00000000-0000-0000-0000-000000000000")}
                readOnly
                className={styles.checkbox}
              />
              <span className={styles.checkboxLabel}>No template</span>
            </div>
          </button>
          */}
          
          {/* Select/Unselect all option */}
          {allOptions.length > 0 && (
            <button
              className={`${styles.dropdownItem}`}
              onClick={isAllSelected ? handleUnselectAll : handleSelectAll}
              style={{borderBottom: '1px solid #E9ECEF'}}
            >
              <div className={styles.checkboxContainer}>
                <input
                  type="checkbox"
                  checked={isAllSelected}
                  ref={(input) => {
                    if (input) {
                      input.indeterminate = isIndeterminate;
                    }
                  }}
                  readOnly
                  className={styles.checkbox}
                />
                <span className={styles.checkboxLabel}>
                  {isAllSelected ? 'Unselect all' : 'Select all'}
                </span>
              </div>
            </button>
          )}
          
          {/* Template options */}
          {processedOptions.length > 0 && (
          processedOptions.map((option, index) => (
            option !== "Select template/s" && (
              <DropdownItem
                key={index}
                option={option}
                isSelected={selectedValues.includes(option)}
                onClick={() => handleSelect(option)}
                index={index}
              />
            )
          ))
          )}
        </div>
      )}
    </div>
  );
};

export default WebshopCustomDropdown; 