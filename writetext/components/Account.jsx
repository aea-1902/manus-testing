import React, { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import axios from 'axios'
import { setAuthHeader } from '../utils/axiosHeader'

import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import ModalPrompt from '../components/ModalPrompt'
import ModalPromptFailedUpdate from '../components/ModalPromptFailedUpdate'

import { FloatingLabel, Form } from 'react-bootstrap';
import { Hint, Typeahead } from 'react-bootstrap-typeahead';
import Image from 'next/image'

import { AccountTypeEnum } from '../enum/AccountType'
import vatFormats from '../public/vatFormats/vat'
import zipCodes from '../public/zipCodes/zip'
import ApiService from '../services/ApiService'
export default function Account({userData, translation, onRender, apiResponse}){
    const SSR = typeof window === 'undefined'

    const [isBillingInfoRequired, setBillingInfoRequired] = useState(true)
    const [hasNoAddress, setHasNoAddress] = useState(false)

    const [user, setLoggedUser] = useState(null)

    const [countriesList, setCountriesList] = useState([])
    const [statesList, setStatesList] = useState([])
    const [citiesList, setCitiesList] = useState([])

    const [userCompanyUrl, setCompanyUrl] = useState('')
    const [userCompanyName, setCompanyName] = useState('')
    const [userFirstName, setFirstName] = useState('')
    const [userLastName, setLastName] = useState('')
    const [userFirstAddress, setFirstAddress] = useState('')
    const [userSecondAddress, setSecondAddress] = useState('')
    
    const [userCountry, setCountry] = useState(0)
    const [userStateProvince, setStateProvince] = useState(0)
    const [userCity, setCity] = useState(0)

    const [userPostalCode, setPostalCode] = useState('')
    const [userPhoneNumber, setPhoneNumber] = useState('')
    const [userMobileNumber, setMobileNumber] = useState('')

    const [selectedCountry, setSelectedCountry] = useState([])
    const [selectedState, setSelectedState] = useState([])
    const [selectedCity, setSelectedCity] = useState([])

    const https = require("https");
    const httpsAgent = new https.Agent({ rejectUnauthorized: false })
    const [loggedUser, setUser] = useState(null)
    const [credits, setCredits] = useState(null)

    const [isLoading, setIsLoading] = useState(true)

    const [stateRequired, setStateRequired] = useState(false)

    const [cityName, setCityName] = useState('')
    const [stateName, setStateName] = useState('')
    const [countryName, setCountryName] = useState('')
    const [phoneCode, setPhoneCode] = useState('00')
    const [companyVatId, setCompanyVatId] = useState('')
    const [updateAccountMessage, setUpdateAccountMessage] = useState('')
    const [isExternalLogin, setIsExternalLogin] = useState(false)
    const [isFormDirty, setIsFormDirty] = useState(false)

    const [isBusiness, setIsBusiness] = useState(true)
    const [isUrlValid, setIsUrlValid] = useState(true)
    const [isCompanyNameValid, setCompanyNameValid] = useState(true)
    const [isVatIdValid, setVatIdValid] = useState(true)
    const [postalRequired, setPostalRequired] = useState(false)
    const [postalCodeValid, setPostalCodeValid] = useState(true)
    const [isCountryInputValid, setIsCountryInputValid] = useState(true)
    const [isStateInputValid, setIsStateInputValid] = useState(true)
    const [countryInput, setCountryInput] = useState('')
    const [isFirstNameInputValid, setIsFirstNameInputValid] = useState(true)
    const [isLastNameInputValid, setIsLastNameInputValid] = useState(true)
    const [isProduction, setIsProduction] = useState(false)
    const [isAddress1Valid, setIsAddress1Valid] = useState(true)
    const [isAddress2Valid, setIsAddress2Valid] = useState(true)
    const AppSettings = require('../settings/AppSetting').default
    const [isFullNameInputValid, setIsFullNameInputValid] = useState(true)
    const [fullName, setFullName] = useState('')


    const router = useRouter()

    const currentRoute = router.route.toLowerCase();

    useEffect(() => {
      setTimeout(() => {
        onRender()
      }, 100); 
    }, [])// eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (countriesList != null)
        {
            const countryName = document.querySelector('#formAccount #country').value
            if (countriesList.find(r=>r.text === countryName) != undefined)
            {
                // const vatId = document.getElementById('companyVatId').value
                // if (vatId.trim().length > 0)
                //     setVatIdValid(validateVatId(countryName,vatId))
                // else
                //     setVatIdValid(false)

                const countryPhoneCode = countriesList.find(r=>r.text === countryName).phoneCode
                setPhoneCode(countryPhoneCode)
                checkPostalRequired(countryName)
                //if (!postalRequired && countryName != "Canada")
                    checkStateRequired(countryName)
                

                
            }
        }
    },[selectedCountry])
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
            else
            {
                setPostalRequired(false)
            }
        }
        else
        {
            setPostalRequired(false)
        }
    }
    async function checkStateRequired(countryName)
    {
        // var vatId = vatFormats[countryName]
        // if (vatId)
        //     if (Array.isArray(vatId.vatFormat))
        //         setStateRequired(true)
        //     else
        //         setStateRequired(false)
        // else
        //     setStateRequired(false)

            
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
    
    async function Initialize(u){
        if (userData != null)
        {
            if (!AppSettings.API_URL.includes("writetextai-api-staging") && !AppSettings.API_URL.includes("writetextai-api-dev"))
            {
                setIsProduction(true)
            }
            
            if (userData.account.address != null)
            {
                if (userData.account.address.addressId == "00000000-0000-0000-0000-000000000000")
                {
                    setHasNoAddress(true);
                }
            }
            else
            {
                    setHasNoAddress(true);
            }
            setLoggedUser(userData.account)
            if (userData.account.userId != '00000000-0000-0000-0000-000000000000')
            {
                setFullName(userData.account.firstName + ' ' + userData.account.lastName)
                setFirstName(userData.account.firstName)
                setLastName(userData.account.lastName)

                if (userData.account.address.addressId !== "00000000-0000-0000-0000-000000000000")
                {
                    setPhoneNumber(userData.account.landLine == null ? '' : userData.account.landLine)
                    setMobileNumber(userData.account.mobile == null ? '' : userData.account.mobile)
                    setCompanyUrl(userData.account.company.companyUrl)
                    setCompanyName(userData.account.company.name)
                    setFirstAddress(userData.account.address.line1)
                    setSecondAddress(userData.account.address.line2)
                    setPostalCode(userData.account.address.postalCode)
                    setPhoneCode(userData.account.address.country.phoneCode == null ? '00' : userData.account.address.country.phoneCode)
                    setCountry(userData.account.address.country.id)
                    if (userData.account.company.accountType)
                        setIsBusiness(userData.account.company.accountType == AccountTypeEnum.Business)

                    setCompanyVatId(userData.account.company.vatID == 'null' ? '' : userData.account.company.vatID)
                    if (userData.account.address.city.id != 0)
                    {
                        setSelectedCity(userData.account.address.city.name)
                        if (userData.account.address.city.state != null)
                            setSelectedState(userData.account.address.city.state.name)
                    }
                    if (userData.account.address.city.state != null)
                    {
                        setSelectedState(userData.account.address.city.state.name)
                    }

                
                    axios.get(`${AppSettings.API_URL}/CountryModels/GetCountries`,{ httpsAgent }).then(c => {
                        setCountriesList(c.data)
                        let country = c.data.filter(c => c.text === userData.account.address.country.name).map(function (c) { return c.text})
                        setSelectedCountry(country)
                        
                        checkPostalRequired(country[0])
                        checkStateRequired(country[0])
                        setIsLoading(false)
                        
                    })
                }
                else
                {
                    
                        
                    axios.get(`${AppSettings.API_URL}/CountryModels/GetCountries`,{ httpsAgent }).then(c => {
                        setCountriesList(c.data)
                        setIsLoading(false)
                    })
                }
                


            }
            else
            {
                        
            axios.get(`${AppSettings.API_URL}/CountryModels/GetCountries`,{ httpsAgent }).then(c => {
                setCountriesList(c.data)
                setIsLoading(false)
            })
            }
        }
            
       // })
    }
    async function getAccountAll(){
        if (userData.account.address.addressId == "00000000-0000-0000-0000-000000000000")
        {
            const response = await ApiService.get(`${AppSettings.API_URL}/Account/All?GetAccount=true&GetCredit=true&GetCreditPlans=true&GetPaymentSettings=true&GetBillingInfo=true&GetInstallationPlan=true&Gateway=Paddle`)
            if (response.data.account.address.addressId != "00000000-0000-0000-0000-000000000000")
            {
                //reload page
                window.location.reload()
            }
        }
    }
    useEffect(() => {

      async function getUser() {
        const AuthenticationService = require('../services/AuthenticationService').default
        await AuthenticationService.getUser().then(u => {
          if (u == null)
          {
          }
          else
          {
            setAuthHeader(u.access_token)
            if (u.profile.auth_scheme !== undefined)
            {
                setIsExternalLogin(true)
            }
            //setUser(u)
            Initialize() 
            getAccountAll()
        }  
        })
      }
      
      getUser()
    },[])// eslint-disable-line react-hooks/exhaustive-deps

    function handleAutoFillCountry(e){
      
        setCountryInput(e)
        if (e != null && e != undefined && e != "")
        {
            const country = countriesList.filter(c => c.text === e).map(function (c) { return c.text})
            if (country.length > 0)
            {
                setSelectedCountry(country)
                setIsCountryInputValid(true)
            }
        }else
        {
          setIsCountryInputValid(false)
        }
    }
    function formatInput(event)
    {
        if (event.target.id == 'firstName')
            setFirstName(event.target.value.trim())
        if (event.target.id == 'lastName')
            setLastName(event.target.value.trim())
    }

    //create a function that will avoid the input of common special characters using this pattern /^[a-zA-Z\s\-',.\p{L}]$/u
    function handleKeyDown(event){
        const pattern = /^[a-zA-Z\s\-',.\p{L}]$/u
        if (event.key != "Backspace" && event.key != "Delete" && event.key != "Tab" && event.key != "ArrowLeft" && event.key != "ArrowRight" && event.key != "ArrowUp" && event.key != "ArrowDown")
        {
            if (!pattern.test(event.key))
            {
                event.preventDefault()
            }
        }
    }
    function selectedCountryValid(value)
    {
        if (countriesList.filter(r=>r.text === value).length > 0)
        {
            return true
        }
        else
        {
            return false
        }
    }
    function validateVatId(country, vatId) {
        if (vatId === null || vatId === undefined || vatId.trim().length == 0)
            return false

        return true
        // Find the country's VAT format in the JSON
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
        // const country = selectedCountry[0]; // Replace with the appropriate country input from your form
      
        setCompanyVatId(inputValue);
      
        // Perform VAT validation
        const isValidVat = inputValue.trim().length == 0 ? false : validateVatId(country, inputValue);
        //const isValidVat = inputValue.trim().length == 0 ? false : true;
        setVatIdValid(isValidVat);
        setIsFormDirty(true);
    }
    
    function handleStateProvinceChange(e){
        const inputValue = e.target.value
        setSelectedState(inputValue)
        setIsStateInputValid(inputValue.trim().length == 0 ? false : true)
        setIsFormDirty(true)
    }
    function validateURL(input) {
        const urlPattern = new RegExp(
          '^(https?:\\/\\/)?' + // Protocol (http or https)
          '((([a-zA-Z\\d]([a-zA-Z\\d-]*[a-zA-Z\\d])*)\\.)+[a-zA-Z]{2,}|' + // Domain name
          '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR IP address
          '(\\:\\d+)?(\\/[-a-zA-Z\\d%_.~+]*)*' + // Port and path
          '(\\?[;&a-zA-Z\\d%_.~+=-]*)?' + // Query string
          '(\\#[-a-zA-Z\\d_]*)?$', 'i' // Fragment locator
        );
        return !!urlPattern.test(input);
      };
      
    function handleCompanyUrlChange(e) {
        const inputValue = e.target.value
        if (inputValue.trim().length == 0)
        {
           setIsUrlValid(true)
        }
        else
        {
            setIsUrlValid(validateURL(inputValue))
        }
        setCompanyUrl(inputValue)
        setIsFormDirty(true)
    };
    function handleAccountTypeChange(event) {
        setIsFormDirty(true)
        if (event.target.id === 'radioBusiness') {
          setIsBusiness(true);
        } else if (event.target.id === 'radioIndividual') {
          setIsBusiness(false);
        }
      };

    function handleCompanyNameChange (e) {
        const inputValue = e.target.value
        setCompanyName(inputValue)
        setCompanyNameValid(inputValue.trim().length > 0)
        setIsFormDirty(true)
    };

    function handleZipCodeChange (e){
        const inputValue = e.target.value
        setPostalCode(inputValue)
        setPostalCodeValid(inputValue.trim().length > 0)
        setIsFormDirty(true)
    }
    // Function to validate VAT ID
    function handleCountryChange(e){
        setSelectedCountry(e)
        setIsCountryInputValid(true)
      }
    function handleFirstnameChange(e){
        const inputValue = e.target.value
        setFirstName(inputValue)
        setIsFirstNameInputValid(inputValue.trim().length > 0)
        setIsFormDirty(true)
    }
    function handleLastnameChange(e)
    {
        const inputValue = e.target.value
        setLastName(inputValue)
        setIsLastNameInputValid(inputValue.trim().length > 0)
        setIsFormDirty(true)
    }
    function handleFullNameChange(e){
        const inputValue = e.target.value
        setFullName(inputValue)
        setIsFullNameInputValid(inputValue.trim().length > 0)
        setIsFormDirty(true)
    }
    async function handleSubmit(event){
        event.preventDefault();
        if (isFormDirty)
        {
            const countryName = document.querySelector('#formAccount #country').value
            const cityName = document.getElementById("city").value
            const stateName = document.getElementById("state").value
            let fullName = document.getElementById("fullName").value
            // This code splits the full name into first and last name
            // It assumes the first word is the first name and everything after is the last name
            let splitName = fullName.split(' ')
            let firstName = splitName[0] // Takes first word as first name
            let lastName = splitName.length > 1 ? splitName.slice(1).join(' ') : '' // Joins remaining words as last name
            const isCompanyNameValid = userCompanyName.trim().length > 0
            const isUrlValid = document.getElementById('companyWebsite').value !== '' ? validateURL(document.getElementById('companyWebsite').value) :  true
            const isPostalCodeValid = userPostalCode.trim().length > 0
            const isCountryValid = countryName.trim().length > 0
            const isProvinceValid = stateName.trim().length > 0
            const isFirstNameValid = firstName.trim().length > 0
            const isLastNameValid = lastName.trim().length > 0

            setIsCountryInputValid(isCountryValid)
            setIsStateInputValid(isProvinceValid)
            // Set validation states
            setCompanyNameValid(isCompanyNameValid)
            setIsUrlValid(isUrlValid)
            setIsFirstNameInputValid(isFirstNameValid)
            // setIsLastNameInputValid(isLastNameValid)
            if (!isFirstNameInputValid)
                return

            if (isBusiness)
            {
                const vatValid = validateVatId(countryName, companyVatId)
                setVatIdValid(vatValid)
                if (!isCompanyNameValid || !vatValid || !isUrlValid || !isCountryValid) 
                    return
            }
            else
            {
                const isAddress1Valid = userFirstAddress ? userFirstAddress.trim().length > 0 : true
                const isAddress2Valid = userSecondAddress ? userSecondAddress.trim().length > 0 : true
                setIsAddress1Valid(isAddress1Valid)
                setIsAddress2Valid(isAddress2Valid)
                if (!isAddress1Valid || !isAddress2Valid)
                    return
                if (!isCountryValid)
                  return
                }
            
            if (postalRequired)
            {
                setPostalCodeValid(isPostalCodeValid)
                if (!isPostalCodeValid)
                    return
            }

            if (stateRequired)
            {
                if (!isProvinceValid)
                    return
            }

            if (!selectedCountryValid(countryName))
            {
                setUpdateAccountMessage('Invalid selected country')

                const { Modal } = require("bootstrap")
                const myModals = new Modal("#failmessage")
                myModals.show()
                return
            }
            firstName = firstName.replace(/[^a-zA-Z0-9]/g, '')
            lastName = lastName.replace(/[^a-zA-Z0-9 ]/g, '')

            const formData = new FormData()
            formData.append('Company', userCompanyName)
            formData.append('CompanyUrl',userCompanyUrl == null ? '' : userCompanyUrl)
            formData.append('FirstName',firstName)
            formData.append('LastName',lastName)
            formData.append('Address1',userFirstAddress)
            formData.append('Address2',userSecondAddress == null ? '' : userSecondAddress)
            formData.append('City',userCity)
            if (stateName.length > 0)
            {
                formData.append('State',userStateProvince)
            }
            formData.append('ZipCode',userPostalCode)
            formData.append('Country',userCountry)
            formData.append('MobileNumber',userMobileNumber)
            formData.append('PhoneNumber',userPhoneNumber)
            formData.append('CityName', cityName)
            formData.append('StateName', stateName)
            formData.append('CountryName', countryName)
            formData.append('AccountType', isBusiness ? AccountTypeEnum.Business : AccountTypeEnum.Individual)
            formData.append('CompanyVATId', companyVatId)
            axios({
                method: 'POST',
                url: `${AppSettings.API_URL}/Account/UpdateAccountDetails`,
                data: formData,
                headers: {"Content-Type": "application/json"}
            })
            .then(res=>{
                if (currentRoute !== '/wizard')
                {
                    const { Modal } = require("bootstrap")
                    const myModals = new Modal("#message");
                    myModals.show()
                    // if (res.data.requireBilling == true)
                    // {
                    //     router.push('/billing')
                    // }
                }
                else
                {
                    apiResponse(true)
                    router.reload()
                }
            
            })
            //catch error
            .catch(res => {
                const errorMessage = JSON.parse(res.request.response)
                setUpdateAccountMessage(errorMessage.error)
                setTimeout(() => {
                    const { Modal } = require("bootstrap")
                    const myModals = new Modal("#failmessage")
                    myModals.show()
                },800)

                if (currentRoute === '/wizard')
                    apiResponse(false)
            })
        } else
        {
            if (currentRoute == "/wizard")
            {
                router.reload()}
        }
        
    }
if (translation && userData)
  return (
    
        <>
        <ModalPrompt target="message" hasChanges={isFormDirty}></ModalPrompt>
        <ModalPromptFailedUpdate target="failmessage" errorMessage={updateAccountMessage}></ModalPromptFailedUpdate>
        
        <div className='container'>
            <div className="header d-flex ">
                <p>{translation["PageHeaderText"]}</p>
                
                <div className={`right ml-auto mb-30 ${(currentRoute === '/wizard') ? `hide` : ``}`}>
                    <input id='saveAccount' type="submit" className={`btn btn-primary submit-button ${!isFormDirty && `disabled`}`} value="Save changes" onClick={handleSubmit}/>
                </div>
            </div>
            <div>
                {/* <p className='font-16 mb-14 sub-p'>{translation["FormHeaderText"]}</p> */}
                <form id='formAccount' noValidate>
                    <div className='account-type d-flex'>
                        <div className="form-check d-flex" style={{paddingLeft: '27px'}}>
                            <input className="form-check-input" type="radio" name="accountType" id="radioBusiness" onChange={handleAccountTypeChange} checked={isBusiness} style={{width: '19px', height: '18px'}}/>
                            <label className="form-check-label" htmlFor="radioBusiness">Business</label>
                        </div>
                        <div className="form-check  d-flex">
                            <input className="form-check-input" type="radio" name="accountType" id="radioIndividual" onChange={handleAccountTypeChange} checked={!isBusiness} style={{width: '19px', height: '18px'}}/>
                            <label className="form-check-label" htmlFor="radioIndividual">Individual</label>
                        </div>

                    </div>

                    <div className={`form-group d-flex bd-highlight ${!isBusiness ? 'd-none' : ''}`}>
                        
                    {isBusiness ?
                        <div className="form-floating mr-14 w-100 req">
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
                    : 
                        <div className="form-floating mr-14 w-100">
                            <input id="companyName" className="form-control hidden" type="text" placeholder='Company name (optional)' value={userCompanyName === null ? '' : userCompanyName} onChange={e => {setCompanyName(e.target.value); setIsFormDirty(true)}}/>
                            <label htmlFor="companyName">Company name (optional)</label>
                        </div>
                    }
                        <div className="form-floating w-100">
                        <input
                            id="companyWebsite"
                            className={`form-control ${isUrlValid ? 'is-valid' : 'is-invalid'}`}
                            type="text"
                            placeholder="Company website (optional)"
                            value={userCompanyUrl == null ? '' : userCompanyUrl}
                            onChange={handleCompanyUrlChange}
                            pattern="https?://.+"
                        />
                        <label htmlFor="companyWebsite">Company website (optional)</label>
                        <div className="invalid-feedback">
                            Please enter a valid URL.
                        </div>
                        </div>
                    </div>
                    
                    {isBusiness &&
                    
                        <div className="form-group d-flex bd-highlight">
                            <div className="form-floating mr-14  w-100 req">
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
                                                Country is required.
                                            </Form.Control.Feedback>
                                            </FloatingLabel>
                                            
                                        </Hint>
                                        );
                                    }}
                                    selected={selectedCountry}
                                />
                            </div>
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
                                    <Link className='font-13 fw-500 ms-auto' href={'https://www.paddle.com/help/sell/tax/what-format-should-i-use-for-my-vat-id'} target="_blank" style={{color: '#0066CC'}}>What format should I use?</Link>
                                </div>
                            </div>
                            
                        </div>
                    }
                    <div className="form-group d-flex bd-highlight">
                        {/* <div className="form-floating mr-14 w-100 req">
                            <input 
                            id="firstName" 
                            className={`form-control ${isFirstNameInputValid ? 'is-valid' : 'is-invalid'}`}
                            type="text" 
                            placeholder='First name' 
                            required 
                            value={userFirstName === null ? '' : userFirstName} 
                            onChange={handleFirstnameChange} 
                            onBlur={e => formatInput(e)} 
                            onKeyDown={e => handleKeyDown(e)} 
                            />
                            <label htmlFor="firstName">First name</label>
                            <div className="invalid-feedback">
                            First name is required.
                            </div>
                        </div>
                        <div className="form-floating w-100 req">
                            <input 
                            id="lastName" 
                            className={`form-control ${isLastNameInputValid ? 'is-valid' : 'is-invalid'}`}
                            type="text" 
                            placeholder="Last name" 
                            required 
                            value={userLastName === null ? '' : userLastName} 
                            onChange={handleLastnameChange} 
                            onBlur={e => formatInput(e)}  
                            onKeyDown={e => handleKeyDown(e)}
                            />
                            <label htmlFor="lastName">Last name</label>
                            <div className="invalid-feedback">
                            Last name is required.
                            </div>
                        </div> */}
                        <div className="form-floating w-100 req">
                            <input
                                id="fullName"
                                className={`form-control ${isFullNameInputValid ? 'is-valid' : 'is-invalid'}`}
                                type="text"
                                placeholder="Name"
                                value={fullName}
                                onChange={handleFullNameChange}
                                onKeyDown={e => handleKeyDown(e)}
                                required
                            />
                            <label htmlFor="fullName">Name</label>
                            <div className="invalid-feedback">
                                Name is required.
                            </div>
                        </div>
                        
                    </div>
                    <div className="form-group d-flex bd-highlight">
                        <div className="form-floating w-100">
                            <input id="streetAddress" className={`form-control ${isAddress1Valid ? 'is-valid' : 'is-invalid'}`} type="text" placeholder='Street address' value={userFirstAddress === null ? '' : userFirstAddress} onChange={e => {setFirstAddress(e.target.value); setIsFormDirty(true)}}/>
                            <label htmlFor="streetAddress">Street address 1 (optional)</label>
                            <div className="invalid-feedback">
                                White spaces are not allowed.
                            </div>
                        </div>
                    </div>
                    <div className="form-group d-flex bd-highlight">
                        <div className="form-floating w-100">
                            <input id="streetAddress_two" className={`form-control ${isAddress2Valid ? 'is-valid' : 'is-invalid'}`} type="text" placeholder='Street address' value={userSecondAddress === null ? '' : userSecondAddress} onChange={e => {setSecondAddress(e.target.value); setIsFormDirty(true)}}/>
                            <label htmlFor="streetAddress_two">Street address 2 (optional)</label>
                            <div className="invalid-feedback">
                                White spaces are not allowed.
                            </div>
                        </div>
                    </div>
                    <div className="form-group d-flex bd-highlight">
                        {!isBusiness &&
                            <div className="form-floating mr-14  w-100 req">
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
                                            Country is required.
                                          </Form.Control.Feedback>
                                        </FloatingLabel>
                                        
                                    </Hint>
                                    );
                                }}
                                selected={selectedCountry}
                            />
                            </div>
                        }
                        {!stateRequired 
                        ? 
                        <div className="form-floating w-100">
                            <input id="state" className="form-control" type="text" placeholder='State / Province' value={selectedState === null ? '' : selectedState} onChange={e=>{setSelectedState(e.target.value); setIsFormDirty(true)}}/>
                            <label htmlFor="stateProvince">State / Province (optional)</label>
                        </div>
                        :
                        
                        <div className="form-floating w-100 req">
                            <input id="state" 
                            className={`form-control ${isStateInputValid ? 'is-valid' : 'is-invalid'}`}  
                            type="text" 
                            placeholder='State / Province' 
                            required 
                            value={selectedState === null ? '' : selectedState} 
                            onChange={handleStateProvinceChange}/>
                            <label htmlFor="stateProvince">State / Province</label>
                            <div className="invalid-feedback">
                            State / Province is required.
                            </div>
                        </div> 
                        }
                    </div>
                    <div className="form-group d-flex bd-highlight">
                        <div className="form-floating mr-14 w-100">
                            <input id="city" className="form-control" type="text" placeholder='City' value={selectedCity === null ? '' : selectedCity} onChange={e=>{setSelectedCity(e.target.value); setIsFormDirty(true)}}/>
                            <label htmlFor="city">City (optional)</label>
                        </div>
                        {postalRequired ?
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
                        : 
                            <div className="form-floating w-100">
                                <input id="zipCode" className="form-control" type="text" placeholder='Zip code (optional)' value={userPostalCode === null ? '' : userPostalCode} onChange={e=>{setPostalCode(e.target.value); setIsFormDirty(true)}}/>
                                <label htmlFor="zipCode">Zip code (optional)</label>
                            </div>
                        }
                    </div>
                    <div className="form-group d-flex bd-highlight mb-42">
                        <div className="input-group phone  mr-14 w-100">
                            <span className="input-group-text" id="basic-addon1">+{phoneCode}</span>
                            <span className='form-floating'>
                                <input id="phoneNumber" className="form-control" type="text" placeholder='Phone number (optional)' value={userPhoneNumber === null ? '' : userPhoneNumber} onChange={e => {
                                                                                                                                                                                const value = e.target.value;
                                                                                                                                                                                if (/^\d*$/.test(value)) {
                                                                                                                                                                                    setPhoneNumber(value);
                                                                                                                                                                                    setIsFormDirty(true);
                                                                                                                                                                                }
                                                                                                                                                                            }} />
                                <label htmlFor="phoneNumber">Phone number (optional)</label>
                            </span>
                            
                        </div>
                        <div className="input-group phone  w-100">
                            <span className="input-group-text" id="basic-addon1">+{phoneCode}</span>
                           <span className='form-floating'>
                            <input id="mobileNumber" className="form-control" type="text" placeholder="Mobile number (optional)" value={userMobileNumber === null ? '' : userMobileNumber} onChange={e => {
                                                                                                                                                                                const value = e.target.value;
                                                                                                                                                                                if (/^\d*$/.test(value)) 
                                                                                                                                                                                {
                                                                                                                                                                                    setMobileNumber(e.target.value); 
                                                                                                                                                                                    setIsFormDirty(true)
                                                                                                                                                                                }
                                                                                                                                                                                }}/>
                            <label htmlFor="mobileNumber">Mobile number (optional)</label>
                            </span>
                        </div>
                    </div>

                    <div className='d-flex mb-15'>
                        
                        {(currentRoute !== '/wizard' && !isExternalLogin) &&
                            <div className="gap-3 ">
                                <p className='font-16 sub-p mb-15'>Sign in and security</p>
                                <div className='d-flex flex-column gap-3 w-fit'>
                                {isProduction ?
                                <>
                                    <Link className='change-password' href='https://login.writetext.ai/Account/ChangePassword' target="_blank" style={{color: '#0066CC'}}>Change password<Image src="/images/ico-newtab.svg" height={16} width={16} alt='download'></Image></Link>
                                    <Link className='change-email' href='https://login.writetext.ai/Account/ChangeEmail' target="_blank" style={{color: '#0066CC'}}>Change email<Image src="/images/ico-newtab.svg" height={16} width={16} alt='download'></Image></Link>
                                </>
                                :
                                (AppSettings.API_URL.includes("writetextai-api-staging")) ?
                                    
                                
                                <>
                                    <Link className='change-password' href='https://writetextai-auth-staging.azurewebsites.net/Account/ChangePassword' target="_blank">Change password<Image src="/images/ico-newtab.svg" height={16} width={16} alt='download'></Image></Link>
                                    <Link className='change-email' href='https://writetextai-auth-staging.azurewebsites.net/Account/ChangeEmail' target="_blank">Change email<Image src="/images/ico-newtab.svg" height={16} width={16} alt='download'></Image></Link>
                                </>
                                :
                                (AppSettings.API_URL.includes("writetextai-api-dev")) ?
                                <>                                    
                                    <Link className='change-password' href='https://writetextai-auth-dev.azurewebsites.net/Account/ChangePassword' target="_blank">Change password<Image src="/images/ico-newtab.svg" height={16} width={16} alt='download'></Image></Link>
                                    <Link className='change-email' href='https://writetextai-auth-dev.azurewebsites.net/Account/ChangeEmail' target="_blank">Change email<Image src="/images/ico-newtab.svg" height={16} width={16} alt='download'></Image></Link>

                                </>
                                :
                                null
                                }
                                </div>
                            
                            </div> 
                        } 
                    </div>
                    <p className='font-13'>If you want to delete your account, please contact <Link href='mailto:support@writetext.ai' style={{color: '#0066CC'}}>support@writetext.ai</Link></p>

                </form>
            </div>
        </div>
                
        </>
        
          
  )
}
