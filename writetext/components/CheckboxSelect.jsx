import { useState } from 'react';

const CheckboxSelect = () => {
  const [selectedItems, setSelectedItems] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleCheckboxChange = (value) => {
    if (selectedItems.includes(value)) {
      setSelectedItems(selectedItems.filter(item => item !== value));
    } else {
      setSelectedItems([...selectedItems, value]);
    }
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-secondary dropdown-toggle custom-dropdown w-100"
        type="button"
        id="dropdownMenuButton"
        data-toggle="dropdown"
        aria-haspopup="true"
        aria-expanded={dropdownOpen ? 'true' : 'false'}
        onClick={toggleDropdown}
      >
        <span>
        {selectedItems.length > 0 ? `${selectedItems.length} selected` : 'Select actions'}</span>
      </button>
      <div className={`w-100 dropdown-menu${dropdownOpen ? ' show' : ''}`} aria-labelledby="dropdownMenuButton">
      <label className="dropdown-item select-all">
          <input 
            className='form-check-input'
            type="checkbox"
            value="Select all"
            checked={selectedItems.includes('All')}
            onChange={() => handleCheckboxChange('All')}
          />
          <span>Select all</span>
        </label>
        <label className="dropdown-item">
          <input 
            className='form-check-input'
            type="checkbox"
            value="option1"
            checked={selectedItems.includes('option1')}
            onChange={() => handleCheckboxChange('option1')}
          />
          <span>Option 1</span>
        </label>
        <label className="dropdown-item">
          <input
            className='form-check-input'
            type="checkbox"
            value="option2"
            checked={selectedItems.includes('option2')}
            onChange={() => handleCheckboxChange('option2')}
          />
          <span>Option 2</span>
        </label>
        <label className="dropdown-item">
          <input
            className='form-check-input'
            type="checkbox"
            value="option3"
            checked={selectedItems.includes('option3')}
            onChange={() => handleCheckboxChange('option3')}
          />
          <span>Option 3</span>
        </label>
      </div>
    </div>
  );
};

export default CheckboxSelect;
