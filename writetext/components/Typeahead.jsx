

import { FloatingLabel, Form } from 'react-bootstrap';
import { Hint, Typeahead } from 'react-bootstrap-typeahead';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
export default function TypeAheadDropDown({list, onchange, selected, placeholder}) {

  return (
    <Typeahead
    id="floating-label-example"
    onChange={onchange}
    options={list}
    placeholder={placeholder}
    renderInput={({ inputRef, referenceElementRef, ...inputProps }) => {
    return (
    <Hint>
        <FloatingLabel controlId="floatingLabel" label={placeholder}>
        <Form.Control
            {...inputProps}
            ref={(node) => {
            inputRef(node);
            referenceElementRef(node);
            }}
        />
        </FloatingLabel>
    </Hint>
    );
    }}
    
     selected={selected}
    />
  )
 
}