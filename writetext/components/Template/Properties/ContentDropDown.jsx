import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import CustomDropdown from '../../../components/CustomDropdown';
import FollowTooltip from '../../../components/FollowTooltip';
import styles from '../../../styles/styling/Templates/ContentDropdown.module.css';


const ContentDropdown = ({ 
  label = "Select an option",
  options = [],
  defaultValue = "",
  onChange = () => {},
  blockIndex,
  propertyIndex,
  propertyId,
  values = [],
  disabled = false,
  readOnly = false,
  block,
  properties,
  group,
  preview = false,
  showChoiceTooltip = false
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  useEffect(() => {
    const defaultOption = options.find(option => option.id === defaultValue);
    setSelectedValue(defaultOption ? defaultOption.text : defaultValue);
  }, [defaultValue, options]);

  const handleChange = (value) => {
    const option = options.find(opt => opt.text === value);
    onChange(blockIndex, propertyIndex, option ? option.id : value, propertyId);
  };

  const dropdownOptions = options.map(option => option.text || option);
  
  const shouldRender = () => {
    // return true;
    if (!properties) return false;
    if (group.id !== 'content') return true;
    if (propertyId === 'content_text') return true;
    const structure = properties.find(prop => prop.id === 'structure');
    if (!structure) return true;
    if (structure?.values[0]=== 'bullet_list' || structure?.values[0] === 'number_list')
    {
      return true;
    }

    

    return false;
  }

  const isBlockEnabled = () => {
    const enabledGroup = block.groups.find(group => group.id === "enabled");
    if (!enabledGroup) return false;
    const enabledProperty = enabledGroup.properties.find(prop => prop.id === "enabled");
    if (!enabledProperty) return false;
    return enabledProperty.values[0] === "true";
  }

  const isFromImage = () => {
    if (block.id.includes('image')) {
      return true;
    }
    return false;
  }

  const shouldDisable = () => {
    if (isFromImage()) {
      if (propertyId === 'placement' || propertyId === 'spacing_image' || propertyId === 'heading_text' || propertyId === 'number')
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

  // if (!shouldRender()) return null;
  if (isFromImage()) {
    return (
      <div className={`d-flex w-100 from-image ${shouldDisable() ? 'field-hidden' : (!shouldRender() ? 'field-hidden' : 'field-show')}`}>
      <CustomDropdown
        options={dropdownOptions}
        value={selectedValue}
        onChange={handleChange}
        placeholder="Select an option"
        style={{height: '32px'}}
        warningMessage={(propertyId === 'choice') ? (isBlockEnabled() && block.warningMessage.find(w => w.propertyId === propertyId) ? block.warningMessage.find(w => w.propertyId === propertyId).message : '') : ''}
      />
      {(propertyId === 'choice' && showChoiceTooltip) && <FollowTooltip content={`The main image that represents the product, often called the Featured Image, Product Image, or Thumbnail depending on your platform.`}><Image className={`${styles.imageIcon}`} src="/images/ico_image_block_info.svg" width={16} height={16} alt="Image" style={{marginLeft: '8px', marginTop: 'auto', marginBottom: 'auto'}}/> </FollowTooltip>}
    </div>
    )
  }
  return (
    <div className={`d-flex flex-column w-100 ${!preview ? (!shouldRender() ? 'field-hidden' : 'field-show') : ''}`}>
      <CustomDropdown
        options={dropdownOptions}
        value={selectedValue}
        onChange={handleChange}
        placeholder="Select an option"
        style={{height: '32px'}}
      />
    </div>
  );
};

export default ContentDropdown;
