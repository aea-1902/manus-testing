import React, {useState, useEffect, useRef} from 'react'
import { useRouter } from 'next/router'
import ModalGenerateKey from './ModalGenerateKey'
import ModalPrompt from '../components/ModalPrompt'

import axios from 'axios'
function ModalKeys({target, modalref, keyId, keyData, setReload, setKeyId}) {
    const AppSettings = require('../settings/AppSetting').default
    const https = require("https")
    const httpsAgent = new https.Agent({ rejectUnauthorized: false })
    const modalRef = useRef(null)
    const [keyName, setKeyName] = useState('')
    const [keyEmail, setKeyEmail] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [urls, setUrls] = useState([])
    const [selectedUrls, setSelectedUrls] = useState([])
    const [generatedKey, setGeneratedKey] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const router = useRouter()

    function resetFields(){
        setKeyName('')
        setKeyEmail('')
        setFirstName('')
        setLastName('')
        setUrls([])
        setSelectedUrls([])
        setErrorMessage('')
    }
    async function getDomains(){
        if (keyData != null)
        {
            setKeyEmail(keyData.email)
            setFirstName(keyData.firstName)
            setLastName(keyData.lastName)

        }
        const apiUrl = `${AppSettings.API_URL}/webshop/GetWebshopURLs`
        await axios.get(apiUrl, { httpsAgent }).then(res => {
            let webshopUrls = res.data
            
            setUrls(webshopUrls)
            if (keyId != '' && keyId != null){ 
                axios.get(`${AppSettings.API_URL}/ApiToken/${keyId}`).then(r => {
                if (r.data.urls != null && r.data.urls.length > 0)
                {
                    const selected = webshopUrls.filter(url => r.data.urls.includes(url.urlId)).map(url => url.domain)
                    setSelectedUrls(selected)
                    if (keyData != null && keyData.allUrl)
                    {
                        setSelectedUrls([...selected, 'All'])
                    }
                }
                })
            }
            else
            {
                const selected = webshopUrls.map(url => url.domain)
                setSelectedUrls([...selected, 'All'])
                setUrls(webshopUrls)
            }
        })
    }
    function generatedKeys(event){
        event.preventDefault()
        const generateRandomToken = () => {
            return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        }
        async function getKeys(){
            let selectedUrlIds = []
            if (keyEmail != '')
            {
                const urlIds = urls.filter(url => selectedUrls.includes(url.domain)).map(url => url.urlId)
                urlIds.forEach(urlId => {
                    selectedUrlIds.push(urlId)
                })
            }
            await axios.post(`${AppSettings.API_URL}/ApiToken/add`, {
                Name: keyName,
                Email: keyEmail,
                FirstName: firstName,
                LastName: lastName,
                UrlIds: selectedUrlIds,
                AllUrl: selectedUrls.includes('All') ? true : false
            }, { httpsAgent }).then(res => {
                var modalElement = document.getElementById('create-key')
                modalElement.style.display = 'none'

                var backdropElement = document.getElementsByClassName('modal-backdrop')
                backdropElement[0].remove()
                setKeyId(res.data.id)
                resetFields()
                setReload(true)
                setGeneratedKey(res.data.token)
                const { Modal } = require("bootstrap")
                const myModals = new Modal("#created-key");
                myModals.show()
            
            }).catch(err => {
                if (err.response.status == 400)
                {
                    setErrorMessage("You are unable to create this user, please check if the email you provided is valid.")
                    //highlight email
                    //document.getElementById('key_email').focus()
                    //document.getElementById('key_email').select()

                }
                if (err.response.status == 401)
                {
                    setErrorMessage("You are not allowed to do this action.")
                }
            })
        }
        async function updateKeys(){
            let selectedUrlIds = []
            const urlIds = urls.filter(url => selectedUrls.includes(url.domain)).map(url => url.urlId);
            urlIds.forEach(urlId => {
                selectedUrlIds.push(urlId)
            })
            const url = `${AppSettings.API_URL}/ApiToken/${keyId}/update`
            await axios.post(url, {
                Name: keyName,
                FirstName: firstName,
                LastName: lastName,
                UrlIds: selectedUrlIds,
                AllUrl: selectedUrls.includes('All') ? true : false
            }, { httpsAgent }).then(res => {
                var modalElement = document.getElementById('create-key');
                modalElement.style.display = 'none';

                var backdropElement = document.getElementsByClassName('modal-backdrop');
                backdropElement[0].remove()
                resetFields()
                setReload(true)
                const { Modal } = require("bootstrap")
                const myModals = new Modal("#key");
                myModals.show()
            
            })
        }
        if (keyId != '')
        {
            updateKeys()
        }
        else{
            //trigger form validation of input with id of key_email
            if (document.getElementById('key_email').value === '') {
                document.getElementById('key_email').focus()
            }
            else
            {
                getKeys()}

        }
    }
    useEffect(() => {
        if (keyId != null)
            {
                setKeyEmail('')
                setFirstName('')
                setLastName('')
                setUrls([])
                getDomains()}
    }, [keyId])

    const handleCheckAllUrls = async (value) => {
        let prev = []
        if (value === "All") {
            if (selectedUrls.includes(value)) {
                setSelectedUrls([])
            }
            else {
                prev.push(value)
                urls.forEach((item) => {
                    prev.push(item.domain)
                })
                
                setSelectedUrls(prev)
            }
        }
       
    }

    const handleCheckboxChange = async (value) => {
        let prev = selectedUrls
        if (selectedUrls.includes(value)){
            prev = prev.filter(item => item !== value)
            prev = prev.filter(item => item !== "All");
            setSelectedUrls(prev)
        }else{
            prev = [...prev, value]
            prev = prev.filter(item => item !== "All");
            setSelectedUrls(prev)
        }
    }

    const handleClickOutside = (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            setErrorMessage('')
            setKeyId(null)
            setSelectedUrls([])
            setUrls([])
        }
    };
    const validateKeyPress = (event) => {
        const charCode = event.charCode;
        const char = String.fromCharCode(charCode);
        const allowedChars = /^[a-zA-Z\s\-',.\p{L}]$/u;
    
        if (!allowedChars.test(char)) {
            event.preventDefault();
        }
    }
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
            <form onSubmit={generatedKeys}>
            <div className="form-group d-flex">
                <div className="form-floating w-100 req">
                    <input required id="key_email" className="form-control" type="text" placeholder='Email' value={keyEmail} onChange={e => setKeyEmail(e.target.value)} disabled={keyId != '' ? true : false}/>
                    <label htmlFor="key_email">Email</label>
                </div>
            </div>
            
            <div className="form-group d-flex bd-highlight">
                        <div className="form-floating mr-14 w-100">
                            <input id="firstName" className="form-control" type="text" placeholder='First name' value={firstName === null ? '' : firstName}  onKeyPress={validateKeyPress} onChange={e => {setFirstName(e.target.value);}} />
                            <label htmlFor="firstName">First name (optional)</label>
                        </div>
                        <div className="form-floating w-100">
                            <input id="lastName" className="form-control" type="text" placeholder="Last name" value={lastName === null ? '' : lastName}  onKeyPress={validateKeyPress} onChange={e => {setLastName(e.target.value);}}/>
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