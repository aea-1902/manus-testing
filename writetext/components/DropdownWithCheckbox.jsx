import { useState, useRef } from 'react';
import { Dropdown, DropdownButton, Form } from 'react-bootstrap';

const DropdownWithCheckbox = (props) => {
  const [checked, setChecked] = useState(false);
  const dropdownRef = useRef(null);

  function handleCheckboxChange(event) {
    setChecked(event.target.checked);
    if (props.onCheckboxChange) {
      props.onCheckboxChange(event.target.checked);
    }
    if (dropdownRef.current) {
      const dropdown = dropdownRef.current;
      dropdown.show();
      const menu = dropdown.querySelector('.dropdown-menu');
      menu.addEventListener('click', function (e) {
        e.stopPropagation();
      });
    }
  }
  function handleMenuClick(event) {
    event.stopPropagation();
  }
  return (
    <DropdownButton 
    ref={dropdownRef}
    title={props.title}
    onClick={handleMenuClick}
    >
      {props.children}
        <Dropdown.Divider />{' '}
      <Dropdown.Item>
        <input
          type="checkbox"
          checked={checked}
          onChange={handleCheckboxChange}
          className='mr-10'
        />
        {props.checkboxLabel}
      </Dropdown.Item>
    </DropdownButton>
  );
}

export default DropdownWithCheckbox