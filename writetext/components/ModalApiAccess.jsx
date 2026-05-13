import React, {useState, useEffect, useRef} from 'react'
import { useRouter } from 'next/router'
import ModalGenerateKey from './ModalGenerateKey'
import ModalPrompt from '../components/ModalPrompt'

import axios from 'axios'
function ModalApiAccess({target, modalref, keyId, keyData, setReload, setKeyId}) {
    const AppSettings = require('../settings/AppSetting').default
    const https = require("https")
    const httpsAgent = new https.Agent({ rejectUnauthorized: false })
    const modalRef = useRef(null)
    const router = useRouter()

   
    useEffect(() => {
    // Attach event listener when the component mounts
    document.addEventListener('mousedown', handleClickOutside);

    // Clean up the event listener when the component unmounts
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
    }, []);
    const closeModal = (event) => {
    event.preventDefault()
    var modalElement = document.getElementById('create-key');
    modalElement.style.display = 'none';

    var backdropElement = document.getElementsByClassName('modal-backdrop');
    backdropElement[0].remove()
    }
  return (
    <div className="d-flex justify-content-center align-items-center" ref={modalRef}>
    <ModalPrompt target="key" ></ModalPrompt>
    <ModalGenerateKey target="created-key" modalref={modalRef} generatedKey={generatedKey}></ModalGenerateKey>
        <div className="modal fade" id={target} tabIndex="-1" aria-labelledby={target} aria-hidden="true">
        <div className="modal-dialog mtp-15 keys-modal create-key ">
            <div className="modal-content">
            <div className="modal-header">
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <div className="mb-20">
                    <p className="modal-title">{keyId != '' ? 'Update' : 'Create key'}</p>
                    {errorMessage != '' &&
                    <div className="mb-20">
                        <p className='error-message'>{errorMessage}</p>
                    </div>}
                </div>
            </div>
            {/* <div className="form-group d-flex mb-48">
                <div className="form-floating w-100">
                    <input id="key_name" className="form-control" type="text" placeholder='Name (optional)' value={keyName} onChange={e => setKeyName(e.target.value)} disabled={keyId != '' ? true : false}/>
                    <label htmlFor="key_name">Name (optional)</label>
                </div>
            </div>
            <div>
                <p className='font-16'>Assign key to user</p>
            </div> */}
            <form onSubmit={generatedKeys}>
            <div className="form-group d-flex">
                <div className="form-floating w-100 req">
                    <input required id="key_email" className="form-control" type="text" placeholder='Email' value={keyEmail} onChange={e => setKeyEmail(e.target.value)} disabled={keyId != '' ? true : false}/>
                    <label htmlFor="key_email">Email</label>
                </div>
            </div>
            
            <div className="form-group d-flex bd-highlight">
                        <div className="form-floating mr-14 w-100">
                            <input id="firstName" className="form-control" type="text" placeholder='First name' value={firstName === null ? '' : firstName} onChange={e => {setFirstName(e.target.value);}} />
                            <label htmlFor="firstName">First name (optional)</label>
                        </div>
                        <div className="form-floating w-100">
                            <input id="lastName" className="form-control" type="text" placeholder="Last name" value={lastName === null ? '' : lastName} onChange={e => {setLastName(e.target.value);}}/>
                            <label htmlFor="lastName">Last name (optional)</label>
                        </div>
            </div>
             <div className='url-container mb-48'>
                <label className="dropdown-item all">
                    <input 
                    className='form-check-input'
                    type="checkbox"
                    value="All"
                    onChange={() => handleCheckAllUrls('All')}
                    checked={selectedUrls.includes('All')}
                    // onChange={() => handleCheckboxChangeAll('All')}
                    />
                    <span>Enable access to all webshops ({urls.length})</span>
                </label>
                
                <div className='url-list'>
                    {urls != null && urls.map((url, index) => {
                        return (
                            <label className="dropdown-item" key={index}>
                                <input
                                className='form-check-input'
                                type="checkbox"
                                value={url.domain}
                                checked={selectedUrls.includes('All') ? true : selectedUrls.includes(url.domain)}
                                onChange={() => handleCheckboxChange(url.domain)}
                                />
                                <span className={`${selectedUrls.includes(url.domain) ? 'checked' : ''}`}>{url.domain}</span>
                            </label>
                        )
                    })}
                    
                </div>
            </div>
           
            <div className="right"> 
                      <button className="btn mr-8 font-14" onClick={closeModal}>Cancel</button>  
                      <button className="btn btn-primary font-14" type='submit' >{keyId != '' ? 'Update' : 'Create key'}</button>
            </div>
            </form>
            
            
            </div>
        </div>
        </div>
    </div>
  )
}

export default ModalKeys