import React, {useEffect, useState, useRef} from 'react'
import Image from 'next/image'
import Link from 'next/link'
import axios from 'axios'
import { useRouter } from 'next/router' 
import { Hint, Typeahead } from 'react-bootstrap-typeahead';
import { FloatingLabel, Form } from 'react-bootstrap';

import ModalPromptFailedUpdate from '../components/ModalPromptFailedUpdate'
import ModalUpdateAccount from '../components/ModalUpdateAccount'
import PaddleButton from './Paddle/PaddleButton'
import apiService from '../services/ApiService'
import { formatCreditsDisplay } from '../utils/helper'
import { AccountTypeEnum } from '../enum/AccountType'


import vatFormats from '../public/vatFormats/vat'
import zipCodes from '../public/zipCodes/zip'
const AppSettings = require('../settings/AppSetting').default

export default function Modal({target, type, click, modalref, opened, userData, MemberTypeEnum}) {
  
  const SSR = typeof window === 'undefined'
  const inputRef = useRef(null);

  const [credits, setCredits] = useState(null);
  const [hasSubscription, setHasSubscription] = useState(false)

  const [totalAvailableCredits, setAvailableCredits] = useState(0)
  const [totalFreeCredits, setFreeCredits] = useState(0)
  const [freeCreditsExpirationDate, setFreeCreditsExpirationDate] = useState(null);

  const [paypalSettings, setPaypalSettings] = useState(null);
  const [creditPlans, setcreditPlans] = useState(null)
  const [creditValue, setCreditValue] = useState(0)
  const [amount, setAmount] = useState(250)
  const [planId, setPlanId] = useState("")

  const [subscriptionExpiration, setSubscriptionExpiration] = useState("")

  const [suspendEnabled, setSuspendEnabled] = useState(false)
  const [init, setInit] = useState(true)

  const [subscriptionCancellationText, setSubscriptionCancellationText] = useState("")

  const https = require("https");
  const agent = new https.Agent({ rejectUnauthorized: false,   });
  const AppSettings = require('../settings/AppSetting').default

  const router = useRouter();
  const currentRoute = router.pathname.toLowerCase();

  const [selectedCountry, setSelectedCountry] = useState([])
  const [countriesList, setCountriesList] = useState([])
  const [isFormDirty, setIsFormDirty] = useState(false)

  const [paddleProduct, setPaddleProduct] = useState("")
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
  
  const [newUserData, setNewUserData] = useState(userData)
  const [accountUpdated, setAccountUpdated] = useState(false)
  const [isStateInputValid, setIsStateInputValid] = useState(true)
  const [selectedState, setSelectedState] = useState([])
  const [stateRequired, setStateRequired] = useState(false)

  const [buyCredits, setBuyCredits] = useState(false)
  function formatDate(date) {
    
    const d = new Date(date)
    const userLocale = navigator.language.substring(0,2);
    const options = {
      year: 'numeric',
      month: 'long' ,
      day: 'numeric',
    };
    const formattedDate = d.toLocaleDateString(userLocale, options);
    return formattedDate
  }
  
  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  function isExpired(date){
    const today = new Date();
    const d = new Date(date);
    return d < today;
  }

  function handleAccountTypeChange(event) {
    setVatIdValid(true)
    setCompanyNameValid(true)
    setIsCountryInputValid(true)
    if (event.target.id === 'radioBusinessModal') {
      setIsBusiness(true);
    } else if (event.target.id === 'radioIndividualModal') {
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
  }
  function validateVatId(country, vatId) {
    if (vatId === null || vatId === undefined || vatId.trim().length == 0)
        return false
    // Find the country's VAT format in the JSON
    const vatInfo = vatFormats[country];
    if (!vatInfo) {
        return true
    }

    // Check if there's a single regex or multiple
    if (Array.isArray(vatInfo.regex)) {
    // Loop through multiple regex options (if applicable) and test the VAT ID
    for (const regex of vatInfo.regex) {
        if (new RegExp(regex).test(vatId)) {
        return true; // VAT ID is valid
        }
    }
    return false; // No matching format found
    } else {
    // Single regex pattern
    const regex = new RegExp(vatInfo.regex);
    return regex.test(vatId); // Validate VAT ID
    }
  }
  function handleVatIdChange (e) {
      const inputValue = e.target.value;
      const country = selectedCountry[0]; // Replace with the appropriate country input from your form
    
      setCompanyVatId(inputValue);
    
      // Perform VAT validation
      const isValidVat = inputValue.trim().length == 0 ? false : validateVatId(country, inputValue);

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
  useEffect(() => {
    async function getSuspendSubscriptionText(){
      let cancellationText = ""
      if (userData.credit.membershipType !== MemberTypeEnum.FREETRIAL)
        axios.get(`${AppSettings.API_URL}/Policies/GetPolicy?type=SubscriptionCancellation`, {  httpsAgent: agent }).then(res => {
          let creditInformation = `<p className='m0 mb-8'>{{Credits}}</p>`
          let creditText = ""
          {(userData.credit.freeCredits.length > 0 && userData.credit.freeCredits.filter(r=>r.sourceId == "FreeCredits").length > 0 ) ?
            userData.credit.freeCredits.filter(r=>r.sourceId == "FreeCredits").map((credit, index) => (
              creditText = creditText + `${formatCreditsDisplay(credit.amount)}/${formatCreditsDisplay(credit.startingAmount)} free credits remaining. Expires on ${formatDate(credit.expiryDate)} <br>`
            ))
          : null }
          {(userData.credit.freeCredits.length > 0 && userData.credit.freeCredits.filter(r=>r.sourceId != "FreeCredits").length > 0) ?
            userData.credit.freeCredits.filter(r=>r.sourceId != "FreeCredits").map((credit, index) => (
              creditText = creditText + `${formatCreditsDisplay(credit.amount)}/${formatCreditsDisplay(credit.startingAmount)} subscription credits remaining. Resets on ${formatDate(credit.expiryDate)} <br>`
            ))
          : null}
          {userData.credit.credits.slice(0,3).map((credit, index) => (
            creditText = creditText + `${formatCreditsDisplay(credit.amount)}/${formatCreditsDisplay(credit.startingAmount)} premium credits remaining. Expires on ${formatDate(credit.expiryDate)} <br>`
            ))
          }
          creditInformation = creditInformation.replace("{{Credits}}", creditText)
          cancellationText = res.data.text
          cancellationText = cancellationText.replace("{{CreditInformation}}", creditInformation)
          cancellationText = cancellationText.replace("{{ExpirationDate}}", formatDate(userData.allBilling.billingInfo.subscriptions.nextBillingDate))
          setSubscriptionCancellationText(cancellationText)
        })
      else if(userData.credit.membershipType == MemberTypeEnum.FREE)
        axios.get(`${AppSettings.API_URL}/Policies/GetPolicy?type=CancellationNonPremium`, {  httpsAgent: agent }).then(res => {
          cancellationText = res.data.text
          cancellationText = cancellationText.replace("{{RemainingCredits}}", userData.credit.freeCredits[0].amount)
          cancellationText = cancellationText.replace("{{StartingAmount}}", userData.credit.freeCredits[0].startingAmount)
          cancellationText = cancellationText.replace("{{CreditExpiryDate}}", formatDate(userData.credit.freeCredits[0].expiryDate))
          cancellationText = cancellationText.replace("{{ExpirationDate}}", formatDate(userData.credit.freeCredits[0].expiryDate))
          setSubscriptionCancellationText(cancellationText)
        })
    }
    async function getSubscription(){
        if (userData.allBilling != null && userData.allBilling.billingInfo.billingInfoId !== "00000000-0000-0000-0000-000000000000")
        {
          if (userData.allBilling.billingInfo.subscriptions.status == "ACTIVE")
          {
            setHasSubscription(true)
          }
          else{
            
            document.querySelector('.paypal .modal-content').style.minHeight = '0';
          }
          
        }
      
    }
    async function Init(){
      // Reset modal state when initializing
      setPlanId("")
      setPaddleProduct("")
      
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
           setCredits(userData.credit);
            setSubscriptionExpiration(userData.credit.subscriptionExpiration)
           if (userData.credit.freeCredits.length > 0)
           {
             setFreeCredits(userData.credit.freeCredits[0].amount)
             setAvailableCredits(userData.credit.totalFreeCredits + userData.credit.totalCredits)
             setFreeCreditsExpirationDate(userData.credit.freeCredits[0].expiryDate)
           }else{
             setFreeCredits(0)
             setAvailableCredits(userData.credit.totalCredits)
           }
           if (type == "suspendsubscription")
            {
              getSuspendSubscriptionText()
            }
          }
            
              setTimeout(() => {
                if (currentRoute != "/wizard")
                {
                  if (typeof(document.getElementById('flexRadioDefault0')) != 'undefined' && document.getElementById('flexRadioDefault0') != null)
                    document.getElementById('flexRadioDefault0').click()
                }
              }, 500);
    }
    if (type == "credits" || type =="suspendsubscription")
    {
      getSubscription()
      Init()
    }

  },[])// eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    setAmount(creditValue)
  },[creditValue])

  let title = ""
  let text = ""
  let text_two = ""
  if (type == "logout")
  {
      title = "Log out"
      if (currentRoute === '/account' || currentRoute === '/extensions')
        text = "Are you sure you want to proceed? Any unsaved changes will be lost."
      else
        text = "Are you sure you want to proceed?"
  }

  if (type == "delete")
  {
    title = "Delete"
    text = "Are you sure you want to proceed? This cannot be undone. \n Other accounts can only register this webshop 30 days after it was linked to your account."
  }
  if (type == "deregister")
  {
    title = "Deregister webshop"
    text = "Are you sure you want to proceed?"
  }
  if (type == "confirm")
  {
  }

  if (type == "billing")
  {
    title = "Billing details required"
    text = "Click ok to redirect"
  }

  if (type == "address")
  {
    text = "Account details required"
     title = "Click ok to redirect"
  }
  
  if (type == "activatesubscription")
  {
    title = "Activate subscription"
    text = "Are you sure you want to proceed?"
  }

  if (type == "suspendsubscription")
  {
    title = "Cancel subscription"
  }
  const handleCredits = async (e) => {
    const elements = document.querySelectorAll('.modal .highlight-row');
    elements.forEach((element) => {
      element.classList.remove('highlight-row');
    });
    e.currentTarget.parentElement.parentElement.parentElement.parentElement.classList.add('highlight-row')
    // setCreditValue(e.target.defaultValue)
    setPlanId(userData.allBilling.creditPlans.filter(x => x.amount == e.target.defaultValue)[0].id)

      
    const paddleProducts = await apiService.get(`${AppSettings.API_URL}/Paddle/products/creditPlans`)
    //const paddleProductPlanId = await apiService.post(`${AppSettings.API_URL}/Paddle/pricing?planId=${planId}&productId=${paddleProducts.data[0].id}`)
    const paddleProduct = paddleProducts.data.data
    
    setPaddleProduct(paddleProduct[0].id)
  }
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
  
  const setCountry = (e) => {

    e.preventDefault();
    if (isFormDirty)
    {
      const countryName = document.getElementById("countryModal").value
      const stateElement = document.getElementById("stateModal")
      let stateName = '';
      if (stateElement)
      {
        stateName = document.getElementById("stateModal").value}
      
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
            return

        }

        setVatIdValid(validateVatId(countryName, companyVatId))
        if (!isCompanyNameValid || !isVatIdValid || !isCountryValid)
          return
        
      }else
      {
        if (postalRequired)
        {
          const isPostalCodeValid = userPostalCode.trim().length > 0
          
          setPostalCodeValid(isPostalCodeValid)
          if (!isCountryValid || !isPostalCodeValid)
            return
        }
        if (!isCountryValid)
          return
      }

      
      if (stateRequired)
      {
          if (!isProvinceValid)
              return
      }
    
      setHasOngoing(true)
      const formData = new FormData()
      formData.append('CountryName', countryName)
      formData.append('FirstName',userData.account.firstName)
      formData.append('LastName', userData.account.lastName)
      formData.append('Company', userCompanyName)
      formData.append('CompanyVATId', companyVatId)
      formData.append('AccountType', isBusiness ? AccountTypeEnum.Business : AccountTypeEnum.Individual)
      formData.append('StateName', stateName)
      formData.append('ZipCode',userPostalCode)
      
      axios({
        method: 'POST',
        url: `${AppSettings.API_URL}/Account/UpdateAccountDetails`,
        data: formData,
        headers: {"Content-Type": "application/json"}
      }).then(r => {
          if (currentRoute === "/welcome")
          {
            window.location.href = '/welcome'
          }
          else
          {
            if (currentRoute === "/premium")
              window.location.href = '/premium'
            else if (currentRoute === "/home")
            {
              window.location.hash = '#buy-credits'
              window.location.reload()
            }
            else
              window.location.href = '/home#buy-credits'
          }
      })
      //catch error
      .catch(res => {
          setHasOngoing(false)
          const errorMessage = JSON.parse(res.request.response)
          setUpdateAccountMessage(errorMessage.error)
          
          const { Modal } = require("bootstrap")
          const modalElement = document.getElementById('credits');
          // Create a Bootstrap Modal instance
          const modalInstance = Modal.getInstance(modalElement);
    
          if (modalInstance) {
            modalInstance.hide(); // Programmatically hide the modal on error
          }

          const myModals = new Modal("#failmessage")
          myModals.show()

      })
      }
  }
    
    return (
      !SSR ? 
      type === "credits"

      ?
      <>
      {currentRoute !== '/premium' &&
      <ModalUpdateAccount userData={userData} setdata={setNewUserData} setAccountUpdated={setAccountUpdated} modalref={modalref}></ModalUpdateAccount>
      }
      <ModalPromptFailedUpdate target="failmessage" errorMessage={updateAccountMessage}></ModalPromptFailedUpdate>
    <div className="d-flex justify-content-center align-items-center" ref={modalref}>
        <div
          className="modal fade"
          id={target}
          tabIndex="-1"
          aria-labelledby={target}
          aria-hidden="true"
        >
          <div className="modal-dialog paypal">
            <div className={`modal-content ${userData.account.address.country == null ? 'no-country' : ''}`}>
              <div className="modal-header">
              <div className='close-btn-container'>
                {currentRoute !== "/welcome" ? <button
                    type="button"
                    className="btn-close"
                    data-bs-dismiss="modal"
                    aria-label="Close"
                  ></button> : null }
                  
                </div>
              </div>
              <div className="modal-body credits">
                  {currentRoute === "/premium" 
                  ?
                  <div className={!hasSubscription ? `mb-20` : undefined}><p className="modal-title">{userData.account.company.accountType != null ? 'Buy credits' : 'Update account details'}</p></div> 
                  :
                  <div className={!hasSubscription ? `mb-20` : undefined}><p className="modal-title">Buy credits</p></div> 
                  }
               
                {hasSubscription ? 
                
                <div>
                  <p className="modal-text">{(totalFreeCredits && !isExpired(freeCreditsExpirationDate)) > 0
                  ? <span className='mb-10 fw-400'>You have <b>{formatCreditsDisplay(totalAvailableCredits)}</b> credits, <b>{formatCreditsDisplay(totalFreeCredits)}</b> which you can use until {formatDate(freeCreditsExpirationDate)} </span> 
                  : <span className='mb-10 fw-400'>You have <b>{formatCreditsDisplay(totalAvailableCredits)}</b> credits</span>  
                  }</p>
                </div>
                  
                :
                null}
                {userData.allBilling != null && userData.allBilling.paddlePaymentSettings != null && userData.allBilling.creditPlans != null &&
                userData.allBilling.creditPlans.map((plan, index) => (
                  <div key={index}>
                    <div className={`credit-container ${index != 2 ? 'mb-20' : 'mb-10'} ${index == 2 && hasSubscription ? 'mb-20' : ''}`}>
                    <div className={`credit-selection ${index == 2 && !hasSubscription ? 'disabled' : ''}`}>
                        <div>
                          
                          <label className="form-check-label d-flex" htmlFor={`flexRadioDefault` + index}>
                            <input {...(plan.bestOffer ? {ref: inputRef} : {})} className={`form-check-input ${plan.bestOffer ? `best-offer` : ``}`} type="radio" name="flexRadioDefault" id={`flexRadioDefault` + index} onChange={e => handleCredits(e)} value={plan.amount} disabled={index == 2 && !hasSubscription}/>
                              <span className='mt-auto mb-auto d-flex'>
                                <span>{formatNumber(plan.textDisplayCredits)}</span>
                                {plan.bestOffer && <Image className='ml-14' src="/images/ico_best.svg" width={65} height={25} alt='Best'></Image>}
                              </span>
                              <span className='ms-auto'>
                                <label className="d-flex flex-column price-display">
                                      <span>{plan.textDisplayAmount}</span>
                                      <span className='tax-info'>exclusive of applicable taxes</span>
                                </label>
                              </span>
                          </label>
                          
                        </div>
                      </div>
                    </div>
                  </div>
                ))
                }
                {userData.allBilling != null && userData.allBilling.paddlePaymentSettings != null && !hasSubscription && 
                                
                <div className='d-flex mb-20'>
                  <p className='credit-purchase-note'>Purchasing 5,000 credits is exclusive to active monthly or annual subscribers.</p>
                </div>
                }
                
                {userData != null && userData.allBilling.paddlePaymentSettings != null && planId != "" && paddleProduct != null && currentRoute != "/installationservice" ?
                
                <PaddleButton userData={userData} newUserData={newUserData} type={"credits"} isAnnual={false} productId={paddleProduct} planId={planId} accountUpdated={accountUpdated} buyCredits={setBuyCredits}/>
                
                : null}
               
              </div>
            </div>
          </div>
        </div>
      </div>
      </>
      :
      <div className="d-flex justify-content-center align-items-center" ref={modalref}>
        <div
          className="modal fade"
          id={target}
          tabIndex="-1"
          aria-labelledby={target}
          aria-hidden="true"
          // data-keyboard={()=>{if (type == "billing" || type == "address") return false}}
        >
          <div className={`modal-dialog mtp-15 ${type == `suspendsubscription` ? `modal-lg` : undefined}`}>
            <div className="modal-content">
              <div className="modal-header">
                <div className='close-btn-container'>
                  {type == "logout" ? <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> : null}
                  {type == "delete" || type == "deregister" ? <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> : null}
                  {type == "confirm" ? <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> : null}
                  {type == "activatesubscription" || type == "suspendsubscription" ? <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button> : null}
                </div>
               
              </div>
              <div className="modal-body">
                <div>
                  <p className="modal-title">{title}</p>
                </div>
                <div>
                
                  {type == "suspendsubscription" ? <div className='mt-20' dangerouslySetInnerHTML={{ __html: subscriptionCancellationText }} /> : <p className='modal-text'>{text}</p>}
                  {/* <p className="modal-text">{text}</p> */}
                  {/* {type == "suspendsubscription" ? <p className="modal-text">{text_two}</p> : null} */}
                </div>
                
                  {type == "billing" ? <div className="right"> <button className={`btn ${type == "billing" ? "btn-primary" : "btn-danger"} mr-8`} onClick={click} data-bs-dismiss="modal">{title}</button></div> : null }
                  {type == "address" ? <div className="right"> <button className={`btn ${type == "billing" ? "btn-primary" : "btn-danger"} mr-8`} onClick={click} data-bs-dismiss="modal">{title}</button></div> : null}
                  {type == "logout" ? <div className="right"> <button className="btn mr-8" data-bs-dismiss="modal">Cancel</button> <button className={`btn btn-danger`} onClick={click} data-bs-dismiss="modal">Yes</button></div>  : null}
                  {type == "delete" || type == "deregister" ? <div className="right"> <button className="btn mr-8" data-bs-dismiss="modal">Cancel</button> <button className={`btn btn-danger`} onClick={click} data-bs-dismiss="modal">Yes</button></div>: null}
                  {type == "confirm" ? <div className="right"> <button className="btn mr-8" data-bs-dismiss="modal">Cancel</button>  <button className={`btn btn-danger`} onClick={click} data-bs-dismiss="modal">Yes</button></div>: null}
                
                  {type == "activatesubscription" ? <div className="right"> <button className="btn mr-8" data-bs-dismiss="modal">Cancel</button>  <button className={`btn btn-primary`} onClick={click} data-bs-dismiss="modal">Yes</button></div>: null}
                  {type == "suspendsubscription" ?
                  <>
                    <div className='d-flex'>
                      <input id='accept' type='checkbox' className='form-check-input' checked={suspendEnabled} onChange={(e) => setSuspendEnabled(e.target.checked)}></input>
                      <label htmlFor='accept' className='ml-5'>I agree and understand</label>
                    </div> 
                    <div className="right"> 
                      <button className="btn mr-8" data-bs-dismiss="modal">Cancel</button>  
                      <button className={`btn btn-danger ${suspendEnabled ? `` : `disabled`}`} onClick={click} data-bs-dismiss="modal" >Yes, cancel subscription</button>
                    </div>
                  </>
                  : null}

                {/* <div className="right">{type != "billing" ? <button className="btn" data-bs-dismiss="modal">Cancel</button> : null} <button className={`btn ${type == "billing" ? "btn-primary" : "btn-danger"}`} onClick={click} data-bs-dismiss="modal">{type == "billing" ? "Ok" : title}</button></div> */}
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
      : null
    );
  }
  