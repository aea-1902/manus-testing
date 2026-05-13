import React from 'react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

import Image from 'next/image'

import axios from 'axios'
import { setAuthHeader } from '../utils/axiosHeader'
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from '@paypal/react-paypal-js'
import ModalSubscription from '../components/ModalSubscription'
import { event } from '../components/gtm'
import t from '../public/translation/locale'
import { is } from 'date-fns/locale'
import settings from '../settings/AppSetting'

import FACEBOOK_PIXEL from '../facebook/fb-pixel'
import FbPixel from '../facebook/fb-pixel'

const ButtonWrapper = ({ type, subscription_id, amount , subscriptionMessage, subscriptionSuccess, setSubscriptionSuccess, handleIncrementStepClick, isMonthly}) => {
    
    const AppSettings = require('../settings/AppSetting').default

    const router = useRouter()
    const https = require("https");
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

    const [{ options, isPending, isResolved, isRejected }, dispatch] = usePayPalScriptReducer();
    const [paypalsubscriptionid, updatePaypalSubscriptionId] = useState(null)
    
    useEffect(() => {
        if (paypalsubscriptionid != undefined)
        {
            
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
                intent: "subscription",
            },
        });
            //const paypalToken = require('../../services/PaypalService').getFromStorage("paypal_token")
            
            var qs = require('qs');

            axios({
                method: 'POST',
                url: `${AppSettings.API_URL}/Billing/registerSubscription?id=` + paypalsubscriptionid + `&gateWay=PayPal`,
            }).then(res=>{
                // router.reload(window.location.pathname)\
                
                setSubscriptionSuccess(true)
                handleIncrementStepClick()
            }).catch(err=>{
                subscriptionMessage(err.response.data.error)
            });

                
            
        }
    }, [paypalsubscriptionid])// eslint-disable-line react-hooks/exhaustive-deps
    // function test(){
        
    //     setSubscriptionSuccess(true)
    //     handleIncrementStepClick()
    // }
	return (
        <>
        {/* <button onClick={test}>Click me!</button> */}
            <div className="paypal-button-container">
            {isResolved && 
            <PayPalButtons className='w-100'
            key={subscription_id}
            forceReRender={[amount]}
            createSubscription={(data, actions) => {
                return actions.subscription
                    .create({
                        plan_id: subscription_id,
                    })
                    .then((orderId) => {
                        return orderId;
                    });
            }}

            onApprove={(data, actions) => {
                if (!AppSettings.API_URL.includes("writetextai-api-dev"))
                {
                    event(isMonthly ? "Monthly" : "Yearly", {})
                }
                updatePaypalSubscriptionId(data.subscriptionID)
            }}

            style={{
                label: "paypal",
                layout: "vertical",
                tagline: false,


            }}
            //fundingSource="paypal"
        />}
        {isRejected && <p>There is an issue connecting to PayPal and you may need to refresh the page to try again.
If the issue persists, it might be an issue with your browser, and you may need to update it to the latest version or clear your cache and cookies to resolve the problem.</p> }
         
           
            
        </div>
        </>
        
    )
}
export default function Billing({disablePaypal, userData, translation, onRender, subscriptionSuccess,setSubscriptionSuccess, handleIncrementStepClick}) {
    
    const [subscriptionMessage, setSubscriptionMessage] = useState('')
    const https = require("https")
    const httpsAgent = new https.Agent({ rejectUnauthorized: false })
    
    const [monthly, setMonthly] = useState(true)
    const AppSettings = require('../settings/AppSetting').default

    const [allUserData, setAllUserData] = useState(null)

    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    
    useEffect(() => {
        setTimeout(() => {
          onRender()
        }, 100); 
      }, [])// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        async function Init(){
            
        const locale = navigator.language.substring(0,2); 
            
          await axios.get(`${AppSettings.API_URL}/Account/All?GetAccount=true&GetCredit=true&GetCreditPlans=true&GetPaymentSettings=true&GetBillingInfo=true&GetInstallationPlan=true&Gateway=PayPal`,{ httpsAgent } ).then(usr => {
            setAllUserData(usr.data)
          })

         }

   

         async function getUser() {

            const AuthenticationService = require('../services/AuthenticationService').default
            await AuthenticationService.getUser().then(u => {
              if (u != null)
              {
                setAuthHeader(u.access_token)
                //setUser(u)
                Init()  
              }
              
            })
          }
          
          
      getUser()
    },[])// eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        if (subscriptionMessage !== '')
        {
            const { Modal } = require("bootstrap")
            const myModals = new Modal("#subscription");
            myModals.show()
        }
    },[subscriptionMessage])

    
function formatMoney(number){
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
  }
  if (translation && allUserData)
  return (
    <>
    
    <ModalSubscription target="subscription" subscriptionmessage={subscriptionMessage}></ModalSubscription>
    <div className="header billing"><p>{translation["PageHeaderText"]}</p></div>
    
    {allUserData.allBilling.billingInfo.subscriptions == null  && allUserData.allBilling.paymentSettings != null ?
        <div>
            <div className='history-note mb-42 mt-36 font-16'>
                    <p className='d-flex'>
                        <div>
                            <Image className='info-icon' src='/images/info-icon.svg' width={16} height={16} alt='info'></Image>
                        </div>
                        <div>
                            Your {monthly ? allUserData.allBilling.paymentSettings.monthly.trialDays : allUserData.allBilling.paymentSettings.annual.trialDays}-day free trial starts once you subscribe through Paypal. You will not be charged at this point, but at the end of your trial period, you will be automatically charged until you cancel. You can cancel your subscription anytime, either in your WriteText.ai billing settings or directly in your Paypal account. See our FAQ page for more information.
                        </div>
                    </p>
            </div>
            <div className='billing d-flex center mb-10'>
                <span className={`m20 mb-0 mt-0 ${monthly ? `active` : ``}`}><a onClick={() => setMonthly(true)}>Monthly</a></span>
                <span className={`m20 mb-0 mt-0 ${!monthly ? `active` : ``}`}><a onClick={() => setMonthly(false)}>Annually</a></span>
            </div>
            <div className='subscription-wizard-container p40'>
                <div className='text-center mb-30'>
                    <div><p className='subscription-header'>{translation["SubscriptionSubHeaderText"]}</p></div>
                    <div className='billing d-flex center h-24 mb-24'>
                        {monthly 
                            ?
                            <>
                                <p className='subscription-price'>{formatNumber(allUserData.allBilling.paymentSettings.monthly.credits)} credits</p>
                                <p className='subscription-price-divider ml-20 mr-20 mb-0'>|</p>
                                <p className='subscription-price'>{allUserData.allBilling.paymentSettings.monthly.currency} {formatMoney(allUserData.allBilling.paymentSettings.monthly.price)} {allUserData.allBilling.paymentSettings.monthly.exclusiveTax && `*`} / month</p>
                            </> 
                            :
                            <>
                                <p className='subscription-price'>{formatNumber(allUserData.allBilling.paymentSettings.annual.credits)} credits</p> 
                                <p className='subscription-price-divider ml-20 mr-20 mb-0'>|</p>  
                                <p className='subscription-price'>{allUserData.allBilling.paymentSettings.annual.currency} {formatMoney(allUserData.allBilling.paymentSettings.annual.price)} {allUserData.allBilling.paymentSettings.annual.exclusiveTax && `*`} / year</p>
                                {allUserData.allBilling.paymentSettings.annual.discount != null && 
                                <p className='subscription-price-off'>{allUserData.allBilling.paymentSettings.annual.discount}% OFF</p>}
                            </> 
                        }
                    </div>
                    {monthly && allUserData.allBilling.paymentSettings.monthly.exclusiveTax &&
                    <div className='subscription-tax-text'><p>*exclusive of tax</p></div>}
                    
                    {!monthly && allUserData.allBilling.paymentSettings.annual.exclusiveTax &&
                        <div className='subscription-tax-text'><p>*exclusive of tax</p></div>}
                </div>
                <div>
                <PayPalScriptProvider
                    options={{
                        "client-id": allUserData.allBilling.paymentSettings.clientId,
                        components: "buttons",
                        intent: "subscription",
                        vault: true,
                    }}
                >    
                        <ButtonWrapper type="subscription" isMonthly={monthly ? true : false} subscription_id={monthly ? allUserData.allBilling.paymentSettings.monthly.planId : allUserData.allBilling.paymentSettings.annual.planId} amount={monthly ? userData.allBilling.paymentSettings.monthly.price : userData.allBilling.paymentSettings.annual.price} subscriptionMessage={setSubscriptionMessage} subscriptionSuccess={subscriptionSuccess} setSubscriptionSuccess={setSubscriptionSuccess} handleIncrementStepClick={handleIncrementStepClick}/>
                </PayPalScriptProvider> 
                </div>
            </div>
        </div>
        : 
        <form >
                
                <div>
                    <p className='font-16 mb-14 sub-p'>{translation["FormHeaderText"]}</p>
                </div>

                <div className="form-group d-flex bd-highlight">
                    <div className="form-floating mr-14 w-100">
                        <input id="firstName" className="form-control" type="text" placeholder='First name' value={allUserData.allBilling.billingInfo.firstName} disabled/>
                        <label htmlFor="firstName">First name</label>
                    </div>
                    <div className="form-floating w-100">
                        <input id="lastName" className="form-control" type="text" placeholder="Last name" value={allUserData.allBilling.billingInfo.lastName} disabled/>
                        <label htmlFor="lastName">Last name</label>
                    </div>
                </div>
                <div className="form-group d-flex bd-highlight">
                    <div className="form-floating w-100">
                    <input id="streetAddress" className="form-control" type="text" placeholder='Street address' value={allUserData.allBilling.billingInfo.line1 === null ? '' : allUserData.allBilling.billingInfo.line1} disabled/>
                                <label htmlFor="streetAddress">Street address</label>
                    </div>
                </div>
                
                <div className="form-group d-flex bd-highlight">
                    <div className="form-floating w-100">
                        <input id="streetAddress_two" className ="form-control" type="text" placeholder='Street address' value={allUserData.allBilling.billingInfo.line2 === null ? '' : allUserData.allBilling.billingInfo.line2} disabled/>
                            <label htmlFor="streetAddress_two">Street address</label>
                    </div>
                </div>
                <div className="form-group d-flex bd-highlight">
                    <div className="form-floating mr-14 w-100 req">
                        <input id='country' className='form-control' placeholder='Country' value={allUserData.allBilling.billingInfo.country.name} disabled></input>
                        <label htmlFor="country">Country</label>
                    </div>
                    <div className="form-floating w-100">
                        <input id='state' className='form-control' placeholder='State' value={allUserData.allBilling.billingInfo.state.name} disabled></input>
                        <label htmlFor="state">State</label>
                    </div>
                </div>
                <div className="form-group d-flex bd-highlight">
                    <div className="form-floating mr-14 w-100 req">
                        
                    <input id='city' className='form-control' placeholder='City' value={allUserData.allBilling.billingInfo.city.name} disabled></input>
                        <label htmlFor="city">City</label>
                    </div>
                    <div className="form-floating w-100">
                        <input id="zipCode" className="form-control" type="text" placeholder='Zip code' value={allUserData.allBilling.billingInfo.postalCode} disabled/>
                        <label htmlFor="zipCode">Zip code</label>
                    </div>
                </div>
            </form>
    }
    
    </>
  )
}
