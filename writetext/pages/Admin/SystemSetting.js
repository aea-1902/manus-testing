import React from 'react'

export default function SystemSetting() {
  return (
    <>
        <div className="header">
            <p>System Settings</p>
        </div>
        <div className='system-setting content-body'>
            <form>
            <p className='font-16 mb-14 sub-p'>Sample group name</p>
            <div className='form'>
                <div className="form-group row">
                        <div className='col-sm-4'>
                        <label  className="col-sm-2 col-form-label">Dropdown</label>
                        </div>
                        <div className="col-sm-8">
                            <select id="aiModel" className="form-select" aria-label="Choose AI Model">
                                <option selected disabled>Choose AI Model</option>
                                <option value="1">Model 1</option>
                                <option value="2">Model 2</option>
                            </select>
                        </div>
                    </div>
                    <div className='form-group row'>
                        <div className='col-sm-4'>
                            <label  className="col-sm-2 col-form-label">Double radio options</label>
                        </div>
                        <div className='col-sm-8'>
                            <div className='radio'>
                                <div className="form-check form-check-inline col-sm-5">
                                    <input className="form-check-input" type="radio" value="option1" name='doubleRadioOptions'/>
                                    <label className="form-check-label" >Option 1</label>
                                </div>
                                <div className="form-check form-check-inline col-sm-5">
                                    <input className="form-check-input" type="radio" value="option2" name='doubleRadioOptions'/>
                                    <label className="form-check-label">Option 2</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='form-group row'>
                        <div className='col-sm-4'>
                            <label  className="col-sm-2 col-form-label">Multiple radio options</label>
                        </div>
                        <div className='col-sm-8'>
                            <div className='radio-multi'>
                                <div className="form-check form-check-inline col-sm-5">
                                    <input className="form-check-input" type="radio" value="option1" name='multipleRadioOptions'/>
                                    <label className="form-check-label" >Option 1</label>
                                </div>
                                <div className="form-check form-check-inline col-sm-5">
                                    <input className="form-check-input" type="radio" value="option2" name='multipleRadioOptions'/>
                                    <label className="form-check-label">Option 2</label>
                                </div>
                                <div className="form-check form-check-inline col-sm-5">
                                    <input className="form-check-input" type="radio" value="option2" name='multipleRadioOptions'/>
                                    <label className="form-check-label">Option 2</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='form-group row'>
                        <div className='col-sm-4'>
                            <label  className="col-sm-2 col-form-label">Double checkbox options</label>
                        </div>
                        <div className='col-sm-8'>
                            <div className='radio'>
                                <div className="form-check form-check-inline col-sm-5">
                                    <input className="form-check-input" type="checkbox" value="option1" name='doubleCheckboxOptions'/>
                                    <label className="form-check-label" >Option 1</label>
                                </div>
                                <div className="form-check form-check-inline col-sm-5">
                                    <input className="form-check-input" type="checkbox" value="option2" name='doubleCheckboxOptions'/>
                                    <label className="form-check-label">Option 2</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='form-group row'>
                        <div className='col-sm-4'>
                            <label  className="col-sm-2 col-form-label">Multiple checbox options</label>
                        </div>
                        <div className='col-sm-8'>
                            <div className='radio-multi'>
                                <div className="form-check form-check-inline col-sm-5">
                                    <input className="form-check-input" type="checkbox" value="option1" name='multipleCheckboxOptions'/>
                                    <label className="form-check-label" >Option 1</label>
                                </div>
                                <div className="form-check form-check-inline col-sm-5">
                                    <input className="form-check-input" type="checkbox" value="option2" name='multipleCheckboxOptions'/>
                                    <label className="form-check-label">Option 2</label>
                                </div>
                                <div className="form-check form-check-inline col-sm-5">
                                    <input className="form-check-input" type="checkbox" value="option2" name='multipleCheckboxOptions'/>
                                    <label className="form-check-label">Option 2</label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
               
                <hr className='hr' />
                    
                <p className='font-16 mb-14 sub-p'>Sample group name</p>
                <div className='form'>
                    <div className='form-group row'>
                        <div className='col-sm-4'>
                            <label  className="col-sm-2 col-form-label">Multiple line textbox</label>
                        </div>
                        <div className='col-sm-8'>
                            <textarea class="form-control"rows="6"></textarea>
                        </div>
                    </div>
                    
                    <div className='form-group row'>
                        <div className='col-sm-4'>
                            <label  className="col-sm-2 col-form-label">Single line textbox</label>
                        </div>
                        <div className='col-sm-8'>
                            <input class="form-control" />
                        </div>
                    </div>
                </div>
                
                <div className="right">
                    <input type="button" className="btn btn-primary submit-button" value="Save changes"/>
                </div>
            </form> 
        </div>
    </>
  )
}

