import React, { useState, useEffect } from 'react';
import CustomDropdown from '../../../components/CustomDropdown';

const TemplateFor = ({ 
  disabled = false,
  label = "Select an option",
  options = [],
  defaultValue = "",
  onChange = () => {}
}) => {
  const [selectedValue, setSelectedValue] = useState(defaultValue);

  useEffect(() => {
    setSelectedValue(defaultValue);
  }, [defaultValue]);

  useEffect(() => {
    const draft = sessionStorage.getItem('templateObjects');
    // if (draft) {
    //   const parsedDraft = JSON.parse(draft);
    //   setSelectedValue(parsedDraft.template ? parsedDraft.template : options[0]);
    //   handleChange(parsedDraft.template ? parsedDraft.template : options[0]);
    // }
  }, []);

  const handleChange = (value) => {
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <div className="d-flex flex-column w-100">
      <CustomDropdown
        disabled={disabled}
        options={options}
        value={selectedValue}
        onChange={handleChange}
        placeholder="Select template"
        style={{height: '32px'}}
      />
    </div>
  );
};

export default TemplateFor;
