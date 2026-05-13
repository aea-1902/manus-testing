import React, {useEffect, useState, useRef} from 'react'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router' 
import { Hint, Typeahead } from 'react-bootstrap-typeahead';
import { FloatingLabel, Form } from 'react-bootstrap';

import ModalPromptFailedUpdate from '../components/ModalPromptFailedUpdate'

import { AccountTypeEnum } from '../enum/AccountType'

import vatFormats from '../public/vatFormats/vat'
import zipCodes from '../public/zipCodes/zip'

import ApiService from '../services/ApiService'

export default function ModalUpdateAccount({userData, setdata, setAccountUpdated, modalref, buyCredits, selectedCreditPlanId}) {
  const SSR = typeof window === 'undefined'
  const inputRef = useRef(null);

  const [hasSubscription, setHasSubscription] = useState(false)


  const https = require("https");
  const agent = new https.Agent({ rejectUnauthorized: false,   });
  const AppSettings = require('../settings/AppSetting').default

  const router = useRouter();
  const currentRoute = router.pathname.toLowerCase();

  const [selectedCountry, setSelectedCountry] = useState([])
  const [countriesList, setCountriesList] = useState([])
  const [isFormDirty, setIsFormDirty] = useState(false)

  const [isBusiness, setIsBusiness] = useState(true)
  const [userCompanyName, setCompanyName] = useState("")
  const [isCompanyNameValid, setCompanyNameValid] = useState(true)
  const [isVatIdValid, setVatIdValid] = useState(true)
  const [companyVatId, setCompanyVatId] = useState('')
  const [countryInput, setCountryInput] = useState('')
  const [isCountryInputValid, setIsCountryInputValid] = useState(true)
  const [hasOngoing , setHasOngoing] = useState(false)
  const [updateAccountMessage, setUpdateAccountMessage] = useState('')
  const [postalRequired, setPostalRequired] = useState(false)
  const [postalCodeValid, setPostalCodeValid] = useState(true)
  const [userPostalCode, setPostalCode] = useState('')
  const [isStateInputValid, setIsStateInputValid] = useState(true)
  const [selectedState, setSelectedState] = useState([])
  const [stateRequired, setStateRequired] = useState(false)

  function handleAccountTypeChange(event) {
    setVatIdValid(true)
    setCompanyNameValid(true)
    setIsCountryInputValid(true)
    if (event.target.id === 'radioBusinessUpdateAccount') {
      setIsBusiness(true);
    } else if (event.target.id === 'radioIndividualUpdateAccount') {
      setIsBusiness(false);
    }
  };
  function handleCompanyNameChange (e) {
    const inputValue = e.target.value
    setCompanyName(inputValue)
    setCompanyNameValid(inputValue.trim().length > 0)
  };

  function handleZipCodeChange (e){
      const inputValue = e.target.value
      setPostalCode(inputValue)
      setPostalCodeValid(inputValue.trim().length > 0)
      setIsFormDirty(true)
  }
  function validateVatId(country, vatId) {
    if (vatId === null || vatId === undefined || vatId.trim().length == 0)
        return false

    return true
    // // Find the country's VAT format in the JSON
    // const vatInfo = vatFormats[country];
    // if (!vatInfo) {
    //     return true
    // }

    // // Check if there's a single regex or multiple
    // if (Array.isArray(vatInfo.regex)) {
    // // Loop through multiple regex options (if applicable) and test the VAT ID
    // for (const regex of vatInfo.regex) {
    //     if (new RegExp(regex).test(vatId)) {
    //     return true; // VAT ID is valid
    //     }
    // }
    // return false; // No matching format found
    // } else {
    // // Single regex pattern
    // const regex = new RegExp(vatInfo.regex);
    // return regex.test(vatId); // Validate VAT ID
    // }
  }
  function handleVatIdChange (e) {
      const inputValue = e.target.value;
      const country = selectedCountry[0]; // Replace with the appropriate country input from your form
    
      setCompanyVatId(inputValue);
    
      // Perform VAT validation
      const isValidVat = inputValue.trim().length == 0 ? false : true;

      setVatIdValid(isValidVat);
      setIsFormDirty(true);
  };

  function handleCountryChange(e){
    setSelectedCountry(e)
    setIsCountryInputValid(true)
    if (e.length > 0)
    {
        var countryName = e[0]
        
        checkPostalRequired(countryName)
        checkStateRequired(countryName)
    }
    else
    {
        setPostalRequired(false)
    }
  }
  
  function handleStateProvinceChange(e){
    const inputValue = e.target.value
    setSelectedState(inputValue)
    setIsStateInputValid(inputValue.trim().length == 0 ? false : true)
  }
  
  async function checkStateRequired(countryName)
  {
      var vatId = vatFormats[countryName]
      if (vatId)
          if (Array.isArray(vatId.vatFormat))
              setStateRequired(true)
          else
              setStateRequired(false)
      else
          setStateRequired(false)

    var postalCode = zipCodes.data.find(r=>r.name.toLowerCase() === countryName.toLowerCase())
    if (postalCode != undefined)
    {
        if (postalCode.required_address_information.length > 0)
        {
            if (postalCode.required_address_information[0] == 'Region') 
            {
                setStateRequired(true)
            }
        }
    }
  }

  async function checkPostalRequired(countryName)
  {
      var postalCode = zipCodes.data.find(r=>r.name.toLowerCase() === countryName.toLowerCase())
      if (postalCode != undefined)
      {
          if (postalCode.required_address_information.length > 0)
          {
              if(postalCode.required_address_information[0] == 'ZIP/postal code')
              {
                  setStateRequired(false)
                  setPostalRequired(true)
              }
              else if (postalCode.required_address_information[0] == 'Region') 
              {
                  setStateRequired(true)
                  setPostalRequired(false)
              }
              else
                  setPostalRequired(false)
          }
      }
      else
      {
          setPostalRequired(false)
      }
  }
  useEffect(() => {
    async function Init(){
      let countriesList = [];
          if (userData !== null){
            await axios.get(`${AppSettings.API_URL}/CountryModels/GetCountries`,{ httpsAgent: agent }).then(c => {
              setCountriesList(c.data)
              countriesList = c.data
            })
            if (userData.account.address != null)
            {
              if (userData.account.address.addressId != "00000000-0000-0000-0000-000000000000")
              {
                const country = countriesList.filter(c => c.text === userData.account.address.country.name).map(function (c) { return c.text})
                if (country.length > 0)
                {
                    setSelectedCountry(country)
                    checkPostalRequired(country[0])
                    checkStateRequired(country[0])
                }
                }
            }
            if (userData.account.company != null)
            {
              setCompanyName(userData.account.company.name)
              setCompanyVatId(userData.account.company.vatId)
            }
           
        }
    }
    Init()
  },[])// eslint-disable-line react-hooks/exhaustive-deps


    const handleAutoFillCountry = (e) => {
      
      setCountryInput(e)
      if (e != null && e != undefined && e != "")
      {
          const country = countriesList.filter(c => c.text === e).map(function (c) { return c.text})
          if (country.length > 0)
          {
              setSelectedCountry(country)
              setIsCountryInputValid(true)
              
              var countryName = country[0]
              
              checkStateRequired(countryName)
              var postalCode = zipCodes.data.find(r=>r.name.toLowerCase() === countryName.toLowerCase())
              if (postalCode != undefined)
              {
                  if (postalCode.required_address_information.length > 0)
                      setPostalRequired(true)
                  else
                      setPostalRequired(false)
              }
              else
              {
                  setPostalRequired(false)
              }
          }
      }else
      {
        setIsCountryInputValid(false)
        setPostalRequired(false)
      }
    }
    const getNewUserData = async () => {
        const newData = await ApiService.get(`${AppSettings.API_URL}/Account/All?GetAccount=true&GetCredit=true&GetCreditPlans=true&GetPaymentSettings=true&GetBillingInfo=true&GetInstallationPlan=true&Gateway=PayPal`);
        
        setdata(newData.data)
        

        
        const { Modal } = require("bootstrap")
        const modalElement = document.getElementById('updateaccount')
        const modalInstance = Modal.getOrCreateInstance(modalElement)
        const onModalHidden = () => {
            if (currentRoute == '/premium') {
                // Get the button type from session storage
                const buttonType = sessionStorage.getItem('paddleButtonType')
                
                setTimeout(() => {
                    if (buttonType === 'subscription') {
                        const subscriptionBtn = document.getElementById('buy-subscription')
                        if (subscriptionBtn) {
                            subscriptionBtn.click()
                        }
                    } else if (buttonType === 'credits') {
                        const purchaseBtn = document.getElementById('buy-credits')
                        if (purchaseBtn) {
                            purchaseBtn.click()
                        }
                    }
                    
                    // Clear the session storage after use
                    sessionStorage.removeItem('paddleButtonType')
                }, 1000) // Increased timeout to ensure page is ready
            }
    
            // Deregister the event listener after it runs
            modalElement.removeEventListener('hidden.bs.modal', onModalHidden);
        };
    
        // Register the event listener
        modalElement.addEventListener('hidden.bs.modal', onModalHidden);
    
        // Hide and dispose of the updateaccount modal
        modalInstance.hide();
    }
    const setCountry = (e) => {

      e.preventDefault();
      if (isFormDirty || userData.account.company.accountType === null)
      {
        setHasOngoing(true)
        const countryName = document.getElementById("country").value
        const stateElement = document.getElementById("stateModal")
        let stateName = '';
        if (stateElement)
        {
          stateName = document.getElementById("stateModal").value
        }
        
        
        const isCompanyNameValid = userCompanyName.trim().length > 0
        const isCountryValid = countryName.trim().length > 0 && countriesList.find(r => r.text.toLowerCase() == countryName.toLowerCase()) != undefined
        const isProvinceValid = stateName.trim().length > 0
        setIsCountryInputValid(isCountryValid)
        setCompanyNameValid(isCompanyNameValid)
        setIsStateInputValid(isProvinceValid)
        if (isBusiness)
        {
          if (postalRequired)
          {
            const isPostalCodeValid = userPostalCode.trim().length > 0
            
            setPostalCodeValid(isPostalCodeValid)
             setVatIdValid(validateVatId(countryName, companyVatId))
            if (!isCompanyNameValid || !isVatIdValid || !isCountryValid || !isPostalCodeValid)
            {
                setHasOngoing(false)
                return
            }
  
          }
  
          setVatIdValid(validateVatId(countryName, companyVatId))
          if (!isCompanyNameValid || !isVatIdValid || !isCountryValid)
            {
                setHasOngoing(false)
                return
            }
          
        }else
        {
          if (postalRequired)
          {
            const isPostalCodeValid = userPostalCode.trim().length > 0
            
            setPostalCodeValid(isPostalCodeValid)
            if (!isCountryValid || !isPostalCodeValid)
            {
                setHasOngoing(false)
                return
            }
          }
          if (!isCountryValid)
            {
                setHasOngoing(false)
                return
            }
        }
     
        const formData = new FormData()
        formData.append('CountryName', countryName)
        formData.append('FirstName',userData.account.firstName)
        formData.append('LastName', userData.account.lastName)
        formData.append('Company', userCompanyName)
        formData.append('CompanyVATId', companyVatId != undefined ? companyVatId : null)
        formData.append('AccountType', isBusiness ? AccountTypeEnum.Business : AccountTypeEnum.Individual)
        formData.append('StateName', stateName)
        formData.append('ZipCode',userPostalCode != undefined ? userPostalCode : null)
        //setAccountUpdated(true)
        //getNewUserData()

        axios({
          method: 'POST',
          url: `${AppSettings.API_URL}/Account/UpdateAccountDetails`,
          data: formData,
          headers: {"Content-Type": "application/json"}
        }).then(r => {
            if (currentRoute == '/installationservice' || currentRoute == '/downloads') {
                setTimeout(() => {
                    router.reload()
                },2000)
            }
            else
            {
                getNewUserData()
                setAccountUpdated(true)
            }
        })
        //catch error
        .catch(res => {

            setHasOngoing(false)
            const errorMessage = JSON.parse(res.request.response)
            setUpdateAccountMessage(errorMessage.error)
            
            const { Modal } = require("bootstrap")
            const modalElement = document.getElementById('updateaccount');
            const modalInstance = Modal.getOrCreateInstance(modalElement);

            if (modalInstance) {
                modalInstance.hide(); // Programmatically hide the modal on error
            }

            // Optionally show an error modal
            setTimeout(() => {
                const errorModalElement = document.getElementById('failmessage');
                const errorModalInstance = Modal.getOrCreateInstance(errorModalElement);
                if (errorModalInstance) {
                    errorModalInstance.show();
                }
            },500)

        })
       }
    }
    
    return (
      <>
      
      <ModalPromptFailedUpdate target="failmessage" errorMessage={updateAccountMessage}></ModalPromptFailedUpdate>
        <div className="d-flex justify-content-center align-items-center" ref={modalref}>
            <div
            className="modal fade"
            id="updateaccount"
            tabIndex="-1"
            aria-labelledby="updateaccount"
            aria-hidden="true"
            >
            <div className="modal-dialog paypal">
                <div className={`modal-content ${userData.account.address.country == null ? 'no-country' : ''}`}>
                <div className="modal-header">
                    <div className='close-btn-container'>
                        <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        >
                        </button>
                    </div>
                </div>
                <div className="modal-body credits">
                    {currentRoute !== "/welcome" ?
                    <div className={!hasSubscription ? `mb-20` : undefined}><p className="modal-title">{userData.account.company.accountType != null ? 'Buy credits' : 'Update account details'}</p></div>    
                    : userData.account.address.country == null ? <div className="mb-20"><p className="modal-title">Tell us your country</p></div> : <div className={!hasSubscription ? `mb-20` : undefined}><p className="modal-title">Buy credits {hasSubscription}</p></div>  }
                    {userData.account.address.country == null || userData.account.company.accountType == null ? 
                    <>
                    {!isBusiness 
                    ? <p className='font-14'>Before you can purchase, we need your country information to facilitate payment.</p>
                    : <p className='font-14'>Before you can purchase, we need your company information to facilitate payment. VAT may be applicable depending on your country&apos;s tax regulations. Please provide a valid VAT number to avoid additional charges.</p>
                    }
                    <div className='account-type d-flex'>
                        <div className="form-check custom-radio d-flex">
                            <input className="form-check-input" type="radio" name="accountTypeUpdateAccount" id="radioBusinessUpdateAccount" 
                            checked={isBusiness}
                            onChange={handleAccountTypeChange}/>
                            <label className="form-check-label" htmlFor="radioBusinessUpdateAccount">
                                Business
                            </label>
                        </div>
                        <div className="form-check custom-radio d-flex">
                            <input className="form-check-input" type="radio" name="accountTypeUpdateAccount" id="radioIndividualUpdateAccount" 
                            checked={!isBusiness}
                            onChange={handleAccountTypeChange}/>
                            <label className="form-check-label" htmlFor="radioIndividualUpdateAccount">
                                Individual
                            </label>
                        </div>
                    </div>
                    {isBusiness ?
                        <>
                        <div className="form-group d-flex bd-highlight">
                            <div className="form-floating w-100 req">
                                <Typeahead
                                    id="floating-label-example"
                                    onFocus={e => setIsFormDirty(true)}
                                    onInputChange={e => handleAutoFillCountry(e)}
                                    onChange={handleCountryChange}
                                    options={countriesList.map(function (s){ return s.text})}
                                    placeholder="Country"
                                    renderInput={({ inputRef, referenceElementRef, ...inputProps }) => {
                                        return (
                                        <Hint>
                                            <FloatingLabel  label="Country">
                                            <Form.Control
                                                id="country"
                                                {...inputProps}
                                                required
                                                isInvalid={!isCountryInputValid}
                                                ref={(node) => {
                                                inputRef(node);
                                                referenceElementRef(node);
                                                }}
                                                className="dropdown-toggle" 
                                            />
                                            <Form.Control.Feedback type="invalid">                                       
                                            {countryInput.length == 0 ? 'Country is required.' : 'Country is invalid.'}
                                            </Form.Control.Feedback>
                                            </FloatingLabel>
                                            
                                        </Hint>
                                        );
                                    }}
                                    selected={selectedCountry}
                                />
                            </div>
                        </div>
                        
                        {stateRequired && 
                        <div className="form-group d-flex bd-highlight">
                            <div className="form-floating w-100">
                                <input id="stateModal" 
                                className={`form-control is-valid`}  
                                type="text" 
                                placeholder='State / Province (optional)' 
                                required 
                                value={selectedState === null ? '' : selectedState} 
                                onChange={handleStateProvinceChange}/>
                                <label htmlFor="stateProvince">State / Province (optional)</label>
                            </div> 
                        </div>}
                        <div className="form-group d-flex bd-highlight">
                            <div className="form-floating w-100 req">
                                <input
                                    id="companyName"
                                    className={`form-control ${isCompanyNameValid ? 'is-valid' : 'is-invalid'}`}
                                    type="text"
                                    placeholder="Company name"
                                    value={userCompanyName}
                                    onChange={handleCompanyNameChange}
                                    required
                                />
                                <label htmlFor="companyName">Company name</label>
                                <div className="invalid-feedback">
                                    Company name is required.
                                </div>
                            </div>
                        </div>
                        <div className="form-group d-flex bd-highlight mb-0">
                            <div className="form-floating w-100 req">
                                <input
                                    id="companyVatId"
                                    className={`form-control ${isVatIdValid ? 'is-valid' : 'is-invalid'}`}
                                    type="text"
                                    placeholder="Company VAT ID"
                                    value={companyVatId}
                                    onChange={handleVatIdChange}
                                    required
                                />
                                <label htmlFor="companyVatId">Company VAT ID</label>
                                <div className="invalid-feedback">
                                    {(companyVatId === '' || companyVatId === null || companyVatId === undefined) ?  'VAT ID is required.' : 'VAT ID format is invalid.'}
                                </div>
                                <div className='d-flex mtop-5'>
                                    <Link className='font-13 fw-500 ms-auto link-primary' href={'https://www.paddle.com/help/sell/tax/what-format-should-i-use-for-my-vat-id'} target="_blank">What format should I use?</Link>
                                </div>
                            </div>
                        </div>

                        {postalRequired &&
                        <div className='form-group d-flex bd-highlight'>
                                <div className="form-floating w-100 req">
                                    <input 
                                        id="zipCode" 
                                        className={`form-control ${postalCodeValid ? 'is-valid' : 'is-invalid'}`} 
                                        type="text" 
                                        required 
                                        placeholder='Zip code' 
                                        value={userPostalCode} 
                                        onChange={handleZipCodeChange}/>
                                    <label htmlFor="zipCode">Zip code</label>
                                    <div className="invalid-feedback">
                                        Zip code is required.
                                    </div>
                                </div>
                        </div>
                        }
                        </>
                    :
                    <>
                        <div className="form-group d-flex bd-highlight">
                        <div className="form-floating w-100 req">
                        <Typeahead
                                    id="floating-label-example"
                                    onFocus={e => setIsFormDirty(true)}
                                    onInputChange={e => handleAutoFillCountry(e)}
                                    onChange={handleCountryChange}
                                    options={countriesList.map(function (s){ return s.text})}
                                    placeholder="Country"
                                    renderInput={({ inputRef, referenceElementRef, ...inputProps }) => {
                                        return (
                                        <Hint>
                                            <FloatingLabel  label="Country">
                                            <Form.Control
                                                id="country"
                                                {...inputProps}
                                                required
                                                isInvalid={!isCountryInputValid}
                                                ref={(node) => {
                                                inputRef(node);
                                                referenceElementRef(node);
                                                }}
                                                className="dropdown-toggle" 
                                            />
                                            <Form.Control.Feedback type="invalid">
                                            {countryInput.length == 0 ? 'Country is required.' : 'Country is invalid.'}
                                            </Form.Control.Feedback>
                                            </FloatingLabel>
                                            
                                        </Hint>
                                        );
                                    }}
                                    selected={selectedCountry}
                                />
                            </div>
                        </div>
                        
                        {stateRequired && 
                        <div className="form-group d-flex bd-highlight">
                            <div className="form-floating w-100">
                                <input id="stateModal" 
                                className={`form-control is-valid`}  
                                type="text" 
                                placeholder='State / Province (optional)' 
                                required 
                                value={selectedState === null ? '' : selectedState} 
                                onChange={handleStateProvinceChange}/>
                                <label htmlFor="stateProvince">State / Province (optional)</label>
                            </div> 
                        </div>}
                        {postalRequired &&
                        <div className='form-group d-flex bd-highlight'>
                                <div className="form-floating w-100 req">
                                    <input 
                                        id="zipCode" 
                                        className={`form-control ${postalCodeValid ? 'is-valid' : 'is-invalid'}`} 
                                        type="text" 
                                        required 
                                        placeholder='Zip code' 
                                        value={userPostalCode} 
                                        onChange={handleZipCodeChange}/>
                                    <label htmlFor="zipCode">Zip code</label>
                                    <div className="invalid-feedback">
                                        Zip code is required.
                                    </div>
                                </div>
                        </div>
                        }
                        </>
                    }
                    
                    {(userData.account.company.accountType === null) && 
                    <div  className='mb-15 right'>
                            <input id='saveAccount' type="button" className={`btn btn-primary submit-button`} value="Save" onClick={setCountry}/>
                        </div>}
                        
                    {(userData.account.company.accountType !== null) && 
                    <div  className='mb-15 right'>
                            <input id='saveAccount' type="button" className={`btn btn-primary submit-button ${(!isFormDirty) && `disabled`}`} value="Save" onClick={setCountry} disabled={hasOngoing}/>
                        </div>}
                    </>
                    : null
                    }
                    
                </div>
                </div>
            </div>
            </div>
        </div>
      </>
    );
  }
  