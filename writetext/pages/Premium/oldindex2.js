import React, {useEffect, useState,useRef} from 'react'
import { useRouter } from 'next/router' 
import axios from 'axios'
import Link from 'next/link'
import Image from 'next/image'
import Body from '../../components/Body'
import Content from '../../components/Content'
import { setAuthHeader } from '../../utils/axiosHeader'
import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';

import ModalDialog from '../../components/Modal'
import ModalUpdateAccount from '../../components/ModalUpdateAccount'
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

    const [paymentGateway, setPaymentGateway] = useState('')
    const inputRef = useRef(null);

    const [subscriptionStatus, setSubscriptionStatus] = useState('')
    
    const [buyCreditsOpened, setBuyCreditsOpened] = useState(false)
    const [paddleProduct, setPaddleProduct] = useState("")

    const [newUserData, setNewUserData] = useState(userData)
    const [accountUpdated, setAccountUpdated] = useState(false)

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
            await axios.get(`${AppSettings.API_URL}/Account/All?GetAccount=true&GetCredit=true&GetCreditPlans=true&GetPaymentSettings=true&GetBillingInfo=true&GetInstallationPlan=true&Gateway=Paddle`,{ httpsAgent } ).then(usr => {
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

                    
                    if (usr.data.allBilling.paddlePaymentSettings == null)
                    {
                        setTimeout(() => {
                            
                        buyCredits()
                        }, 800);
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
    useEffect(()=>{
        if (subscriptionType === SubscriptionTypeEnum.PREPAID)
        {
            var creditElement = document.getElementById('creditCost0')
            if (creditElement)
                creditElement.click()
        }
    },[subscriptionType])
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
        const myModals = new Modal("#credits")

        myModals.show()
    }
    const memberType = () => {
        return userData.credit.membershipType
    }
if (translation && userBilling && userData)
  return (
    <>
    
        <Body>
          <Content>
          {userBilling.allBilling.billingInfo.subscriptions != null ? 
            <ModalDialog userData={userBilling} target="suspend" type="suspendsubscription" click={cancelSubscription} userCredits={credits} MemberTypeEnum={MemberTypeEnum}/> : null}
          
            <ModalUpdateAccount userData={userData} setdata={setNewUserData} setAccountUpdated={setAccountUpdated} modalref={modalRef}></ModalUpdateAccount>
            <ModalDialog target="credits" type="credits" hasSubscription={hasSubscription} modalref={modalRef} userData={userData} opened={buyCreditsOpened}/>
            <div className='container'>
                <div className="header">
                    <p className='mb-30'>Plans & Credits</p>
                </div>
                {subscriptionStatus.toUpperCase() == SubscriptionStatusEnum.ACTIVE && paymentGateway.toUpperCase() == GateWayTypeEnum.SHOPIFY ? 
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
                                    
                                    <div className="sub-status d-flex">
                                       
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
                {userBilling.allBilling.paddlePaymentSettings != null &&
                    <>
                    
                    
                    {(userBilling.allBilling.billingInfo.shopifyPaymentUrl != null) && 
                    <div className='subscription-note d-flex mb-14 mt-36 font-16'>
                    <Image className='info-icon-subscription' src='/images/ic_info_red.svg' width={20} height={20} alt='info'></Image>
                    <p>Purchasing credits or a subscription within our platform is disabled because you have at least one (1) Shopify store connected.<br/><br/>In compliance with Shopify&apos;s app store Terms, you can only make a purchase for our Shopify app in the <Link href={userBilling.allBilling.billingInfo.shopifyPaymentUrl == null ? '' : userBilling.allBilling.billingInfo.shopifyPaymentUrl} target='_blank'>Shopify dashboard</Link>. This applies to purchases for credits or a subscription that will also be used in Magento and WooCommerce shops (if you have any). This is because WriteText.ai shares all credits in your account among all your webshops (if you have multiple shops connected).</p>
                    </div>}
                    
                        <>
                            <div className={`subscription-tab billing d-flex center mb-15 ${userBilling.allBilling.billingInfo.shopifyPaymentUrl != null ? 'disabled' : ''}`}>
                                {(userBilling.credit.membershipType != MemberTypeEnum.SUBSCRIBER || userBilling.allBilling.billingInfo.subscriptions.status == `CANCELLED` || paymentGateway.toUpperCase() == GateWayTypeEnum.SHOPIFY) &&
                                <>
                                <span className={`${subscriptionType == SubscriptionTypeEnum.PREPAID ? `subscription-active` : ``} menu-border-right`}><a className='m40 mb-0 mt-0' onClick={() => setSubscriptionType(SubscriptionTypeEnum.PREPAID)}>Pay-as-you-go</a></span>
                                <span className={`${subscriptionType == SubscriptionTypeEnum.MONTHLY ? `subscription-active` : ``} menu-border-right`}><a className='m40 mb-0 mt-0' onClick={() => setSubscriptionType(SubscriptionTypeEnum.MONTHLY)}>Monthly subscription</a></span>
                                <span className={`${subscriptionType == SubscriptionTypeEnum.ANNUAL ? `subscription-active` : ``}`}><a className='m40 mb-0 mt-0' onClick={() => setSubscriptionType(SubscriptionTypeEnum.ANNUAL)}>Annual subscription</a></span>
                                </>
                                }
                            </div>
                            <div className='subscription-wizard-container' style={{padding: '30px'}}>
                                <div>
                                    {subscriptionType == SubscriptionTypeEnum.PREPAID &&
                                    <>
                                    
                                    <div>
                                        {(userBilling.credit.membershipType != MemberTypeEnum.SUBSCRIBER) && <p className='subscription-note-buy-credits'>If you&apos;re a power user, you can get up to 16% discount by subscribing to our monthly or annual plan compared to pay-as-you-go. You also get extra 110 credits (for monthly subscription) or 1,320 credits (for annual subscription).</p>}
                                        {(userBilling.credit.membershipType == MemberTypeEnum.SUBSCRIBER) && <p className='subscription-note-buy-credits'>These prices are 25% off our normal credit prices because you have a subscription.</p>}

                                    </div>
                                    </>
                                    }
                                    {subscriptionType == SubscriptionTypeEnum.MONTHLY && userBilling.allBilling.paddlePaymentSettings != null && 
                                    <>
                                        <div className='d-flex'>
                                            <div>
                                                <div><p className='subscription-header'>Subscription details</p></div>
                                                {subscriptionType != SubscriptionTypeEnum.PREPAID &&
                                                <div>
                                                    <p className='subscription-note-buy-monthly'><Image src='/images/ic_pricing_check.svg' width={18} height={18} alt='check'></Image>Get 110 credits / month</p> 
                                                    <p className='subscription-note-buy-monthly'><Image src='/images/ic_pricing_check.svg' width={18} height={18} alt='check'></Image>Get all Free & Premium features</p> 
                                                    <p className='subscription-note-buy-monthly'><Image src='/images/ic_pricing_check.svg' width={18} height={18} alt='check'></Image>Savings of up to 16% compared to pay-as-you-go</p> 
                                                    <p className='subscription-note-buy-monthly'><Image src='/images/ic_pricing_check.svg' width={18} height={18} alt='check'></Image>Ability to purchase the 5,000-credit bundle</p>
                                                    <p className='subscription-note-buy-monthly'><Image src='/images/ic_pricing_check.svg' width={18} height={18} alt='check'></Image>Perfect for consistent daily/weekly usage</p>  
                                                </div>
                                                }
                                            </div>  
                                           
                                        <div className='billing ms-auto d-flex flex-column'>
                                            {/* <p className='subscription-price'>{formatNumber(userBilling.allBilling.paddlePaymentSettings.monthly.credits)} credits</p> */}
                                            {/* <p className='subscription-price-divider ml-20 mr-20 mb-0'>|</p> */}
                                            <div>
                                                <p className='subscription-price'>{userBilling.allBilling.paddlePaymentSettings.monthly.currency} {formatMoney(userBilling.allBilling.paddlePaymentSettings.monthly.price)} {userBilling.allBilling.paddlePaymentSettings.monthly.exclusiveTax && `*`} / month</p>
                                                <p className='premium-tax-info'>exclusive of applicable taxes</p>
                                            </div>
                                            <div className='mt-auto'>
                                                <PaddleButton userData={userBilling} newUserData={newUserData}  type={"subscription"} isAnnual={false} productId={paddleProduct} planId={""} credits={0} accountUpdated={accountUpdated} disabled={(subscriptionStatus.toUpperCase() == SubscriptionStatusEnum.ACTIVE && paymentGateway.toUpperCase() == GateWayTypeEnum.SHOPIFY) ? true : userBilling.allBilling.billingInfo.shopifyPaymentUrl != null ? true : false}/>                                           
                                            </div>
                                            {/* <p className='subscription-price-divider ml-20 mr-20 mb-0'>|</p>  
                                            <p className='subscription-price'>Unlocks premium</p>  */}
                                        </div> 
                                        </div>
                                        
                                    </>
                                    }
                                    
                                    {subscriptionType == SubscriptionTypeEnum.ANNUAL &&  userBilling.allBilling.paddlePaymentSettings != null && 
                                    <>
                                    <div className='d-flex'>
                                        <div>
                                            <div><p className='subscription-header'>Subscription details</p></div>
                                            
                                            {subscriptionType != SubscriptionTypeEnum.PREPAID &&
                                            <>
                                            <div>
                                                <p className='subscription-note-buy-monthly'><Image src='/images/ic_pricing_check.svg' width={18} height={18} alt='check'></Image>Get 1,320 credits / year</p> 
                                                <p className='subscription-note-buy-monthly'><Image src='/images/ic_pricing_check.svg' width={18} height={18} alt='check'></Image>Get all Free & Premium features</p> 
                                                <p className='subscription-note-buy-monthly'><Image src='/images/ic_pricing_check.svg' width={18} height={18} alt='check'></Image>Savings of up to 16% compared to pay-as-you-go</p> 
                                                <p className='subscription-note-buy-monthly'><Image src='/images/ic_pricing_check.svg' width={18} height={18} alt='check'></Image>Ability to purchase the 5,000-credit bundle</p>
                                                <p className='subscription-note-buy-monthly'><Image src='/images/ic_pricing_check.svg' width={18} height={18} alt='check'></Image>Perfect for consistent daily/weekly usage</p>  
                                            </div>
                                            </>
                                            }
                                        </div>
                                        
                                        <div className='billing ms-auto d-flex flex-column'>
                                            {userBilling.allBilling.paddlePaymentSettings.annual.discount != null && 
                                            <p className='subscription-price-off'>{userBilling.allBilling.paddlePaymentSettings.annual.discount}% savings vs monthly</p>}
                                            <div>
                                                <p className='subscription-price'>{userBilling.allBilling.paddlePaymentSettings.annual.currency} {formatMoney(userBilling.allBilling.paddlePaymentSettings.annual.price)} {userBilling.allBilling.paddlePaymentSettings.annual.exclusiveTax && `*`} / year</p>                           
                                                <p className='premium-tax-info'>exclusive of applicable taxes</p>
                                            </div>
                                            <div className='mt-auto'>
                                                    <PaddleButton userData={userBilling} newUserData={newUserData}  type={"subscription"} isAnnual={true} productId={paddleProduct} planId={""} credits={0} accountUpdated={accountUpdated} disabled={(subscriptionStatus.toUpperCase() == SubscriptionStatusEnum.ACTIVE && paymentGateway.toUpperCase() == GateWayTypeEnum.SHOPIFY) ? true : userBilling.allBilling.billingInfo.shopifyPaymentUrl != null ? true : false}/>
                                                
                                            </div>
                                        </div>
                                    </div>
                                        
                                    </>

                                    }
                                    {subscriptionType == 1 && userBilling.allBilling.paddlePaymentSettings != null && userBilling.allBilling.paddlePaymentSettings.monthly.exclusiveTax &&
                                    <div className='subscription-tax-text'><p>*exclusive of tax</p></div>}
                                    
                                    {subscriptionType == 2 && userBilling.allBilling.paddlePaymentSettings != null && userBilling.allBilling.paddlePaymentSettings.annual.exclusiveTax &&
                                        <div className='subscription-tax-text'><p>*exclusive of tax</p></div>}
                                </div>
                                <div>
                                    {subscriptionType == 0 && userBilling.allBilling.creditPlans != null &&
                                    userBilling.allBilling.creditPlans.map((plan, index) => (
                                    <div key={index}>
                                        <div className={`credit-container ${index != 2 ? 'mb-20' : 'mb-10'} ${index == 2 && hasSubscription ? 'mb-20' : ''} ${(index == 2 && (!hasSubscription || subscriptionStatus.toUpperCase() != SubscriptionStatusEnum.ACTIVE)) ? 'disabled' : ''}`}>
                                            <div className={`credit-selection ${(index == 2 && (!hasSubscription || subscriptionStatus.toUpperCase() != SubscriptionStatusEnum.ACTIVE)) ? 'disabled' : ''} ${userBilling.allBilling.billingInfo.shopifyPaymentUrl != null ? 'disabled' : ''}`}>
                                                <div>
                                                    <label className="form-check-label d-flex" htmlFor={`creditCost` + index}>
                                                    <input {...(plan.bestOffer ? {ref: inputRef} : {})} className={`form-check-input ${plan.bestOffer ? `best-offer` : ``}`} type="radio" name="creditCost" id={`creditCost` + index} onChange={e => handleCreditsSub(e)} value={plan.amount} disabled={index == 2 ? (!hasSubscription || subscriptionStatus.toUpperCase() != SubscriptionStatusEnum.ACTIVE || userBilling.allBilling.billingInfo.shopifyPaymentUrl != null) : userBilling.allBilling.billingInfo.shopifyPaymentUrl != null}/>
                                                        <span className='mt-auto mb-auto'>
                                                        <span>{formatNumber(plan.textDisplayCredits)}{subscriptionStatus.toUpperCase() != SubscriptionStatusEnum.ACTIVE && " | Unlocks premium"} </span>
                                                        
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
                                    {subscriptionStatus.toUpperCase() != SubscriptionStatusEnum.ACTIVE && subscriptionType == 0 &&
                                        <div className='d-flex'>
                                            <p className='credit-purchase-note mb-15'>Purchasing 5,000 credits is exclusive to active monthly or annual subscribers.</p>
                                        </div>
                                    }
                                    {userBilling.allBilling.billingInfo.shopifyPaymentUrl != null && subscriptionType == 0 &&
                                      <PaddleButton  userData={userBilling} newUserData={newUserData}  type={"credits"} isAnnual={false} productId={paddleProduct} planId="credit200" credits="200" accountUpdated={accountUpdated} disabled={true} />

                                    }
                                    {subscriptionType == 0 && planId != "" && paddleProduct != "" && userBilling.allBilling.paddlePaymentSettings != null &&
                                         //<PaddleBuyCreditButton key={subscriptionType} userData={userBilling} productId={paddleProduct} planId={planId}/>
                                        <PaddleButton  userData={userBilling} newUserData={newUserData}  type={"credits"} isAnnual={false} productId={paddleProduct} planId={planId} credits={userBilling.allBilling.creditPlans.filter(x=>x.id == planId)[0].credits} accountUpdated={accountUpdated} disabled={userBilling.allBilling.billingInfo.shopifyPaymentUrl != null}/>
                                    }
                                </div>
                            </div>
                        </>
                        
                    </>
                    
                }
                
        </div>
            </div>
          </Content>
        </Body>
        
    </>
  )
}
