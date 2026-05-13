import React, {useEffect, useState} from 'react'
import { useRouter } from 'next/router' 
import axios from 'axios'
import Image from 'next/image'
import Header from '../../components/Header'
import SideMenu from '../../components/SideMenu'
import Body from '../../components/Body'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import { event } from '../../components/gtm'
import { setAuthHeader } from '../../utils/axiosHeader'
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from '@paypal/react-paypal-js'

import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';

import ModalDialog from '../../components/Modal'
import t from '../../public/translation/locale'

const ButtonWrapper = ({ type, subscription_id, amount , subscriptionMessage, isMonthly}) => {
    
    const AppSettings = require('../../settings/AppSetting').default

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
                router.reload(window.location.pathname)
            }).catch(err=>{
                subscriptionMessage(err.response.data.error)
            });

                
            
        }
    }, [paypalsubscriptionid])// eslint-disable-line react-hooks/exhaustive-deps
    
	return (
        
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
                        // Your code here after create the order
                        //updateSubscriptionId(orderId)
                        return orderId;
                    });
            }}

            onApprove={(data, actions) => {
                if(!AppSettings.API_URL.includes("writetextai-api-dev"))
                {
                    event(isMonthly ? "Monthly" : "Yearly", {})
                }
                updatePaypalSubscriptionId(data.subscriptionID)
            }}

            style={{
                label: "paypal",
                layout: "horizontal",
                tagline: false
            }}
           // fundingSource="paypal"
        />}
        {isRejected && <p>There is an issue connecting to PayPal and you may need to refresh the page to try again.
If the issue persists, it might be an issue with your browser, and you may need to update it to the latest version or clear your cache and cookies to resolve the problem.</p> }
         
           
            
        </div>
    )
}

export default function Billing ({userData}){
    const router = useRouter()
    


    const https = require("https")
    const httpsAgent = new https.Agent({ rejectUnauthorized: false })
    
    const [credits, setCredits] = useState(null)
    const [subscriptionMessage, setSubscriptionMessage] = useState(null)
    const [userBilling, setUserBilling] = useState(null)
    const [translation, setTranslation] = useState(null)
    const [monthly, setMonthly] = useState(true)

    const AppSettings = require('../../settings/AppSetting').default
    
    function formatDate(date) {
    
        const d = new Date(date)
        const userLocale = navigator.language.substring(0,2);
        const options = {
          year: 'numeric',
          month: userLocale == 'en' ? 'short' : 'long' ,
          day: 'numeric',
        };
        const formattedDate = d.toLocaleDateString(userLocale, options);
        return formattedDate
      }
      
    function formatNumber(num) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    }
    function formatMoney(number){
        return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    
    useEffect(() => {
        async function Init(){
            const locale = navigator.language.substring(0,2); 
            setTranslation(t[locale] != undefined ? t[locale].Content["Billing"] : t["en"].Content["Billing"])
            await axios.get(`${AppSettings.API_URL}/Account/All?GetAccount=true&GetCredit=true&GetCreditPlans=true&GetPaymentSettings=true&GetBillingInfo=true&GetInstallationPlan=true&Gateway=PayPal`,{ httpsAgent } ).then(usr => {
                setUserBilling(usr.data)
            });
         }

         async function getUser() {

            const AuthenticationService = require('../../services/AuthenticationService').default
            await AuthenticationService.getUser().then(u => {
              if (u == null)
              {
                // AuthenticationService.login()
              }
              else
              {
              setAuthHeader(u.access_token)
              //setUser(u)
              Init()  }
            })
          }
          
      getUser()
    },[])// eslint-disable-line react-hooks/exhaustive-deps


    function cancelSubscription(){
        axios.post(`${AppSettings.API_URL}/Billing/${userBilling.allBilling.billingInfo.subscriptionId}/cancelSubscription`, { httpsAgent }).then(res => {
            
            //router.reload(window.location.pathname)
            window.location.assign(`/cancellationsurvey`);
        })
    }
    
    function suspendSubscription(){
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });
        axios.post(`${AppSettings.API_URL}/Billing/subscription/${userBilling.allBilling.billingInfo.subscriptionId}/suspend`, { httpsAgent }).then(res => {
            
            //router.reload(window.location.pathname)
            window.location.assign(`/cancellationsurvey`);
        })
    }

    function activateSubscription() {
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });
        axios.post(`${AppSettings.API_URL}/Billing/subscription/${userBilling.allBilling.billingInfo.subscriptionId}/activatesubscription`, { httpsAgent }).then(res => {
            
            router.reload(window.location.pathname)
        })

    }

    function showModal() {
        const { Modal } = require("bootstrap")
        const myModals = new Modal(userBilling.allBilling.billingInfo.subscriptions.status == "ACTIVE" ? "#suspend" : "#activate");
        myModals.show()
      }
      const styles = {
       overflow: 'scroll'
      };
if (translation && userBilling && userData)
  return (
    <>
    
    <ModalDialog userData={userBilling} target="address" type="address" click={() => {router.push('/account')}}/>
        <Body>
          <Content backgroundclass={"scrollable-container"}>
            <div className='container'>
            {userBilling.allBilling.billingInfo.subscriptions != null  ?
            <>
                {userBilling.allBilling.billingInfo.subscriptions.status == "ACTIVE"  
                ? 
                <ModalDialog userData={userBilling} target="suspend" type="suspendsubscription" click={suspendSubscription} userCredits={credits}/>
                :
                <ModalDialog userData={userBilling} target="activate" type="activatesubscription" click={activateSubscription}/>
                }
                <div className="header">
                    <p>{translation["SubscriptionHeaderText"]}</p>
                </div>
                <div className='subscription-container d-flex'>
                    <div >
                        <div className='d-flex'>
                            <p className='font-16 mb-8 sub-p mr-8'>{translation["Subscription"]["SubscriptionStatus"]} </p>
                            <p className={`font-16 mb-8 sub-p ${userBilling.allBilling.billingInfo.subscriptions.status == "ACTIVE"  ? 'active-sub' : 'suspended'}`}> {userBilling.allBilling.billingInfo.subscriptions.status == "ACTIVE"  ? 'Active' : userBilling.allBilling.billingInfo.subscriptions.status == "CANCELLED" ? 'Cancelled' : 'Suspended'}</p>
                        </div>
                        <div className='subscription-details'>

                            {userBilling.allBilling.billingInfo.subscriptions.status == "CANCELLED" && userBilling.allBilling.billingInfo.accountCancelledDate != null ?
                            <p className='m0 mb-8'>{translation["Subscription"]["CancelledOn"]} {formatDate(userBilling.allBilling.billingInfo.accountCancelledDate)}</p>
                            : null}
                            <p className='m0 mb-8'>{userBilling.allBilling.billingInfo.isFreeTrial ? translation["Subscription"]["FreeTrialExpires"] : translation["Subscription"]["SubscriptionExpires"]} {formatDate(userBilling.credit.subscriptionExpiration)}</p>
                            <p className='m0 mb-8'>{translation["Subscription"]["LastAmountPaid"]} {userBilling.allBilling.billingInfo.subscriptions.lastAmountPaid !== "-" ? formatNumber(userBilling.allBilling.billingInfo.subscriptions.lastAmountPaid) : "Free Trial"}</p>
                        </div>  
                    </div>
                    
                    <div className="button-container ml-auto mb-auto mt-auto">
                    {
                            
                        // subscription.subscriptions.status != "CANCELLED" && <input type="submit" className={`font-14 btn submit-button ${subscription.subscriptions.status == "ACTIVE" ? 'subscription-button active-sub' : 'subscription-button suspended'}`} value={subscription.subscriptions.status == "ACTIVE" ? translation["Subscription"]["CancelSubscription"] : translation["Subscription"]["ReactivateSubscription"]}
                        // onClick={showModal}
                        // />

                        userBilling.allBilling.billingInfo.subscriptions.status == "ACTIVE" ?
                            <input type='submit' className='font-14 btn submit-button subscription-button active-sub' value={translation["Subscription"]["CancelSubscription"]} onClick={showModal} />

                        : userBilling.allBilling.billingInfo.subscriptions.status == "SUSPENDED" ?
                            <input type='submit' className='font-14 btn submit-button btn-primary' value={translation["Subscription"]["ReactivateSubscription"]} onClick={showModal} />
                            : null

                    }    
                       


                    </div>
                </div>
            </> : null }
            
            {userBilling.allBilling.billingInfo.subscriptions.status != "CANCELLED" && 
            <div>
                <div className="header billing">
                    <p>{translation["PageHeaderText"]}</p>                
                    <p className='billing-info'>{translation["PageSubHeaderText"]}</p>
                </div>
                <div>
                
                    <div className='text-center mb-30'>
                        <div><p className='subscription-header'>{translation["Subscription"]["SubscriptionSubHeaderText"]}</p></div>
                        
                    </div>
                </div>
            </div>
            
            }
            {userBilling.allBilling.billingInfo.subscriptions.status == "CANCELLED" && userBilling.allBilling.paymentSettings != null ?
            <div>
                {(userBilling.allBilling.paymentSettings.monthly.trialDays != 0 && userBilling.allBilling.paymentSettings.annual.trialDays != 0 ) ? 
                <div className='history-note mb-42 mt-36 font-16'>
                {monthly && userBilling.allBilling.paymentSettings.monthly.trialDays != 0 ?
                    <p className='d-flex'>
                    <div>
                        <Image className='info-icon' src='/images/info-icon.svg' width={16} height={16} alt='info'></Image>
                    </div>
                    <div>
                        Your {userBilling.allBilling.paymentSettings.monthly.trialDays}-day free trial starts once you subscribe through Paypal. You will not be charged at this point, but at the end of your trial period, you will be automatically charged until you cancel. You can cancel your subscription anytime, either in your WriteText.ai billing settings or directly in your Paypal account. See our FAQ page for more information.
                    </div>
                </p>
                : null
                }
                {!monthly && userBilling.allBilling.paymentSettings.annual.trialDays != 0 ? 
                
                <p className='d-flex'>
                    <div>
                        <Image className='info-icon' src='/images/info-icon.svg' width={16} height={16} alt='info'></Image>
                    </div>
                    <div>
                        Your {userBilling.allBilling.paymentSettings.annual.trialDays}-day free trial starts once you subscribe through Paypal. You will not be charged at this point, but at the end of your trial period, you will be automatically charged until you cancel. You can cancel your subscription anytime, either in your WriteText.ai billing settings or directly in your Paypal account. See our FAQ page for more information.
                    </div>
                </p>
                : null
                }
                </div>
                : null}
            
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
                                <p className='subscription-price'>{formatNumber(userBilling.allBilling.paymentSettings.monthly.credits)} credits</p>
                                <p className='subscription-price-divider ml-20 mr-20 mb-0'>|</p>
                                <p className='subscription-price'>{formatMoney(userBilling.allBilling.paymentSettings.monthly.price)} {userBilling.allBilling.paymentSettings.monthly.currency}{userBilling.allBilling.paymentSettings.monthly.exclusiveTax && `*`} / month</p>
                            </> 
                            :
                            <>
                                <p className='subscription-price'>{formatNumber(userBilling.allBilling.paymentSettings.annual.credits)} credits</p> 
                                <p className='subscription-price-divider ml-20 mr-20 mb-0'>|</p>  
                                <p className='subscription-price'>{formatMoney(userBilling.allBilling.paymentSettings.annual.price)} {userBilling.allBilling.paymentSettings.annual.currency}{userBilling.allBilling.paymentSettings.annual.exclusiveTax && `*`} / year</p>
                                {userBilling.allBilling.paymentSettings.annual.discount != null && 
                                <p className='subscription-price-off'>{userBilling.allBilling.paymentSettings.annual.discount}% OFF</p>}
                            </> 
                        }
                    </div>
                    {monthly && userBilling.allBilling.paymentSettings.monthly.exclusiveTax &&
                    <div className='subscription-tax-text'><p>*exclusive of tax</p></div>}
                    
                    {!monthly && userBilling.allBilling.paymentSettings.annual.exclusiveTax &&
                        <div className='subscription-tax-text'><p>*exclusive of tax</p></div>}
                </div>
                <div>
                <PayPalScriptProvider
                    options={{
                        "client-id": userBilling.allBilling.paymentSettings.clientId,
                        components: "buttons",
                        intent: "subscription",
                        vault: true
                    }}
                >    
                        <ButtonWrapper type="subscription" subscription_id={monthly ? userBilling.allBilling.paymentSettings.monthly.planId : userBilling.allBilling.paymentSettings.annual.planId} amount={monthly ? userBilling.allBilling.paymentSettings.monthly.price : userBilling.allBilling.paymentSettings.annual.price} subscriptionMessage={setSubscriptionMessage} isMonthly={monthly ? true : false}/>
                </PayPalScriptProvider> 
                </div>
            </div>
        </div>
             : 
             <form>
                
                <div>
                    <p className='font-16 mb-14 sub-p'>Billing details (From PayPal)</p>
                </div>

                <div className="form-group d-flex bd-highlight">
                    <div className="form-floating mr-14 w-100">
                        <input id="firstName" className="form-control" type="text" placeholder='First name' value={userBilling.allBilling.billingInfo.firstName} disabled/>
                        <label htmlFor="firstName">First name</label>
                    </div>
                    <div className="form-floating w-100">
                        <input id="lastName" className="form-control" type="text" placeholder="Last name" value={userBilling.allBilling.billingInfo.lastName} disabled/>
                        <label htmlFor="lastName">Last name</label>
                    </div>
                </div>
                <div className="form-group d-flex bd-highlight">
                    <div className="form-floating w-100">
                    <input id="streetAddress" className="form-control" type="text" placeholder='Street address' value={userBilling.allBilling.billingInfo.line1 === null ? '' : userBilling.allBilling.billingInfo.line1} disabled/>
                                <label htmlFor="streetAddress">Street address</label>
                    </div>
                </div>
                
                <div className="form-group d-flex bd-highlight">
                    <div className="form-floating w-100">
                        <input id="streetAddress_two" className ="form-control" type="text" placeholder='Street address' value={userBilling.allBilling.billingInfo.line2 === null ? '' : userBilling.allBilling.billingInfo.line2} disabled/>
                            <label htmlFor="streetAddress_two">Street address</label>
                    </div>
                </div>
                <div className="form-group d-flex bd-highlight">
                    <div className="form-floating mr-14 w-100 req">
                        <input id='country' className='form-control' placeholder='Country' value={userBilling.allBilling.billingInfo.country.name} disabled></input>
                        <label htmlFor="country">Country</label>
                    </div>
                    <div className="form-floating w-100">
                        
                        <input id='state' className='form-control' placeholder='State' value={userBilling.allBilling.billingInfo.state.name} disabled></input>
                        <label htmlFor="state">State</label>
                    </div>
                </div>
                <div className="form-group d-flex bd-highlight">
                    <div className="form-floating mr-14 w-100 req">
                        
                    <input id='city' className='form-control' placeholder='City' value={userBilling.allBilling.billingInfo.city.name} disabled></input>
                        <label htmlFor="city">City</label>
                    </div>
                    <div className="form-floating w-100">
                        <input id="zipCode" className="form-control" type="text" placeholder='Zip code' value={userBilling.allBilling.billingInfo.postalCode} disabled/>
                        <label htmlFor="zipCode">Zip code</label>
                    </div>
                </div>
            </form>
             }
            
            
            </div>
          </Content>
        </Body>
        
    </>
  )
}
