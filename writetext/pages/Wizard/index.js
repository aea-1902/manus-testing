import React, { useRef } from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { setAuthHeader } from '../../utils/axiosHeader'
import axios from 'axios'
import FBPixel from '../../facebook/fb-pixel'
import Header from '../../components/Header'
import SideMenuWizard from '../../components/SideMenuWizard'
import Body from '../../components/Body'
import Content from '../../components/Content'
import Footer from '../../components/Footer'

import Account from '../../components/Account'
import Billing from '../../components/Billing'
import Plugins from '../../components/Plugins'

import Image from 'next/image'
import Link from 'next/link'
import { setMonth } from 'date-fns'
import t from '../../public/translation/locale'
const StepButtonWrapper = ({stepCounter, handleIncrementStepClick, handleDecrementStepClick, showButton, redirectToSubscription}) => {
    return <>
    <div className='d-flex mt-20 mb-42'>
                            <div className='d-flex'><button  className={`previous-btn ${stepCounter > 1 ? `d-block` : `d-none`}`} onClick={handleDecrementStepClick}><Image src="/images/ic_previous.svg" height={30} width={30} alt='previous'></Image>Previous step</button></div>
                            {showButton && stepCounter < 3 ? 
                                stepCounter == 1 ?
                                    <div className='d-flex pull-right'><button id='next' className={`next-btn ${stepCounter != 3 ? `d-block` : `d-none`}`} onClick={handleIncrementStepClick}>Next step<Image src="/images/ic_next.svg" height={30} width={30} alt='next'></Image></button></div>
                                :
                                // stepCounter == 2 ? //no subscription
                                //     <div className='d-flex pull-right'><button id='next' className={`next-btn ${stepCounter != 3 ? `d-block` : `d-none`}`} onClick={handleIncrementStepClick}>Continue with free account<Image src="/images/ic_next.svg" height={30} width={30} alt='next'></Image></button></div>
                                // :
                                null // with subscription
                            : null
                            }
                            { stepCounter == 2 &&
                            <div className='d-flex pull-right p-14'><button className={`previous-btn dolater-btn ${stepCounter == 2 ? `d-block` : `d-none`}`} onClick={() => {redirectToSubscription ? window.location.href = "/premium" : window.location.href = "/home"}}>Finish</button></div>
                            }
                        </div>
    </>
}
function Wizard({userData}) {
    
  const router = useRouter();

    const https = require("https")
    const httpsAgent = new https.Agent({ rejectUnauthorized: false })

    const [credits, setCredits] = useState(null)


    const [subscription, setSubscription] = useState(null)
    const [paypalSettings, setPaypalSettings] = useState(null)
    
    const [userCompanyName, setCompanyName] = useState('')
    const [userFirstName, setFirstName] = useState('')
    const [userLastName, setLastName] = useState('')
    
    const [userFirstAddress, setFirstAddress] = useState('')
    const [userSecondAddress, setSecondAddress] = useState('')

    const [selectedCountry, setSelectedCountry] = useState([])
    const [selectedState, setSelectedState] = useState([])
    const [selectedCity, setSelectedCity] = useState([])

    
    const [countriesList, setCountriesList] = useState([])
    const [statesList, setStatesList] = useState([])
    const [citiesList, setCitiesList] = useState([])

    const [userPostalCode, setPostalCode] = useState('')
    const [userCountry, setCountry] = useState(0)
    const [userStateProvince, setStateProvince] = useState(0)
    const [userCity, setCity] = useState(0)
    const [userPhoneNumber, setPhoneNumber] = useState('')
    const [userMobileNumber, setMobileNumber] = useState('')

    const [loaded, setLoaded] = useState(false)

    const [stepCounter, setStepCounter] = useState(0)
    const [webshops, setWebshops] = useState([])
    const [translation, setTranslation] = useState(null)
    const AppSettings = require('../../settings/AppSetting').default
    const [showButton, setShowButton] = useState(false);

    const [saveSuccesful, setSaveSuccesful] = useState(false)

    const [subscriptionSuccess, setSubscriptionSuccess] = useState(false)


    const handleValueFromAccountSave = (value) => {
        if (value)
        { 
            setTimeout(() => {
                if (stepCounter < 3) {
                    setStepCounter(stepCounter + 1);
                    // setPaypalSettings(null)
                    axios.get(`${AppSettings.API_URL}/Billing/PaymentSettings?gateWay=` + "PayPal",{ httpsAgent }).then(r => {
                        if (r.data != "")
                            setPaypalSettings(r.data)
                    })
                }
            },500)
        }
        else
        {
            
        }
    };
  // Callback function to set showButton to true after the Account component is rendered
    const handleRender = () => {
        setShowButton(true);
    };
    // useEffect(() => {
    //     if (subscriptionSuccess)
    //     {
    //         if (AppSettings.FACEBOOK_PIXEL == "true")
    //         {
    //             console.log
    //             // <FBPixel />
    //         }
    //     }
    // },[subscriptionSuccess])// eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {
        if (paypalSettings == null && stepCounter == 2)
        {
            axios.get(`${AppSettings.API_URL}/Billing/PaymentSettings?gateWay=` + "PayPal",{ httpsAgent }).then(r => {
                if (r.data != "")
                    setPaypalSettings(r.data)
            })
        }
    },[paypalSettings])// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        async function Init(){
          
            const locale = navigator.language.substring(0,2); 
            setTranslation(t[locale] != undefined ? t[locale] : t["en"])
            if (userData != null)
                if (userData.account.address === null)
                {
                    setStepCounter(1);
                }
                else
                {      
                    if (userData.account.address.addressId == '00000000-0000-0000-0000-000000000000')
                    {
                        setStepCounter(1);
                    }
                    else
                    {
                        setStepCounter(2)
                            setFirstName(userData.account.firstName)
                            setLastName(userData.account.lastName)
                            setLoaded(true)

                            if (userData.allBilling.billingInfo.billingInfoId != "00000000-0000-0000-0000-000000000000")
                            {setSubscription(userData.allBilling.billingInfo)
                                {
                                    setStepCounter(2)
                                    setCompanyName(userData.allBilling.billingInfo.companyname)
                                    setPhoneNumber(userData.allBilling.billingInfo.landLine)
                                    setMobileNumber(userData.allBilling.billingInfo.mobile)
                                    setFirstAddress(userData.allBilling.billingInfo.line1)
                                    setSecondAddress(userData.allBilling.billingInfo.line2)
                                    setPostalCode(userData.allBilling.billingInfo.postalCode)
                                    setCountry(userData.allBilling.billingInfo.country.id)
                                    setStateProvince(userData.allBilling.billingInfo.state.id)
                                    setCity(userData.allBilling.billingInfo.city.id)
                                    
                                    axios.get(`${AppSettings.API_URL}/CountryModels/GetCountries`,{ httpsAgent }).then(c => {
                                        setCountriesList(c.data)
                                        setSelectedCountry(c.data.filter(c => c.text === userData.allBilling.billingInfo.country.name).map(function (c) { return c.text}))
                                        // axios.get(`${AppSettings.API_URL}/CountryModels/GetStateList?countryId=`+ userData.allBilling.billingInfo.country.id, {httpsAgent})
                                        // .then((res) => {
                                        //     setStatesList(res.data)
                                        //     setSelectedState(res.data.filter(c => c.text === userData.allBilling.billingInfo.state.name).map((c) => {return c.text}))
                                        //     if (userData.allBilling.billingInfo.state.id != 0)
                                        //     {
                                        //         axios.get(`${AppSettings.API_URL}/CountryModels/GetCityList?stateId=`+ userData.allBilling.billingInfo.state.id, {httpsAgent})
                                        //         .then((res) => {
                                        //             setCitiesList(res.data)
                                        //             setSelectedCity(res.data.filter(c => c.text === userData.allBilling.billingInfo.city.name).map((c) => {return c.text}))
                                        //             })}
                                        //     else
                                        //     {
                                        //         axios.get(`${AppSettings.API_URL}/CountryModels/GetCitiesByCountry?countryId=`+ userData.allBilling.billingInfo.country.id, {httpsAgent})
                                        //         .then((res) => {
                                        //             setCitiesList(res.data)
                                        //             setSelectedCity(res.data.filter(c => c.text === userData.allBilling.billingInfo.city.name).map((c) => {return c.text}))
                                        //             })}
                                        // })  
                                    })
                                }
                                axios.get(`${AppSettings.API_URL}/Webshop/GetWebshopURLs`,{ httpsAgent }).then(u=> {
                                    if (u.data.length == 0)
                                    {
                                        setStepCounter(3)
                                    }
                                    else
                                    {
                                        router.push('/home')
                                    }
                                })
                            }
                        }
                    }
                  
             

            
            

         }
        
         async function getUser() {

            const AuthenticationService = require('../../services/AuthenticationService').default
            await AuthenticationService.getUser().then(u => {
              if (u == null)
              {
                // AuthenticationService.login()
              }
              
              setAuthHeader(u.access_token)
              
              Init()  
            })
          }
          
          
      getUser()
    }, [userData])// eslint-disable-line react-hooks/exhaustive-deps
    const handleIncrementStepClick = () => {
        if (stepCounter == 1)
        {
            document.getElementById("saveAccount").click()
            // accountComponentRef.current.handleSubmit();
            if (document.forms['formAccount'].reportValidity())
            {
               
            }
        }
        else
        {
           
            setStepCounter(stepCounter + 1);
        }
      };
    
      const handleDecrementStepClick = () => {

        if (stepCounter > 1) {
            setStepCounter(stepCounter - 1);
        }
      };
      const shortcut = (e) => {
        switch (e.currentTarget.id) {
            case "account" :
                setStepCounter(1)
                break;
            case "billing" :
                setStepCounter(2)
                break;
            case "plugins" :
                setStepCounter(3)
                break;
        }
      }
    if (translation && userData) {
        return (
            <>
            <SideMenuWizard activeStep={stepCounter} shortcut={shortcut} />
                <Body>
                    <Content>
                        {stepCounter == 1 ?
                        
                        <div className={`${stepCounter == 1 ? `show` : ``}`}>
                        <StepButtonWrapper stepCounter={stepCounter} handleDecrementStepClick={handleDecrementStepClick} handleIncrementStepClick={handleIncrementStepClick} showButton={showButton}/>
                        <Account onRender={handleRender} userData={userData} translation={translation.Content["Account"]} apiResponse={handleValueFromAccountSave}/>
                        </div>
                        : null
                        }
                        {/* {stepCounter == 2 ?
                        
                        <div className={`transition-container d-block ${stepCounter == 2 ? `show` : ``}`}>
                            {userData.allBilling.paymentSettings != null &&
                            <Billing onRender={handleRender} disablePaypal={AppSettings.DISABLE_PAYPAL} subscription={subscription} userData={userData} translation={translation.Content["Billing"]} subscriptionSuccess={subscriptionSuccess} setSubscriptionSuccess={setSubscriptionSuccess} handleIncrementStepClick={handleIncrementStepClick}/>
                            }
                            <StepButtonWrapper stepCounter={stepCounter} handleDecrementStepClick={handleDecrementStepClick} handleIncrementStepClick={handleIncrementStepClick} showButton={showButton} subscription={userData.allBilling.billingInfo.subscriptions}/>
                        </div>
                        : null
                        } */}

                        {stepCounter == 2 ?
                        <div className={`${stepCounter == 2 ? `show` : ``}`}>
                            <StepButtonWrapper stepCounter={stepCounter} handleDecrementStepClick={handleDecrementStepClick} handleIncrementStepClick={handleIncrementStepClick} showButton={showButton} subscription={userData.allBilling.billingInfo.subscriptions} redirectToSubscription={userData.account.company.redirectToSubscription}/>
                            <Plugins onRender={handleRender} translation={translation.Content["Plugins"]} userData={userData} />
                        </div>
                         : null}

                         {!AppSettings.API_URL.includes("writetextai-api-dev") && subscriptionSuccess ? <FBPixel /> : null}
                    </Content>
                </Body>
            </>
        )
    }
}

export default Wizard