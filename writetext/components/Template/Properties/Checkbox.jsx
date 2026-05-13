import React from 'react';
import Image from 'next/image'
import FollowTooltip from '../../../components/FollowTooltip';
import styles from '../../../styles/styling/Templates/Templates.module.css';

const Checkbox = ({ block, blockIndex, property, propertyIndex, onChange, preview }) => {

    const handleChange = (e) => {
        onChange(blockIndex, propertyIndex, property.id, e.target.checked);
    }

    const value = property.values && property.values.length > 0 
            ? property.values[0] === 'true'
            : property.defaultValues && property.defaultValues.length > 0 
                ? property.defaultValues[0] === 'true' 
                : false;

  return (
    <div className='d-flex' style={{marginLeft: '14px'}}>
        <input 
            className={`${styles.templatesCheckboxCustom}`} 
            type="checkbox" 
            checked={value} 
            onChange={handleChange} 
            style={{height: '14px', width: '14px', margin: 'auto 0'}}
            id={`checkbox-${property.id}`}
        />
        <label 
            htmlFor={`checkbox-${property.id}`}
            style={{marginLeft: '10px', cursor: 'pointer', fontSize: '13px'}}
            onClick={(e) => {
                e.preventDefault();
                handleChange({ target: { checked: !value } });
            }}
        >
            {property.label}
        </label>
        {property.id === 'research' && <FollowTooltip content={`If your prompt requires external context (like market trends or competitor insights), you can also enable web research to improve the relevance and accuracy of the generated text.`}><Image className={`${styles.imageIcon}`} src="/images/ico_image_block_info.svg" width={16} height={16} alt="Image" style={{marginLeft: '8px'}}/></FollowTooltip>}
    </div>
  )
};

export default Checkbox;