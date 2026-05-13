import React, {useState, useEffect, useRef} from 'react'
import { useRouter } from 'next/router'
import { Hint, Typeahead } from 'react-bootstrap-typeahead';
import { FloatingLabel, Form } from 'react-bootstrap';
import ModalGenerateKey from '../ModalGenerateKey'
import ModalPrompt from '../../components/ModalPrompt'
import apiService from '../../services/ApiService'
import { PlatformsEnum } from '../../enum/Platforms'
export default function ModalApiKeys({target, modalref, keyId, keyData, region, setReload, setKeyId, onSave}) {
    const AppSettings = require('../../settings/AppSetting').default
    const https = require("https")
    const httpsAgent = new https.Agent({ rejectUnauthorized: false })
    const modalRef = useRef(null)
    const [isFormDirty, setIsFormDirty] = useState(false)
    const [keyName, setKeyName] = useState('')
    const [keyEmail, setKeyEmail] = useState('')
    const [keyUrl , setKeyUrl] = useState('')
    const [keyApiAccessId, setKeyApiAccessId] = useState('')
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [urls, setUrls] = useState([])
    const [selectedWebshop, setSelectedWebshop] = useState([])
    const [selectedUrls, setSelectedUrls] = useState([])
    const [generatedKey, setGeneratedKey] = useState('')
    const [errorMessage, setErrorMessage] = useState('')
    const [permissions, setPermissions] = useState('All');
    const [models, setModels] = useState('None');
    const [platforms, setPlatforms] = useState([]);
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [selectedUrlId, setSelectedUrlId] = useState('');
    const [newWebshop, setNewWebshop] = useState('');

    const [credit, setCredit] = useState('None');
    const [suggestion, setSuggestion] = useState('None');
    const [generate, setGenerate] = useState('None');
    const [image, setImage] = useState('None');
    const [review, setReview] = useState('None');
    const [keywords, setKeywords] = useState('None');
    const [resetKey, setResetKey] = useState(0);
    const [isKeyNameValid, setIsKeyNameValid] = useState(true);
    const router = useRouter()

    const resetFields = async () =>{
        setKeyName('')
        setKeyUrl('')
        setKeyApiAccessId('')
        setSelectedWebshop([])
        setSelectedPlatform('')
        setPermissions('All')
        setCredit('None')
        setSuggestion('None')
        setGenerate('None')
        setImage('None')
        setReview('None')
        setKeywords('None')
        setNewWebshop('')
        setResetKey(Math.random())
        
        const webshopsElement = document.getElementById('webshops')
        // const platformsElement = document.getElementById('platforms')
        
        if (webshopsElement) {
            webshopsElement.value = ''
        }

        // if (platformsElement) {
        //     platformsElement.value = ''
        // }
        
    }
    const getWebshops = async () =>{
        
        // const platforms = Object.values(PlatformsEnum).filter(value => typeof value === 'string');
        // setPlatforms(platforms);

        const webshops = await apiService.get(`${AppSettings.API_URL}/webshop/GetWebshopURLs`)

        setUrls(webshops.data)
        
        
        if (keyData != null)
        {
            
            setKeyName(keyData.name)
            setKeyUrl(keyData.url)
            setKeyApiAccessId(keyData.apiAccessId)
            setSelectedWebshop([keyData.webshop])
            setSelectedPlatform(keyData.platform)
            setPermissions(keyData.permission)
            setCredit(keyData.credit)
            setSuggestion(keyData.suggestion)
            setGenerate(keyData.generate)
            setImage(keyData.image)
            setReview(keyData.review)
            setKeywords(keyData.keyword)
            setIsFormDirty(false)

        }
        
        
    }
    const generatedKeys = async (event) =>{
        event.preventDefault()
        const getKeys = async () => {

            const isKeyNameValid = keyName ? keyName.trim().length > 0 : true
            setIsKeyNameValid(isKeyNameValid)
            if (!isKeyNameValid)
                return
            
            let urlId;
            if (selectedUrlId == null || selectedUrlId == '')
            {
                const webshop = selectedWebshop.length > 0 ? selectedWebshop[0] : document.getElementById('webshops').value;
                const { data: { urlId: newUrlId } } = await apiService.post(`${AppSettings.API_URL}/Webshop/AddUrlApiToken`, {  Url: webshop, Platform:  'API', Region: region});
                urlId = newUrlId;
            } else {
                urlId = selectedUrlId;
            }
            
            try {
              await apiService.post(`${AppSettings.API_URL}/ApiToken/AddTokenPermissions`,
                 { 
                    ApiAccessId: keyApiAccessId,
                    Name: keyName,
                    UrlId: urlId,
                    Permission: permissions,
                    Credit: credit,
                    Suggestion: suggestion,
                    Generate: generate,
                    Image: image,
                    Review: review,
                    Keyword: keywords
                 }).then(res=>{
                    const webshopsElement = document.getElementById('webshops')
                    // const platformsElement = document.getElementById('platforms')
                    
                    if (webshopsElement) {
                        webshopsElement.value = ''
                    }
            
                    // if (platformsElement) {
                    //     platformsElement.value = ''
                    // }

                    const modalElement = document.getElementById('create-key')
                    modalElement.style.display = 'none'
                    const backdropElement = document.getElementsByClassName('modal-backdrop')
                    backdropElement[0].remove()
                    setKeyId(res.data.id)
                    resetFields()
                    setReload(true)
                    
                    setGeneratedKey(res.data.token)
                    const { Modal } = require("bootstrap");
                    const myModals = new Modal("#created-key");
                    myModals.show();
                 })
              
            } catch (err) {
              if (err.response.status === 400) {
                setErrorMessage("You are unable to create this user, please check if the email you provided is valid.");
              } else if (err.response.status === 401) {
                setErrorMessage("You are not allowed to do this action.");
              }
            }
          };
        const updateKeys = async () => {
           
            const url = `${AppSettings.API_URL}/ApiToken/${keyId}/UpdateTokenPermissions`
            await apiService.post(url, {
                Name: keyName,
                UrlId: keyUrl,
                Permission: permissions,
                Credit: credit,
                Suggestion: suggestion,
                Generate: generate,
                Image: image,
                Review: review,
                Keyword: keywords
            }).then(res => {
                const webshopsElement = document.getElementById('webshops')
                // const platformsElement = document.getElementById('platforms')
                
                if (webshopsElement) {
                    webshopsElement.value = ''
                }
        
                // if (platformsElement) {
                //     platformsElement.value = ''
                // }
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
            await updateKeys()
            onSave()
        }
        else
        {
            await getKeys()
            onSave()
        }
    }
    const handleAutofillWebshop = async (e) => {
        setNewWebshop(e)
        if (e == null || e == undefined || e == "")
        {
            
            setSelectedPlatform('')
        }

        if (urls.find(item => item.domain === e)) {
            const urlId = urls.find(item => item.domain === e).urlId
            setSelectedUrlId(urlId)
        }
        else
        {
            setSelectedUrlId('')
        }
    }
    // const handleAutofillPlatform = async (e) => {
    //   if (e != null && e != undefined && e != "")
    //   {
    //     const platform = platforms
    //   }
    // }
    const handleClickOutside = async (event) => {
        if (modalRef.current && !modalRef.current.contains(event.target)) {
            const webshopsElement = document.getElementById('webshops')
            // const platformsElement = document.getElementById('platforms')
            
            if (webshopsElement) {
                webshopsElement.value = ''
            }
    
            // if (platformsElement) {
            //     platformsElement.value = ''
            // }

            await resetFields()
            setErrorMessage('')
            setKeyId(null)
            setSelectedUrls([])
            setUrls([])
        }
    };
    
  const handlePermissionChange = (newPermission) => {
    setPermissions(newPermission);
  };

  const handleModelChange = (newModel) => {
    setModels(newModel);
  };
  const handleSelectedPlatform = (e) => {
    
      setSelectedPlatform(e)
  }
    useEffect(() => {
        const keyIdChange = async () =>{
            if (keyId != null)
                {
                    setKeyEmail('')
                    setFirstName('')
                    setLastName('')
                    setUrls([])
                    await getWebshops()
                }
        }
        keyIdChange()
    }, [keyId])
    useEffect(() => {
        if (selectedWebshop.length > 0)
        {
            const urlId = urls.find(r=>r.domain == selectedWebshop).urlId
            if (urlId !== null)
                setSelectedUrlId(urlId)
        }
    },[selectedWebshop])
    useEffect(() => {
    // Attach event listener when the component mounts
        document.addEventListener('mousedown', handleClickOutside);

        // Clean up the event listener when the component unmounts
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    const closeModal = async (event) => {
        event.preventDefault()
        
        const webshopsElement = document.getElementById('webshops')
        
        if (webshopsElement) {
            webshopsElement.value = ''
        }

        await resetFields()
        var modalElement = document.getElementById('create-key');
        modalElement.style.display = 'none';

        var backdropElement = document.getElementsByClassName('modal-backdrop');
        backdropElement[0].remove()

    }
  return (
    <div className="d-flex justify-content-center align-items-center" ref={modalRef}>
    <ModalPrompt target="key" hasChanges={isFormDirty}></ModalPrompt>
    <ModalGenerateKey target="created-key" modalref={modalRef} generatedKey={generatedKey}></ModalGenerateKey>
        <div className="modal fade" id={target} tabIndex="-1" aria-labelledby={target} aria-hidden="true">
        <div className="modal-dialog">
            <div className="modal-content">
            <div className="modal-header">
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <div className="mb-20">
                    <p className="modal-title">{keyId != '' ? 'Update' : 'Create secret key'}</p>
                    {errorMessage != '' &&
                    <div className="mb-20">
                        <p className='error-message'>{errorMessage}</p>
                    </div>}
                </div>
            </div>
            <form onSubmit={generatedKeys}>
            <div className="form-group d-flex">
                <div className="form-floating w-100">
                    <input id="key_email" className={`form-control ${isKeyNameValid ? 'is-valid' : 'is-invalid'}`} type="text" placeholder='Name' value={keyName} 
                        onChange={e => {
                            setKeyName(e.target.value)
                            setIsFormDirty(true)
                        }}
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                e.target.form.requestSubmit();
                            }
                        }}
                    />
                    <label htmlFor="key_email">Name (optional)</label>
                    {!isKeyNameValid &&
                    <div className="invalid-feedback">
                        White spaces are not allowed.
                    </div>}
                </div>
            </div>
            
            <div className="form-group d-flex bd-highlight">
                <div className="form-floating w-100 req">
                    <Typeahead
                        id="floating-label-example"
                        onFocus={e => setIsFormDirty(true)}
                        onInputChange={e => handleAutofillWebshop(e)}
                        onChange={setSelectedWebshop}
                        options={urls.map(function (s){ return s.domain})}
                        read
                        placeholder="Select webshop or type a new one"
                        renderInput={({ inputRef, referenceElementRef, ...inputProps }) => {
                            return (
                            <Hint>
                                <FloatingLabel  label="Select webshop or type a new one"  className='w-100'>
                                <Form.Control
                                    id="webshops"
                                    {...inputProps}
                                    required
                                    readOnly={keyId != '' ? true : false}
                                    ref={(node) => {
                                    inputRef(node);
                                    referenceElementRef(node);
                                    }}
                                    className="dropdown-toggle" 
                                />
                                </FloatingLabel>
                            </Hint>
                            );
                        }}
                        selected={selectedWebshop}
                        key={resetKey} 
                    />
                </div>
            </div>
            
                <div className="permissions-container mt-36 mb-14">
                    <p className='mb-0'>Permissions</p>
                    <div className="permission-options">
                        <button type='button'
                        className={permissions === 'All' ? 'active-element' : ''}
                        onClick={() => handlePermissionChange('All')}
                        >
                        All
                        </button>
                        <button type='button'
                        className={permissions === 'Restricted' ? 'active-element' : ''}
                        onClick={() => handlePermissionChange('Restricted')}
                        >
                        Restricted
                        </button>
                        <button type='button'
                        className={permissions === 'ReadOnly' ? 'active-element' : ''}
                        onClick={() => handlePermissionChange('ReadOnly')}
                        >
                        Read Only
                        </button>
                    </div>
                    {permissions == 'Restricted' &&
                    <div className='mt-36'>
                        <div className='mb-8'>
                            <span className='models'>Text</span>
                        </div>
                        <div className='mb-14'>
                            <div className='d-flex'>
                                <div className='d-flex flex-column'>
                                    <span className='models-endpoint m-auto'>/credit</span>
                                </div>
                                <div className="ms-auto models-container">
                                    <button type='button'
                                    className={credit === 'None' ? 'active-element' : ''}
                                    onClick={() => setCredit('None')}
                                    >
                                    None
                                    </button>
                                    <button type='button'
                                    className={credit === 'Read' ? 'active-element' : ''}
                                    onClick={() => setCredit('Read')}
                                    >
                                    Read
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='mb-14'>
                            <div className='d-flex'>
                                <div className='d-flex flex-column'>
                                    <span className='models-endpoint m-auto'>/suggestion</span>
                                </div>
                                <div className="ms-auto models-container">
                                    <button type='button'
                                    className={suggestion === 'None' ? 'active-element' : ''}
                                    onClick={() => setSuggestion('None')}
                                    >
                                    None
                                    </button>
                                    <button type='button'
                                    className={suggestion === 'Read' ? 'active-element' : ''}
                                    onClick={() => setSuggestion('Read')}
                                    >
                                    Read
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='mb-14'>
                            <div className='d-flex'>
                                <div className='d-flex flex-column'>
                                    <span className='models-endpoint m-auto'>/generate</span>
                                </div>
                                <div className="ms-auto models-container">
                                    <button type='button'
                                    className={generate === 'None' ? 'active-element' : ''}
                                    onClick={() => setGenerate('None')}
                                    >
                                    None
                                    </button>
                                    <button type='button'
                                    className={generate === 'Read' ? 'active-element' : ''}
                                    onClick={() => setGenerate('Read')}
                                    >
                                    Read
                                    </button>
                                    <button type='button'
                                    className={generate === 'Write' ? 'active-element' : ''}
                                    onClick={() => setGenerate('Write')}
                                    >
                                    Write
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='mb-14'>
                            <div className='d-flex'>
                                <div className='d-flex flex-column'>
                                    <span className='models-endpoint m-auto'>/image</span>
                                </div>
                                <div className="ms-auto models-container">
                                    <button type='button'
                                    className={image === 'None' ? 'active-element' : ''}
                                    onClick={() => setImage('None')}
                                    >
                                    None
                                    </button>
                                    <button type='button'
                                    className={image === 'Read' ? 'active-element' : ''}
                                    onClick={() => setImage('Read')}
                                    >
                                    Read
                                    </button>
                                    <button type='button'
                                    className={image === 'Write' ? 'active-element' : ''}
                                    onClick={() => setImage('Write')}
                                    >
                                    Write
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='mb-14'>
                            <div className='d-flex'>
                                <div className='d-flex flex-column'>
                                    <span className='models-endpoint m-auto'>/review</span>
                                </div>
                                <div className="ms-auto models-container">
                                    <button type='button'
                                    className={review === 'None' ? 'active-element' : ''}
                                    onClick={() => setReview('None')}
                                    >
                                    None
                                    </button>
                                    <button type='button'
                                    className={review === 'Read' ? 'active-element' : ''}
                                    onClick={() => setReview('Read')}
                                    >
                                    Read
                                    </button>
                                    <button type='button'
                                    className={review === 'Write' ? 'active-element' : ''}
                                    onClick={() => setReview('Write')}
                                    >
                                    Write
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className='mb-14'>
                            <div className='d-flex'>
                                <div className='d-flex flex-column'>
                                    <span className='models-endpoint m-auto'>/keywords</span>
                                </div>
                                <div className="ms-auto models-container">
                                    <button type='button'
                                    className={keywords === 'None' ? 'active-element' : ''}
                                    onClick={() => setKeywords('None')}
                                    >
                                    None
                                    </button>
                                    <button type='button'
                                    className={keywords === 'Read' ? 'active-element' : ''}
                                    onClick={() => setKeywords('Read')}
                                    >
                                    Read
                                    </button>
                                    <button type='button'
                                    className={keywords === 'Write' ? 'active-element' : ''}
                                    onClick={() => setKeywords('Write')}
                                    >
                                    Write
                                    </button>
                                </div>  
                            </div>
                        </div>                      
                    </div>
                    }
                    
                </div>
           
                <div className="right"> 
                        <button className="btn mr-8 font-14" onClick={closeModal}>Cancel</button>  
                        <button className="btn btn-primary btn-permissions font-14" type="submit" >{keyId != '' ? 'Update' : 'Create secret key'}</button>
                </div>
            </form>
            
            
            </div>
        </div>
        </div>
    </div>
  )
}
