import React, {useEffect, useState,useRef} from 'react'
import { useRouter } from 'next/router' 
import axios from 'axios'
import Image from 'next/image'
import Body from '../../components/Body'
import Content from '../../components/Content'
import { setAuthHeader } from '../../utils/axiosHeader'
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';

import ModalDialog from '../../components/Modal'
import t from '../../public/translation/locale'
import { GateWayTypeEnum, MemberTypeEnum, SubscriptionStatusEnum, SubscriptionTypeEnum } from '../../enum/MemberType'

import PaddleButton from '../../components/Paddle/PaddleButton'

import apiService from '../../services/ApiService'

export default function Premium ({userData}){
    const router = useRouter()
    
  const modalRef = useRef()


    const https = require("https")
    const httpsAgent = new https.Agent({ rejectUnauthorized: false })
    
    const [credits, setCredits] = useState(null)
    const [subscriptionMessage, setSubscriptionMessage] = useState(null)
    const [userBilling, setUserBilling] = useState(null)
    const [translation, setTranslation] = useState(null)
    const [monthly, setMonthly] = useState(true)
    const [subscriptionType, setSubscriptionType] = useState(0)

    const [planId, setPlanId] = useState("")
    const AppSettings = require('../../settings/AppSetting').default
    const [hasSubscription, setHasSubscription] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [showAllCreditsPremium, setShowAllCreditsPremium] = useState(false)
    const [showAllCreditsPrePaid, setShowAllCreditsPrePaid] = useState(false)

    const [paymentGateway, setPaymentGateway] = useState(null)
    const inputRef = useRef(null);

    const [subscriptionStatus, setSubscriptionStatus] = useState('')
    
    const [buyCreditsOpened, setBuyCreditsOpened] = useState(false)
    const [paddleProduct, setPaddleProduct] = useState("")

    let paddlePlan
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
    function formatMoney(number){
        return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    }
    function showModal() {
        const { Modal } = require("bootstrap")
        const myModals = new Modal("#suspend");
        myModals.show()
      }
      const styles = {
       overflow: 'scroll'
      };
      
    function cancelSubscription(){
        if (paymentGateway.toUpperCase() == GateWayTypeEnum.PAYPAL)
        {
            const httpsAgent = new https.Agent({ rejectUnauthorized: false });
            axios.post(`${AppSettings.API_URL}/Billing/subscription/${userBilling.allBilling.billingInfo.subscriptionId}/suspend`, { httpsAgent }).then(res => {
                
                //router.reload(window.location.pathname)
                window.location.assign(`/cancellationsurvey`);
            })}
        else
        {
            const httpsAgent = new https.Agent({ rejectUnauthorized: false });
            axios.post(`${AppSettings.API_URL}/Billing/subscription/${userBilling.allBilling.billingInfo.subscriptionId}/paddle/suspend`, { httpsAgent }).then(res => {
                
                //router.reload(window.location.pathname)
                window.location.assign(`/cancellationsurvey`);
            })}
    }
    useEffect(() => {
        async function Init(){
            const locale = navigator.language.substring(0,2); 
            setTranslation(t[locale] != undefined ? t[locale].Content["Subscription"] : t["en"].Content["Subscription"])
            await axios.get(`${AppSettings.API_URL}/Account/All?GetAccount=true&GetCredit=true&GetCreditPlans=true&GetPaymentSettings=true&GetBillingInfo=true&GetInstallationPlan=true&Gateway=PayPal`,{ httpsAgent } ).then(usr => {
                setIsLoading(false)
                
                setUserBilling(usr.data)
                
                if (usr.data.allBilling.billingInfo.billingInfoId !== "00000000-0000-0000-0000-000000000000")
                {
                    setHasSubscription(true)
                    switch(usr.data.allBilling.billingInfo.subscriptions.status)
                    {
                        case SubscriptionStatusEnum.ACTIVE:
                            setSubscriptionStatus('Active');
                            break;
                        case SubscriptionStatusEnum.CANCELLED:
                            setSubscriptionStatus('Cancelled');
                            break;
                        default:
                            setSubscriptionStatus('Expired');
                            break;
                    }
                    setPaymentGateway(usr.data.allBilling.billingInfo.subscriptions.paymentGateway)
                }
                
                setTimeout(() => {
                    
                    if (typeof(document.getElementById('creditCost0')) != 'undefined' && document.getElementById('creditCost0') != null)
                    document.getElementById('creditCost0').click()
                    }, 800);

                    
                    if (usr.data.allBilling.paymentSettings == null)
                    {
                        buyCredits()
                    }
                //setPlanId(usr.data.allBilling.creditPlans[0].id)
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

    const handleCreditsSub = async (e) => {
        const elements = document.querySelectorAll('.highlight-row:not(.modal .highlight-row)');
        elements.forEach((element) => {
            element.classList.remove('highlight-row');
        });
        e.currentTarget.parentElement.parentElement.parentElement.parentElement.classList.add('highlight-row')
        setPlanId(userBilling.allBilling.creditPlans.filter(x => x.amount == e.target.defaultValue)[0].id)
        
        const paddleProducts = await apiService.get(`${AppSettings.API_URL}/Paddle/products/creditPlans`)
        //const paddleProductPlanId = await apiService.post(`${AppSettings.API_URL}/Paddle/pricing?planId=${planId}&productId=${paddleProducts.data[0].id}`)
        const paddleProduct = paddleProducts.data.data
        
        setPaddleProduct(paddleProduct[0].id)
        
    }
    const buyCredits = async () => {
        setBuyCreditsOpened(true)
        const { Modal } = require("bootstrap")
        const myModals = new Modal("#credits");
        myModals.show()
      }
if (translation && userBilling && userData)
  return (
    <>
    
        <Body>
          <Content>
          {userBilling.allBilling.billingInfo.subscriptions != null ? 
          <ModalDialog userData={userBilling} target="suspend" type="suspendsubscription" click={cancelSubscription} userCredits={credits} MemberTypeEnum={MemberTypeEnum}/> : null}
          
          <ModalDialog target="credits" type="credits" hasSubscription={hasSubscription} modalref={modalRef} userData={userData} opened={buyCreditsOpened}/>
            <div className='container'>
                <div className="header">
                    <p>{userBilling.credit.membershipType != MemberTypeEnum.FREE > 0 ? "Premium" : "Unlock Premium"}</p>
                </div>
                {paymentGateway.toUpperCase() == GateWayTypeEnum.SHOPIFY ? 
                    <div className='shopify-note mb-14 mt-36 font-16'>
                        <Image className='info-icon' src='/images/info-icon.svg' width={16} height={16} alt='info'></Image>
                        <p>Your subscription should be managed through your Shopify account, where your subscription was originally initiated and payments are processed. To cancel your subscription, kindly log in to your Shopify account.</p>
                    </div>
                : null}
                {userBilling.credit.membershipType == MemberTypeEnum.FREE &&
                    <div className='subscription-container d-flex'>
                        <div className='subscription-info'>
                            <div className='d-flex'>
                                <p className='font-16 mb-8 sub-p mr-8 free-note'>Free version | {userBilling.credit.recurringCredits} credits per month</p>
                            </div>
                            {userBilling.credit.freeCredits.length > 0 &&
                            <div className='subscription-details'>
                                <p className='m0'>{userBilling.credit.freeCredits[0].amount}/{userBilling.credit.freeCredits[0].startingAmount} credits remaining. Resets on {formatDate(userBilling.credit.freeCredits[0].expiryDate)}.</p>
                            </div>  
                            }
                            
                        </div>
                    </div>
                }
                {userBilling.credit.membershipType == MemberTypeEnum.SUBSCRIBER &&
                <>
                    <div className='subscription-container d-flex'>
                        <div className='subscription-info' >
                            <div className='d-flex'>
                                <p className='font-16 mb-8 sub-p mr-8 d-flex free-note'>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                        <path d="M1.83643 13.1668H15.1698V14.5002H1.83643V13.1668ZM1.83643 3.8335L5.16976 5.8335L8.50309 1.8335L11.8364 5.8335L15.1698 3.8335V11.8335H1.83643V3.8335Z" fill="#00376D"/>
                                    </svg>
                                    {(subscriptionStatus.toUpperCase() == SubscriptionStatusEnum.ACTIVE || subscriptionStatus.toUpperCase() == SubscriptionStatusEnum.CANCELLED) &&
                                    <p className='mb-0 ml-6 mr-5 premium-note'>Premium | {userBilling.credit.isAnnual ? 'Annual' : 'Monthly'} subscription</p>
                                    }
                                    {subscriptionStatus.toUpperCase() == SubscriptionStatusEnum.EXPIRED &&
                                    <p className='mb-0 ml-6 mr-5 premium-note'>Premium</p>
                                    }
                                    
                                    <div class="sub-status d-flex">
                                       
                                    {userBilling.allBilling.billingInfo.subscriptions != null ?
                                        <>
                                            <p className={`${subscriptionStatus.toLowerCase()}`}>{subscriptionStatus}</p>
                                            {userBilling.allBilling.billingInfo.subscriptions.lastAmountPaid.toUpperCase() == SubscriptionStatusEnum.PROCESSING && <p className='processing ml-8'>Processing</p>}
                                        </>
                                    : null}
                                    </div>
                                </p>
                            </div>
                            {subscriptionStatus.toUpperCase() != SubscriptionStatusEnum.EXPIRED &&
                            <div>
                                <p className='sub-header'>Subscription  {subscriptionStatus.toUpperCase() == SubscriptionStatusEnum.ACTIVE ? 'renews' : 'ends'} on {formatDate(userBilling.credit.subscriptionExpiration)}</p>
                            </div>
                            }
                            {(subscriptionStatus.toUpperCase() == SubscriptionStatusEnum.CANCELLED || userBilling.credit.subscriptionId == null) && userBilling.credit.credits.length > 0 && 
                            <p className='expiration-note'>Premium expires at the latest date below or when all credits are used up, whichever comes first.</p>
                            }
                            
                            <div className='subscription-details'>
                          
                            {userBilling.credit.freeCredits.length > 0 && userBilling.credit.freeCredits.filter(r=>r.sourceId == "FreeCredits").length > 0 &&
                                <p className='m0 mb-8'>{userBilling.credit.freeCredits.filter(r=>r.sourceId == "FreeCredits")[0].amount}/{userBilling.credit.freeCredits.filter(r=>r.sourceId == "FreeCredits")[0].startingAmount} free credits remaining. Expires on {formatDate(userBilling.credit.freeCredits.filter(r=>r.sourceId == "FreeCredits")[0].expiryDate)}.</p>                            
                            }
                            {userBilling.credit.freeCredits.length > 0 && userBilling.credit.freeCredits.filter(r=>r.sourceId != "FreeCredits").length > 0 &&
                                <p className='m0 mb-8'>{userBilling.credit.freeCredits.filter(r=>r.sourceId != "FreeCredits")[0].amount}/{userBilling.credit.freeCredits.filter(r=>r.sourceId != "FreeCredits")[0].startingAmount} subscription credits remaining. {subscriptionStatus.toUpperCase() == SubscriptionStatusEnum.CANCELLED ? 'Expires' : 'Resets'} on {formatDate(userBilling.credit.freeCredits.filter(r=>r.sourceId != "FreeCredits")[0].expiryDate)}.</p>         
                            } 
                            {userBilling.credit.credits.slice(0, 2).map((credit, index) => (
                                <p className='m0 mb-8' key={index} index={index}>{credit.amount}/{credit.startingAmount} premium credits remaining. Expires on {formatDate(credit.expiryDate)}.</p>
                            ))}

                            {userBilling.credit.credits.length > 2 && (
                                <p className='m0 mb-8'>
                                    {showAllCreditsPremium ? (
                                        <>
                                            {userBilling.credit.credits.slice(2).map((credit, index) => (
                                                <p className='m0 mb-8' key={index + 2} index={index + 2}>{credit.amount}/{credit.startingAmount} premium credits remaining. Expires on {formatDate(credit.expiryDate)}.</p>
                                            ))}
                                            <a className='load-more' onClick={() => setShowAllCreditsPremium(false)}>Load Less...</a>
                                        </>
                                    ) : (
                                        <a className='load-more' onClick={() => setShowAllCreditsPremium(true)}>Load More...</a>
                                    )}
                                </p>
                            )}
                            
                            </div>  
                        </div>
                        <div className="button-container ml-auto mb-auto">
                    {
                            
                        // subscription.subscriptions.status != "CANCELLED" && <input type="submit" className={`font-14 btn submit-button ${subscription.subscriptions.status == "ACTIVE" ? 'subscription-button active-sub' : 'subscription-button suspended'}`} value={subscription.subscriptions.status == "ACTIVE" ? translation["Subscription"]["CancelSubscription"] : translation["Subscription"]["ReactivateSubscription"]}
                        // onClick={showModal}
                        // />

                        subscriptionStatus.toUpperCase() == SubscriptionStatusEnum.ACTIVE && (paymentGateway.toUpperCase() == GateWayTypeEnum.PAYPAL || paymentGateway.toUpperCase() == GateWayTypeEnum.PADDLE) ?
                            <input type='submit' className='font-14 btn submit-button subscription-button active-sub' value="Cancel subscription" onClick={showModal} />
                            : null

                    }    
                       


                    </div>
                    </div>
                    
                </>
                }
                {userBilling.credit.membershipType == MemberTypeEnum.PREPAID &&
                <>
                <div className='subscription-container d-flex'>
                    <div className='subscription-info' >
                        <div className='d-flex'>
                            <p className='font-16 mb-8 sub-p mr-8 d-flex free-note'>
                                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                    <path d="M1.83643 13.1668H15.1698V14.5002H1.83643V13.1668ZM1.83643 3.8335L5.16976 5.8335L8.50309 1.8335L11.8364 5.8335L15.1698 3.8335V11.8335H1.83643V3.8335Z" fill="#00376D"/>
                                </svg>
                                <p className='mb-0 ml-6 mr-5 premium-note'>Premium | Prepaid</p>
                            </p>
                        </div>
                        {userBilling.credit.subscriptionExpiration != null &&
                        <div>
                            <p className='sub-header'>Subscription ended on {formatDate(userBilling.credit.subscriptionExpiration)}</p>
                        </div>
                        }
                        {userBilling.credit.credits != null && userBilling.credit.credits.length > 0  && 
                        <p className='expiration-note'>Premium expires at the latest date below or when all credits are used up, whichever comes first.</p>
                        }
                        <div className='subscription-details'>
                        {userBilling.credit.freeCredits.length > 0 && userBilling.credit.freeCredits.filter(r=>r.sourceId == "FreeCredits").length > 0 &&
                            <p className='m0 mb-8'>{userBilling.credit.freeCredits.filter(r=>r.sourceId == "FreeCredits")[0].amount}/{userBilling.credit.freeCredits.filter(r=>r.sourceId == "FreeCredits")[0].startingAmount} free credits remaining. Expires on {formatDate(userBilling.credit.freeCredits.filter(r=>r.sourceId == "FreeCredits")[0].expiryDate)}.</p>                            
                        }
                        {userBilling.credit.freeCredits.length > 0 && userBilling.credit.freeCredits.filter(r=>r.sourceId != "FreeCredits").length > 0 &&
                            <p className='m0 mb-8'>{userBilling.credit.freeCredits.filter(r=>r.sourceId != "FreeCredits")[0].amount}/{userBilling.credit.freeCredits.filter(r=>r.sourceId != "FreeCredits")[0].startingAmount} subscription credits remaining. Resets on {formatDate(userBilling.credit.freeCredits.filter(r=>r.sourceId != "FreeCredits")[0].expiryDate)}.</p>         
                        }                   
                        {userBilling.credit.credits.slice(0, 2).map((credit, index) => (
                            <p className='m0 mb-8' key={index} index={index}>{credit.amount}/{credit.startingAmount} premium credits remaining. Expires on {formatDate(credit.expiryDate)}.</p>
                        ))}

                        {userBilling.credit.credits.length > 2 && (
                            <p className='m0 mb-8'>
                                {showAllCreditsPrePaid ? (
                                    <>
                                        {userBilling.credit.credits.slice(2).map((credit, index) => (
                                            <p className='m0 mb-8' key={index + 2} index={index + 2}>{credit.amount}/{credit.startingAmount} premium credits remaining. Expires on {formatDate(credit.expiryDate)}.</p>
                                        ))}
                                        <a className='load-more' onClick={() => setShowAllCreditsPrePaid(false)}>Load less...</a>
                                    </>
                                ) : (
                                    <a className='load-more' onClick={() => setShowAllCreditsPrePaid(true)}>Load more...</a>
                                )}
                            </p>
                        )}
                        
                        </div>  
                    </div>
                </div>
                
            </>
                }
            <div>
                {userBilling.allBilling.paymentSettings != null &&
                    <>
                    
                    {userBilling.credit.membershipType != MemberTypeEnum.SUBSCRIBER &&
                        <div class="flex-container mb-42">
                        <hr/>
                        <div className='premium-divider'>
                            {userBilling.credit.membershipType == MemberTypeEnum.FREE && 
                            <><svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 17 17" fill="none">
                                <path d="M1.83643 13.1668H15.1698V14.5002H1.83643V13.1668ZM1.83643 3.8335L5.16976 5.8335L8.50309 1.8335L11.8364 5.8335L15.1698 3.8335V11.8335H1.83643V3.8335Z" fill="#00376D"/>
                            </svg>
                            <p className='mb-0 ml-6'>Unlock Premium through any of these methods:</p></>}
                            {userBilling.credit.membershipType == MemberTypeEnum.PREPAID && 
                            <>
                            <p className='mb-0 ml-6'>Buy additional credits or save more with a subscription</p></>}
                        </div>
                        <hr/>
                        </div>
                    }
                    {(userBilling.allBilling.billingInfo.subscriptions == null && userBilling.credit.membershipType == MemberTypeEnum.SUBSCRIBER) ?
                        <></>
                        :
                        <>
                            <div className='subscription-tab billing d-flex center mb-10'>
                                {(userBilling.credit.membershipType != MemberTypeEnum.SUBSCRIBER || userBilling.allBilling.billingInfo.subscriptions.status == `CANCELLED`) &&
                                <>
                                <span className={`${subscriptionType == SubscriptionTypeEnum.PREPAID ? `subscription-active` : ``}`}><a className='m40 mb-0 mt-0' onClick={() => setSubscriptionType(SubscriptionTypeEnum.PREPAID)}>Prepaid</a></span>
                                <span className={`${subscriptionType == SubscriptionTypeEnum.MONTHLY ? `subscription-active` : ``}`}><a className='m40 mb-0 mt-0' onClick={() => setSubscriptionType(SubscriptionTypeEnum.MONTHLY)}>Monthly subscription</a></span>
                                <span className={`${subscriptionType == SubscriptionTypeEnum.ANNUAL ? `subscription-active` : ``}`}><a className='m40 mb-0 mt-0' onClick={() => setSubscriptionType(SubscriptionTypeEnum.ANNUAL)}>Annual subscription</a></span>
                                </>
                                }
                            </div>
                            <div className='subscription-wizard-container p40'>
                                <div className='mb-30'>
                                    {subscriptionType == SubscriptionTypeEnum.PREPAID &&
                                    <>
                                    
                                    <div><p className='subscription-header'>Buy credits</p></div>
                                    </>
                                    }
                                    
                                    {subscriptionType == SubscriptionTypeEnum.MONTHLY && userBilling.allBilling.paymentSettings != null && 
                                    <>
                                        <div><p className='subscription-header'>Subscription details</p></div>
                                        <div className='billing d-flex h-24 mb-24'>
                                            <p className='subscription-price'>{formatNumber(userBilling.allBilling.paymentSettings.monthly.credits)} credits</p>
                                            <p className='subscription-price-divider ml-20 mr-20 mb-0'>|</p>
                                            <p className='subscription-price'>{formatMoney(userBilling.allBilling.paymentSettings.monthly.price)} {userBilling.allBilling.paymentSettings.monthly.currency}{userBilling.allBilling.paymentSettings.monthly.exclusiveTax && `*`} / month</p>
                                            <p className='subscription-price-divider ml-20 mr-20 mb-0'>|</p>  
                                            <p className='subscription-price'>Unlocks premium</p> 
                                        </div> 
                                    </>
                                    }
                                    
                                    {subscriptionType == SubscriptionTypeEnum.ANNUAL &&  userBilling.allBilling.paymentSettings != null && 
                                    <>
                                        <div><p className='subscription-header'>Subscription details</p></div>
                                        <div className='billing d-flex h-24 mb-24'>
                                            <p className='subscription-price'>{formatNumber(userBilling.allBilling.paymentSettings.annual.credits)} credits</p> 
                                            <p className='subscription-price-divider ml-20 mr-20 mb-0'>|</p>  
                                            <p className='subscription-price'>{formatMoney(userBilling.allBilling.paymentSettings.annual.price)} {userBilling.allBilling.paymentSettings.annual.currency}{userBilling.allBilling.paymentSettings.annual.exclusiveTax && `*`} / year</p>                           
                                            {userBilling.allBilling.paymentSettings.annual.discount != null && 
                                            <p className='subscription-price-off'>{userBilling.allBilling.paymentSettings.annual.discount}% OFF</p>}
                                            <p className='subscription-price-divider ml-20 mr-20 mb-0'>|</p>  
                                            <p className='subscription-price'>Unlocks premium</p> 
                                        </div>
                                    </>

                                    }
                                    {subscriptionType == 1 && userBilling.allBilling.paymentSettings != null && userBilling.allBilling.paymentSettings.monthly.exclusiveTax &&
                                    <div className='subscription-tax-text'><p>*exclusive of tax</p></div>}
                                    
                                    {subscriptionType == 2 && userBilling.allBilling.paymentSettings != null && userBilling.allBilling.paymentSettings.annual.exclusiveTax &&
                                        <div className='subscription-tax-text'><p>*exclusive of tax</p></div>}
                                </div>
                                <div>
                                    {subscriptionType == 0 && userBilling.allBilling.creditPlans != null &&
                                    userBilling.allBilling.creditPlans.map((plan, index) => (
                                    <div key={index}>
                                        <div className={`credit-container mb-20`}>
                                            <div className={`credit-selection` }>
                                            <div>
                                                
                                                <label className="form-check-label" htmlFor={`creditCost` + index}>
                                                <input {...(plan.bestOffer ? {ref: inputRef} : {})} className={`form-check-input ${plan.bestOffer ? `best-offer` : ``}`} type="radio" name="creditCost" id={`creditCost` + index} onChange={e => handleCreditsSub(e)} value={plan.amount} disabled={index == 2 && !hasSubscription}/>
                                                {formatNumber(plan.textDisplayCredits)}{subscriptionStatus.toUpperCase() != SubscriptionStatusEnum.ACTIVE && " | Unlocks premium"}
                                                {plan.bestOffer && <Image className='ml-14' src="/images/ico_best.svg" width={65} height={25} alt='Best'></Image>}
                                                <span>{plan.textDisplayAmount}</span>
                                                </label>
                                            </div>
                                            </div>
                                        </div>
                                    </div>
                                    ))
                                    }
                                    {subscriptionType == 0 && planId != "" && paddleProduct != "" && userBilling.allBilling.paymentSettings != null &&
                                         //<PaddleBuyCreditButton key={subscriptionType} userData={userBilling} productId={paddleProduct} planId={planId}/>
                                        <PaddleButton userData={userBilling} type={"credits"} isAnnual={false} productId={paddleProduct} planId={planId}/>
                                    }
                                    {subscriptionType == 1 && userBilling.allBilling.paymentSettings != null &&
                                        //<PaddleBuySubscriptionButton key={subscriptionType} userData={userBilling} isAnnual={false}/>
                                        <PaddleButton userData={userBilling} type={"subscription"} isAnnual={false} productId={paddleProduct} planId={""}/>
                                    }
                                    {subscriptionType == 2 && 
                                        //<PaddleBuySubscriptionButton key={subscriptionType} userData={userBilling} isAnnual={true}/>
                                        <PaddleButton userData={userBilling} type={"subscription"} isAnnual={true} productId={paddleProduct} planId={""}/>
                                    }
                                </div>
                            </div>
                        </>
                    }
                        
                    </>
                    
                }
                
        </div>
            </div>
          </Content>
        </Body>
        
    </>
  )
}
