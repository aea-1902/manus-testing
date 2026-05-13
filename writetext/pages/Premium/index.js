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
import ModalEnterpriseUpgrade from '../../components/ModalEnterpriseUpgrade'
import ModalEnterpriseDowngrade from '../../components/ModalEnterpriseDowngrade'
import ModalCreditsRequired from '../../components/ModalCreditsRequired'
import ModalAllocateCredits from '../../components/ModalAllocateCredits'
import t from '../../public/translation/locale'
import { GateWayTypeEnum, MemberTypeEnum, SubscriptionStatusEnum, SubscriptionTypeEnum } from '../../enum/MemberType'
import style from '../../styles/styling/Premium.module.css'
import { Storagekeys } from '../../settings/StorageKeys'
import PaddleButton from '../../components/Paddle/PaddleButton'
import PricingCard from '../../components/PricingCard'
import { formatTrialDate, formatCreditsDisplay, parseJwt } from '../../utils/helper'
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


    const [paymentGateway, setPaymentGateway] = useState('')
    const inputRef = useRef(null);

    const [subscriptionStatus, setSubscriptionStatus] = useState('')
    
    const [buyCreditsOpened, setBuyCreditsOpened] = useState(false)
    const [paddleProduct, setPaddleProduct] = useState("")
    const [creditPaddleProduct, setCreditPaddleProduct] = useState("")

    const [newUserData, setNewUserData] = useState(userData)
    const [accountUpdated, setAccountUpdated] = useState(false)
    const [selectedCreditPlan, setSelectedCreditPlan] = useState('')
    const [selectedProPlan, setSelectedProPlan] = useState('')
    const [creditPlanId, setCreditPlanId] = useState('')
    const [subscriptionPlanId, setSubscriptionPlanId] = useState('')
    const [showLegacyBanner, setShowLegacyBanner] = useState(true)

    const [addingCredits, setAddingCredits] = useState(false)
    const [noOfCredits, setNoOfCredits] = useState(0)
    const [invoiceNumber, setInvoiceNumber] = useState('')
    const [tax, setTax] = useState("0.00")
    const [originalTax, setOriginalTax] = useState("0.00")
    const [price, setPrice] = useState("0.00")
    const [originalPrice, setOriginalPrice] = useState("0.00")
    const [showCreditsRequiredModal, setShowCreditsRequiredModal] = useState(false)
    const [showAllocateCreditsConfirmModal, setShowAllocateCreditsConfirmModal] = useState(false)
    const [hasShopifyWebshop, setHasShopifyWebshop] = useState(false)

    let paddlePlan
    function formatDate(date) {
        if (!date) return 'N/A';
        
        const d = new Date(date)
        if (isNaN(d.getTime())) return 'N/A';
        
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

    function showEnterpriseUpgradeModal() {
        const { Modal } = require("bootstrap")
        const myModals = new Modal("#enterpriseUpgrade");
        myModals.show()
    }

    function showEnterpriseDowngradeModal() {
        const { Modal } = require("bootstrap")
        const myModals = new Modal("#enterpriseDowngrade");
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
    const Init = async () => {
        getHasShopifyWebshop();
        const locale = navigator.language.substring(0,2); 
        setTranslation(t[locale] != undefined ? t[locale].Content["Subscription"] : t["en"].Content["Subscription"])
        const usr = await axios.get(`${AppSettings.API_URL}/Account/All?GetAccount=true&GetCredit=true&GetCreditPlans=true&GetPaymentSettings=true&GetBillingInfo=true&GetInstallationPlan=true&Gateway=Paddle`,{ httpsAgent });
        
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

        // Set initial selected credit plan and related data
        if (usr.data.allBilling.creditPlans && usr.data.allBilling.creditPlans.length > 0) {
            const firstPlan = usr.data.allBilling.creditPlans[0];
            setSelectedCreditPlan(firstPlan.textDisplayCredits);
            setCreditPlanId(firstPlan.id);
            
            // Get paddle product for the first plan
            try {
                const paddleProducts = await apiService.get(`${AppSettings.API_URL}/Paddle/products/creditPlans`);
                const paddleProduct = paddleProducts.data.data;
                if (paddleProduct && paddleProduct.length > 0) {
                    setCreditPaddleProduct(paddleProduct[0].id);
                    setPaddleProduct(paddleProduct[0].id); // Keep for backward compatibility
                }
            } catch (error) {
                console.error('Error fetching paddle products:', error);
            }
        }

        // Set initial selected pro plan
        if (usr.data.allBilling.paddlePaymentSettings) {
            setSelectedProPlan('Monthly');
            setSubscriptionPlanId(usr.data.allBilling.paddlePaymentSettings.monthly.planId);
        }

            
            if (usr.data.allBilling.paddlePaymentSettings == null)
            {
                setTimeout(() => {
                    
                buyCredits()
                }, 800);
            }
        //setPlanId(usr.data.allBilling.creditPlans[0].id)
        
     }

    useEffect(() => {
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
        
        // Always reset to credit-specific product when opening credits modal
        if (creditPaddleProduct) {
            setPaddleProduct(creditPaddleProduct)
        }
        
        const { Modal } = require("bootstrap")
        const myModals = new Modal("#credits")

        myModals.show()
    }
    const memberType = () => {
        return userData.credit.membershipType;
    }
    const hasProAccess = () => {
        return userData.credit.hasProAccess;
    }

    const isFreeTrial = () => {
        return userData.credit.membershipType == MemberTypeEnum.FREETRIAL;
    }
   
    const freeTrialEndDate = () => {
        return formatTrialDate(userData.credit.subscriptionExpiration)
    }

    const isLegacy = () => {
        return userData.credit.isLegacy;
    }

    const enterpriseCreditsDisplay = () => {
        const startingAmount = userData.credit.credits.find(r=>r.sourceId.includes("Enterprise"))?.startingAmount || 0;
        const amount = userData.credit.credits.find(r=>r.sourceId.includes("Enterprise"))?.amount || 0;
        return `${formatCreditsDisplay(amount)}/${formatCreditsDisplay(startingAmount)}`;
    }

    const isImpersonated = () => {
        const hasImpersonationObject = sessionStorage.getItem(Storagekeys.LoggedInAs_Key)
        if (hasImpersonationObject)
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    const addCredits = async () => {
        // Enhanced validation for noOfCredits
        const creditsValue = parseInt(noOfCredits);
        
        // Check if the value is a valid number
        if (isNaN(creditsValue)) {
            setShowCreditsRequiredModal(true)
            const { Modal } = require("bootstrap")
            const myModals = new Modal("#creditsRequired")
            myModals.show()
            return
        }
        
        // Check if the value is 0 or negative
        if (creditsValue <= 0) {
            setShowCreditsRequiredModal(true)
            const { Modal } = require("bootstrap")
            const myModals = new Modal("#creditsRequired")
            myModals.show()
            return
        }
        
        // Check if the value is within reasonable bounds (e.g., max 100,000 credits)
        if (creditsValue > 100000) {
            setShowCreditsRequiredModal(true)
            const { Modal } = require("bootstrap")
            const myModals = new Modal("#creditsRequired")
            myModals.show()
            return
        }
        
        // Show confirmation modal instead of directly calling API
        setShowAllocateCreditsConfirmModal(true)
        const { Modal } = require("bootstrap")
        const myModals = new Modal("#allocateCreditsConfirm")
        myModals.show()
    }

    const confirmAllocateCredits = async () => {
        // Final validation before API call
        const validationError = getCreditsValidationError();
        if (validationError) {
            console.error('Validation error:', validationError);
            // You could show an error message to the user here
            return;
        }
        
        setAddingCredits(true)
        
        try {
            const command = {
                CompanyId: userData.account.company.companyId,
                Credits: parseInt(noOfCredits), // Use parseInt instead of parseFloat for credits
                Amount: parseFloat(price),
                Tax: parseFloat(tax),
                InvoiceNumber: invoiceNumber || null
            };

            const response = await apiService.postAdmin(`${AppSettings.API_URL}/Enterprise/allocate`, command);
            
            if (response && response.data) {
                // Reload page after successful allocation
                window.location.reload();
            }
            
        } catch (error) {
            console.error('Failed to allocate credits:', error);
            // Handle error - could show error message to user
            // You might want to show a toast notification or error modal here
        } finally {
            setAddingCredits(false)
        }
    }
    const handleNoOfCreditsChange = (e) => {
        const value = e.target.value;
        
        // Allow only numbers and empty string
        if (!/^\d*$/.test(value)) {
            return;
        }
        
        // Prevent leading zeros (except for single zero)
        if (value.length > 1 && value.startsWith('0')) {
            return;
        }
        
        // Limit to reasonable length (6 digits max)
        if (value.length > 6) {
            return;
        }
        
        setNoOfCredits(value);
    }
    const handleTaxChange = (e) => {
        let val = e.target.value;

        // Remove anything that's not a digit or a dot
        val = val.replace(/[^\d.]/g, "");
    
        // Only one dot allowed
        const parts = val.split(".");
        if (parts.length > 2) {
          val = parts[0] + "." + parts[1];
        }
    
        // Limit to 4 decimal places
        if (parts[1]) {
          parts[1] = parts[1].substring(0, 4);
          val = parts[0] + "." + parts[1];
        }
    
        // Remove leading zeros unless it's "0." for cents
        if (!val.startsWith("0.") && val.startsWith("0")) {
          val = val.replace(/^0+/, "") || "0";
        }

        setTax(val)
    }

    const handleTaxFocus = (e) => {
        // Store the original value when focusing
        
        //format tax to number
        const taxNumber = parseFloat(tax);
        
        // Clear the input if the value is 0
        if (taxNumber === 0) {
            setOriginalTax("0.00");
            setTax("");
        }
    }

    const handleTaxBlur = (e) => {
        // If the input is empty, revert to the original value
        if (tax === "") {
            setTax(originalTax);
        }
        // If the input is 0, format it to 0.00
        else if (tax === "0") {
            setTax("0.00");
        }
        // If the input is 0 or invalid number, set to 0.00
        else {
            const taxNumber = parseFloat(tax);
            if (isNaN(taxNumber) || taxNumber === 0) {
                setTax("0.00");
            }
        }
    }

    const handleInvoiceNumberChange = (e) => {
        setInvoiceNumber(e.target.value)
    }

    const handlePriceChange = (e) => {
        let val = e.target.value;

        // Remove anything that's not a digit or a dot
        val = val.replace(/[^\d.]/g, "");
    
        // Only one dot allowed
        const parts = val.split(".");
        if (parts.length > 2) {
          val = parts[0] + "." + parts[1];
        }
    
        // Limit to 4 decimal places
        if (parts[1]) {
          parts[1] = parts[1].substring(0, 4);
          val = parts[0] + "." + parts[1];
        }
    
        // Remove leading zeros unless it's "0." for cents
        if (!val.startsWith("0.") && val.startsWith("0")) {
          val = val.replace(/^0+/, "") || "0";
        }

        setPrice(val)
    }

    const handlePriceFocus = (e) => {
        // Store the original value when focusing
        
        //format price to number
        const priceNumber = parseFloat(price);
        

        // Clear the input if the value is 0 or 0.00
        if (priceNumber === 0) {
            setOriginalPrice("0.00");
            setPrice("");
        }
    }

    const handlePriceBlur = (e) => {
        // If the input is empty, revert to the original value
        if (price === "") {
            setPrice(originalPrice);
        }
        // If the input is 0, format it to 0.00
        else if (price === "0") {
            setPrice("0.00");
        }
        // If the input is 0 or invalid number, set to 0.00
        else {
            const priceNumber = parseFloat(price);
            if (isNaN(priceNumber) || priceNumber === 0) {
                setPrice("0.00");
            }
        }
    }

    const getCreditsValidationError = () => {
        const creditsValue = parseInt(noOfCredits);
        
        // Check if the value is a valid number
        if (isNaN(creditsValue)) {
            return "Please enter a valid number of credits";
        }
        
        // Check if the value is 0 or negative
        if (creditsValue <= 0) {
            return "Number of credits must be greater than 0";
        }
        
        // Check if the value is within reasonable bounds
        if (creditsValue > 100000) {
            return "Number of credits cannot exceed 100,000";
        }
        
        return null;
    }

    const invalidInputs = () => {
        return getCreditsValidationError() !== null;
    }

    const movedToStarter = () => {
        return userData.credit.hasMovedToStarter;
    }

    const setMovedToStarter = async () => {
        await apiService.post(`${AppSettings.API_URL}/Account/SetHasMovedToStartedToFalse`);
    }

    const upgradeToEnterprise = async () => {
        try {
            var command = { CompanyId: userData.account.company.companyId };
            const response = await apiService.postAdmin(`${AppSettings.API_URL}/Enterprise/upgrade`, command);
            return response;
        } catch (error) {
            console.error('Error upgrading to enterprise:', error);
            throw error;
        }
    }

    // Helper function to check if there are any credits to display
    const hasCreditsToDisplay = () => {
        if (!userBilling || !userBilling.credit) return false;
        
        const { credit } = userBilling;
        
        // Check for free credits (FreeTrial, FreeCredits, or other subscription credits)
        const hasFreeCredits = credit.freeCredits && credit.freeCredits.length > 0;
        
        // Check for regular credits
        const hasRegularCredits = credit.credits && credit.credits.length > 0;
        
        // For Enterprise, also check if there are allocated credits
        const hasEnterpriseCredits = memberType() === MemberTypeEnum.ENTERPRISE && 
            credit.credits && credit.credits.find(r => r.sourceId.includes("Enterprise"));
        
        return hasFreeCredits || hasRegularCredits || hasEnterpriseCredits;
    }

    // Helper function to merge credits by expiration date and credit type
    const getMergedCreditsByExpiry = () => {
        if (!userBilling || !userBilling.credit) return [];
        
        const { credit } = userBilling;
        const allCredits = [];
        
        // Add free credits to the array
        if (credit.freeCredits && credit.freeCredits.length > 0) {
            allCredits.push(...credit.freeCredits);
        }
        
        // Add regular credits to the array
        if (credit.credits && credit.credits.length > 0) {
            allCredits.push(...credit.credits);
        }
        
        // Group credits by expiration date AND credit type
        const creditsByExpiryAndType = {};
        
        allCredits.forEach(creditItem => {
            const expiryDate = creditItem.expiryDate;
            const expiryKey = expiryDate ? new Date(expiryDate).toDateString() : 'no-expiry';
            
            // Determine credit type
            const isEnterprise = creditItem.sourceId && creditItem.sourceId.includes("Enterprise");
            const isFreeTrial = creditItem.sourceId === "FreeTrial";
            const isFreeCredits = creditItem.sourceId === "FreeCredits";
            const isSubscriptionCredits = creditItem.sourceId && 
                !creditItem.sourceId.includes("Enterprise") && 
                !creditItem.sourceId.includes("FreeCredits") && 
                !creditItem.sourceId.includes("FreeTrial") && 
                !creditItem.sourceId.toLowerCase().includes("shopify") && 
                !creditItem.sourceId.toLowerCase().includes("paddle");
            
            // Create a unique key that combines expiry date and credit type
            let typeKey = '';
            if (isEnterprise) typeKey = 'enterprise';
            else if (isFreeTrial) typeKey = 'freetrial';
            else if (isFreeCredits) typeKey = 'freecredits';
            else if (isSubscriptionCredits) typeKey = 'subscription';
            else typeKey = 'other';
            
            const combinedKey = `${expiryKey}-${typeKey}`;
            
            if (!creditsByExpiryAndType[combinedKey]) {
                creditsByExpiryAndType[combinedKey] = {
                    expiryDate: creditItem.expiryDate,
                    totalAmount: 0,
                    totalStartingAmount: 0,
                    creditTypes: [],
                    isEnterprise: isEnterprise,
                    isFreeTrial: isFreeTrial,
                    isFreeCredits: isFreeCredits,
                    isSubscriptionCredits: isSubscriptionCredits
                };
            }
            
            creditsByExpiryAndType[combinedKey].totalAmount += creditItem.amount || 0;
            creditsByExpiryAndType[combinedKey].totalStartingAmount += creditItem.startingAmount || 0;
            creditsByExpiryAndType[combinedKey].creditTypes.push(creditItem.sourceId);
        });
        
        // Convert to array and sort by expiry date
        const mergedCredits = Object.values(creditsByExpiryAndType).sort((a, b) => {
            if (!a.expiryDate && !b.expiryDate) return 0;
            if (!a.expiryDate) return 1;
            if (!b.expiryDate) return -1;
            return new Date(a.expiryDate) - new Date(b.expiryDate);
        });
        
        return mergedCredits;
    }
    const isLegacyBanner = () => {
        return userData.credit.isLegacyBanner;
    }
    const handleCloseLegacyBanner = () => {
        setShowLegacyBanner(false);
        apiService.post(`${AppSettings.API_URL}/Account/SetLegacyBannerToFalse`);
    }

    const getHasShopifyWebshop = async () => {
        const response = await apiService.get(`${AppSettings.API_URL}/Webshop/GetWebshopURLs`);
        const webshops = response.data.filter(w => w.platform.toLowerCase() == 'shopify');
        setHasShopifyWebshop(webshops.length > 0);
    }

    const activeShopifySubscription = () => {
        const hasShopifySubscription = paymentGateway.toUpperCase() == GateWayTypeEnum.SHOPIFY;
        const isactive = subscriptionStatus.toUpperCase() == SubscriptionStatusEnum.ACTIVE;
        return hasShopifySubscription === true && isactive === true;
    }
    
if (translation && userBilling && userData)
  return (
    <>
    
        <Body>
          <Content>
            {userBilling.allBilling.billingInfo.subscriptions != null ? 
            <ModalDialog userData={userBilling} target="suspend" type="suspendsubscription" click={cancelSubscription} userCredits={credits} MemberTypeEnum={MemberTypeEnum}/> 
            : null}
          
            <ModalUpdateAccount userData={userData} setdata={setNewUserData} setAccountUpdated={setAccountUpdated} modalref={modalRef}></ModalUpdateAccount>
            <ModalEnterpriseUpgrade target="enterpriseUpgrade" modalref={modalRef} onUpgrade={upgradeToEnterprise} userData={userData} />
            <ModalEnterpriseDowngrade target="enterpriseDowngrade" modalref={modalRef} />
            <ModalDialog target="credits" type="credits" hasSubscription={hasSubscription} modalref={modalRef} userData={userData} opened={buyCreditsOpened}/>
            <ModalCreditsRequired target="creditsRequired" modalref={modalRef} />
            <ModalAllocateCredits 
              target="allocateCreditsConfirm" 
              modalref={modalRef} 
              onConfirm={confirmAllocateCredits}
              credits={noOfCredits}
              price={price}
              tax={tax}
              invoiceNumber={invoiceNumber}
            />
            <div className='container'>
                <div className="header d-flex mb-30">
                    <p className='mb-0'>Plans & Credits</p>
                    {isFreeTrial() && isImpersonated() &&
                        <Link className={`${style.upgradeSubscription}`} href="#" onClick={showEnterpriseUpgradeModal} style={{margin: 'auto 0 auto auto'}}>
                        Upgrade to Enterprise
                        </Link>
                    }
                </div>
                {hasShopifyWebshop || activeShopifySubscription() ? 
                    <div className='subscription-note d-flex mb-14 mt-36 font-16'>
                    <Image className='info-icon-subscription' src='/images/ic_info_red.svg' width={20} height={20} alt='info'></Image>
                    <p>Purchasing credits or a subscription within our platform is disabled because you have at least one (1) Shopify store connected.<br/><br/>In compliance with Shopify&apos;s app store Terms, you can only make a purchase for our Shopify app in the <Link href={userBilling.allBilling.billingInfo.shopifyPaymentUrl == null ? '#' : userBilling.allBilling.billingInfo.shopifyPaymentUrl} target='_blank'>Shopify dashboard</Link>. This applies to purchases for credits or a subscription that will also be used in Magento and WooCommerce shops (if you have any). This is because WriteText.ai shares all credits in your account among all your webshops (if you have multiple shops connected).</p>
                    </div>
                : null}
                    {isFreeTrial() &&
                    <>
                    {hasProAccess() ? 
                    
                    <div className={`header-tos ${style.freeTrialBanner}`} style={{height: 51}}>
                        <div>
                          <p className={`${style.bannerTitle} mb-0`}>You&apos;re on free trial until {freeTrialEndDate()}.</p>
                          {/* <p className={`${style.bannerText} mb-0`}>To continue using WriteText.ai, you can purchase prepaid credits for text generation or subscribe to the Pro plan to retain full access—including SEO tools and automation.</p> */}
                        </div>
                    </div>
                    :
                    
                    <div className={`header-tos ${style.freeTrialBanner}`}>
                        <div>
                          <p className={style.bannerTitle}>Your free trial has ended.</p>
                          <p className={`${style.bannerText} mb-0`}>To continue using WriteText.ai, you can purchase prepaid credits for text generation or subscribe to the Pro plan to retain full access—including SEO tools and automation.</p>
                        </div>
                    </div>
                     }
                    <div className={style.pricingContainer}>
                        <PricingCard
                            title="Starter"
                            subtitle="For flexible, per-product content generation"
                            price={`USD ${userBilling.allBilling.creditPlans.find(x => x.textDisplayCredits == selectedCreditPlan)?.amount || 0}*`}
                            perks={[
                                "One-time purchase – no subscription required",
                                "Generate product descriptions, category content, meta tags, Open Graph text, and image alt text",
                                "Use Templates and Custom Prompts to structure your content",
                                "Add manual target keywords before generation",
                                "Access Product Research to enrich content when product data is limited",
                                "Ideal for one-off projects, small catalogs, or non-SEO-driven use cases",
                                "Credits valid for 1 year"
                            ]}
                            type="credits"
                            userBilling={userBilling}
                            newUserData={newUserData}
                            accountUpdated={accountUpdated}
                            subscriptionStatus={subscriptionStatus}
                            paymentGateway={paymentGateway}
                            SubscriptionStatusEnum={SubscriptionStatusEnum}
                            GateWayTypeEnum={GateWayTypeEnum}
                            creditPlans={userBilling.allBilling.creditPlans}
                            selectedCreditPlan={selectedCreditPlan}
                            setSelectedCreditPlan={setSelectedCreditPlan}
                            setCreditPaddleProduct={setCreditPaddleProduct}
                            setPlanId={setCreditPlanId}
                            setPaddleProduct={setCreditPaddleProduct}
                            paddleProduct={creditPaddleProduct}
                            planId={creditPlanId}
                            CreditPlansDropdown={CreditPlansDropdown}
                            hasShopifyWebshop={hasShopifyWebshop}
                        />
                        <PricingCard
                            title="Pro"
                            subtitle="For teams who optimize content at scale"
                            price={`USD ${selectedProPlan.toLowerCase().includes('annual') ? userBilling.allBilling.paddlePaymentSettings?.annual?.price : userBilling.allBilling.paddlePaymentSettings?.monthly?.price}*`}
                            perks={[
                                "Monthly or annual subscription available",
                                "Everything in Starter, plus:",
                                "Full Automation: trigger generation, keyword analysis, and transfer in one flow",
                                "Keyword Optimization Pipeline with AI-suggested and rank-tracked keywords",
                                "View what your products already rank for and avoid cannibalization",
                                "Bulk keyword analysis and content generation",
                                "Automatic content updates based on keyword progress or custom triggers",
                                "Export keyword data with traffic, competition, and intent",
                                "API access for deep integration into your own systems",
                                "Access to discounted credit bundles"
                            ]}
                            type="subscription"
                            userBilling={userBilling}
                            newUserData={newUserData}
                            accountUpdated={accountUpdated}
                            subscriptionStatus={subscriptionStatus}
                            paymentGateway={paymentGateway}
                            SubscriptionStatusEnum={SubscriptionStatusEnum}
                            GateWayTypeEnum={GateWayTypeEnum}
                            proPlans={userBilling.allBilling.paddlePaymentSettings}
                            selectedProPlan={selectedProPlan}
                            setSelectedProPlan={setSelectedProPlan}
                            setPlanId={setSubscriptionPlanId}
                            setPaddleProduct={setPaddleProduct}
                            paddleProduct={paddleProduct}
                            planId={subscriptionPlanId}
                            ProPlansDropdown={ProPlansDropdown}
                            memberType={memberType()}
                            hasShopifyWebshop={hasShopifyWebshop}
                        />
                        
                        <div className={`${style.pricing} mb-30`}>
                            <p className={style.pricingTitle}>Enterprise</p>
                            <p className={style.pricingSubTitle}>For high-volume teams, multi-stores, and complexh</p>
                            <div style={{height: 91, marginBottom: 20, display: 'flex' }}>
                                <p className={`${style.pricingPrice} m-auto`}>Custom pricing</p>
                            </div>
                            <div className={style.pricingPerksRow}>
                                <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                <span>
                                    Tailored solutions with hands-on support
                                </span>
                            </div>
                            <div className={style.pricingPerksRow}>
                                <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                <span>
                                    Everything in Pro
                                </span>
                            </div>
                            <div className={`${style.pricingPerksRow}`}>
                                <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                <span>
                                    Custom onboarding and template setup 
                                </span>
                            </div>
                            <div className={`${style.pricingPerksRow}`}>
                                <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                <span>
                                    Dedicated integration support with direct access to our development team 
                                </span>
                            </div>
                            <div className={`${style.pricingPerksRow}`}>
                                <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                <span>
                                    Multi-store and multi-user support
                                </span>
                            </div>
                            <div className={`${style.pricingPerksRow}`}>
                                <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                <span>
                                    Priority support with guaranteed response times
                                </span>
                            </div>
                            <div className={`${style.pricingPerksRow} mb-0`}>
                                <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                <span>
                                    Volume-based pricing and flexible credit management
                                </span>
                            </div>
                            <div className='credits-info' style={{marginTop: 'auto', marginBottom: 0}}>
                                <button className='btn btn-primary'  onClick={() => window.open('https://writetext.ai/talk-to-us', '_blank')}>
                                    Talk to sales
                                </button>
                            </div>
                        </div>
                    </div>
                    <p className={style.pricingDisclaimer}>* All prices are exclusive of applicable taxes.</p>
                    
                    </>
                }
                
                {memberType() === MemberTypeEnum.STARTER &&
                <>
                {showLegacyBanner && movedToStarter() &&
                <div className={`header-tos suspendable-banner ${style.legacyBannerContainer}`}>
                        <div>
                          <p className={`${style.bannerTitle}`}>You&apos;ve been moved to the Starter plan</p>
                          <p className={`${style.bannerText} mb-0`}>Our pricing model has changed, and your previous prepaid access now falls under the Starter tier. You’ll keep full access to text generation features using your remaining credits.</p>

                          {/* <p className={`${style.bannerText} mb-0`}>To continue using WriteText.ai, you can purchase prepaid credits for text generation or subscribe to the Pro plan to retain full access—including SEO tools and automation.</p> */}
                        </div>
                        <button 
                          className={style.bannerCloseButton}
                          onClick={() => {setShowLegacyBanner(false); setMovedToStarter()}}
                          aria-label="Close banner"
                        >
                          <Image src="/images/ico-close.svg" width={20} height={20} alt="Close" />
                        </button>
                    </div>
                }
                    <div className={style.starterContainer}>
                        {/* Left: Your plan */}
                        <div className={style.yourPlanCard}>
                            <p className={style.yourPlanTitle}>Your plan</p>
                        <div className={style.yourPlanBox}>
                        <span className={`${style.planName}`}>
                            <Image src="/images/ic_crown.svg" width={20} height={20} alt="Starter" style={{marginRight: 8}} />
                            <p className={`mb-0 ${style.memberType}`}>Starter</p>
                        </span>
                        
                        <>
                        <div>
                        {!hasCreditsToDisplay() ? (
                            <p className={style.noCredits}>
                                You don&apos;t have any purchased credits yet.
                                <br/>
                                Buy add-on credits using the section on the right.
                            </p>
                        ) : (
                            <>
                            {getMergedCreditsByExpiry().map((mergedCredit, index) => (
                                <React.Fragment key={index}>
                                    <p className={style.creditsRemaining}>
                                        {formatCreditsDisplay(mergedCredit.totalAmount)}/{formatCreditsDisplay(mergedCredit.totalStartingAmount)} {mergedCredit.isSubscriptionCredits ? 'subscription credits' : 'credits'} remaining.
                                    </p>
                                    <p className={style.planExpiry}>
                                        {mergedCredit.isFreeTrial ? 'Expires' : 
                                         mergedCredit.isFreeCredits ? 'Resets' : 
                                         subscriptionStatus.toUpperCase() == SubscriptionStatusEnum.CANCELLED ? 'Expires' : 'Resets'} on {formatDate(mergedCredit.expiryDate)}
                                    </p>
                                </React.Fragment>
                            ))}
                            </>
                        )}
                        
                        </div> 
                        
                        {isImpersonated() && (
                          <div className={`${style.cancelSubscriptionContainer} mt-20`}> 
                            <Link className={`${style.upgradeSubscription}`} href="#" onClick={showEnterpriseUpgradeModal}>
                              Upgrade to Enterprise
                            </Link>
                          </div>
                        )}
                        
                        </>
                    </div>
                        </div>

                        {/* Right: Main content */}
                        <div className={style.starterMain}>
                            {/* Buy add-on credits */}
                            <p className={style.upgradeTitle}>Buy add-on credits</p>
                            <div className={style.buyCreditsBox}>
                                <div className={style.buyCreditsRow}>
                                <div className='d-flex flex-row' style={{width: 226}}>
                                        <label style={{margin: 'auto 15px auto 0'}}>No. of credits</label>
                                    <div className={style.starterPricingDropdown}>
                                        
                                    <CreditPlansDropdown
                                        creditPlans={userBilling.allBilling.creditPlans}
                                        selectedPlan={selectedCreditPlan}
                                        setSelectedPlan={setSelectedCreditPlan}
                                        setPlanId={setCreditPlanId}
                                        setPaddleProduct={setPaddleProduct}
                                        memberType={memberType()}
                                        setCreditPaddleProduct={setCreditPaddleProduct}
                                        disabled={hasShopifyWebshop || activeShopifySubscription()
                                            ? true 
                                            : false}
                                    />
                                    </div>
                                    </div>
                                    <div className='d-flex flex-column' style={{marginLeft: 'auto'}}>
                                        <span className={style.buyCreditsPrice}>USD {userBilling.allBilling.creditPlans.find(x => x.textDisplayCredits == selectedCreditPlan)?.amount || 0}</span>
                                        <span className={style.buyCreditsDisclaimer}>exclusive of applicable tax</span>
                                    </div>
                                    <div className='credits-info' style={{margin: 'auto 0'}} >
                                        {activeShopifySubscription()}
                                    <PaddleButton
                                        userData={userBilling}
                                        newUserData={newUserData}
                                        type="credits"
                                        isAnnual={false}
                                        productId={creditPaddleProduct}
                                        planId={creditPlanId}
                                        credits={selectedCreditPlan}
                                        accountUpdated={accountUpdated}
                                        disabled={hasShopifyWebshop || activeShopifySubscription()
                                            ? true 
                                            : false}
                                    />
                                    </div>
                                </div>
                            </div>

                            {/* Upgrade when you're ready */}
                            <p className={style.upgradeTitle}>Get more out of WriteText.ai</p>
                            <div className={style.starterPricingContainer}>
                                <PricingCard
                                    title="Pro"
                                    subtitle="For teams who optimize content at scale"
                                    price={`USD ${selectedProPlan.toLowerCase().includes('annual') ? userBilling.allBilling.paddlePaymentSettings?.annual?.price : userBilling.allBilling.paddlePaymentSettings?.monthly?.price}`}
                                    perks={[
                                        "Monthly or annual subscription available",
                                        "Everything in Starter, plus:",
                                        "Full Automation: trigger generation, keyword analysis, and transfer in one flow",
                                        "Keyword Optimization Pipeline with AI-suggested and rank-tracked keywords",
                                        "View what your products already rank for and avoid cannibalization",
                                        "Bulk keyword analysis and content generation",
                                        "Automatic content updates based on keyword progress or custom triggers",
                                        "Export keyword data with traffic, competition, and intent",
                                        "API access for deep integration into your own systems",
                                        "Access to discounted credit bundles"
                                    ]}
                                    type="subscription"
                                    userBilling={userBilling}
                                    newUserData={newUserData}
                                    accountUpdated={accountUpdated}
                                    subscriptionStatus={subscriptionStatus}
                                    paymentGateway={paymentGateway}
                                    SubscriptionStatusEnum={SubscriptionStatusEnum}
                                    GateWayTypeEnum={GateWayTypeEnum}
                                    proPlans={userBilling.allBilling.paddlePaymentSettings}
                                    selectedProPlan={selectedProPlan}
                                    setSelectedProPlan={setSelectedProPlan}
                                    setPlanId={setSubscriptionPlanId}
                                    setPaddleProduct={setPaddleProduct}
                                    paddleProduct={paddleProduct}
                                    planId={subscriptionPlanId}
                                    ProPlansDropdown={ProPlansDropdown}
                                    memberType={memberType()}
                                    hasShopifyWebshop={hasShopifyWebshop}
                                />
                            <div className={`${style.starterPricing} mb-30`}>
                                    <div className={`d-flex justify-content-between`}>
                                        <div>
                                            <p className={style.starterPricingTitle}>Enterprise</p>
                                            <p className={style.starterPricingSubTitle} style={{marginBottom: 32}}>For high-volume teams, multi-stores, and complex</p>
                                        </div>
                                    </div>
                                    <div className={style.pricingPerksRow}>
                                <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                <span>
                                    Tailored solutions with hands-on support
                                </span>
                            </div>
                            <div className={style.pricingPerksRow}>
                                <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                <span>
                                    Everything in Pro
                                </span>
                            </div>
                            <div className={`${style.pricingPerksRow}`}>
                                <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                <span>
                                    Custom onboarding and template setup 
                                </span>
                            </div>
                            <div className={`${style.pricingPerksRow}`}>
                                <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                <span>
                                    Dedicated integration support with direct access to our development team 
                                </span>
                            </div>
                            <div className={`${style.pricingPerksRow}`}>
                                <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                <span>
                                    Multi-store and multi-user support
                                </span>
                            </div>
                            <div className={`${style.pricingPerksRow}`}>
                                <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                <span>
                                    Priority support with guaranteed response times
                                </span>
                            </div>
                            <div className={`${style.pricingPerksRow} mb-0`}>
                                <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                <span>
                                    Volume-based pricing and flexible credit management
                                </span>
                            </div>
                                    
                                    <div style={{display: 'flex',marginTop: 'auto', paddingTop: '31px'}}>
                                        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <p className={style.starterPricingPrice} style={{margin: '0', marginRight: '30px'}}>Custom pricing</p>
                                        </div>
                                        <div className='credits-info' style={{marginLeft: 'auto', marginBottom: 0}}>
                                            <button className='btn btn-buycredits' style={{width: 160}} onClick={() => window.open('https://writetext.ai/talk-to-us', '_blank')}>
                                                Talk to sales
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {memberType() == MemberTypeEnum.FREETRIAL &&
                            <p className={style.pricingDisclaimer}>* All prices are exclusive of applicable taxes.</p>
                            }
                        </div>
                    </div>
                    
                </>
                }
                
                {memberType() === MemberTypeEnum.PROFESSIONAL &&
                <>
                {isLegacyBanner() && showLegacyBanner &&
                 <div className={`header-tos suspendable-banner ${style.legacyBannerContainer}`}>
                        <div>
                          <p className={`${style.bannerTitle}`}>You&apos;re on a legacy plan</p>
                          <p className={`${style.bannerText} mb-0`}>We&apos;ve recently updated our pricing, but you&apos;ll continue with your current subscription rate and recurring credits allocation as long as your plan stays active. If you cancel and resubscribe later, the new pricing will apply.</p>

                          {/* <p className={`${style.bannerText} mb-0`}>To continue using WriteText.ai, you can purchase prepaid credits for text generation or subscribe to the Pro plan to retain full access—including SEO tools and automation.</p> */}
                        </div>
                        <button 
                          className={style.bannerCloseButton}
                          onClick={handleCloseLegacyBanner}
                          aria-label="Close banner"
                        >
                          <Image src="/images/ico-close.svg" width={20} height={20} alt="Close" />
                        </button>
                    </div>
                }
                <div className={style.proContainer}>
                    
                {/* Left: Your plan */}
                <div className={style.yourPlanCard}>
                    <p className={style.yourPlanTitle}>Your plan</p>
                    <div className={style.yourPlanBox}>
                        <span className={`${style.planName}`} style={{marginBottom: 10}}>
                            <Image src="/images/ic_crown.svg" width={20} height={20} alt="Starter" style={{marginRight: 8}} />
                            <p className={`mb-0 ${style.memberType}`}>Pro | {userBilling.credit.isAnnual ? 'Annual' : 'Monthly'}</p>
                            <p className={`${style.subscriptionStatus} ${subscriptionStatus.toUpperCase() === SubscriptionStatusEnum.ACTIVE ? style.activeSub : style.suspendedSub}`}>{subscriptionStatus}</p>
                        </span>
                        {subscriptionStatus.toUpperCase() == SubscriptionStatusEnum.ACTIVE &&
                        <span>
                            <p className={`${style.subscriptionInfo}`}>Subscription renews on {formatDate(userBilling.allBilling.billingInfo.subscriptions.nextBillingDate)}</p>
                        </span>
                        }
                        {subscriptionStatus.toUpperCase() == SubscriptionStatusEnum.CANCELLED &&
                        <span>
                            <p className={`${style.subscriptionInfo}`}>Expires on {formatDate(userData.credit.subscriptionExpiration)}</p>
                        </span>
                        }
                        <>
                        <div>
                        {!hasCreditsToDisplay() ? (
                            <p className={style.noCredits}>
                                You don&apos;t have any purchased credits yet.
                                <br/>
                                Buy add-on credits using the section on the right.
                            </p>
                        ) : (
                            <>
                            {getMergedCreditsByExpiry().map((mergedCredit, index) => (
                                <React.Fragment key={index}>
                                    <p className={style.creditsRemaining}>
                                        {formatCreditsDisplay(mergedCredit.totalAmount)}/{formatCreditsDisplay(mergedCredit.totalStartingAmount)} {mergedCredit.isSubscriptionCredits ? 'subscription credits' : 'credits'} remaining.
                                    </p>
                                    <p className={style.planExpiry}>
                                        {mergedCredit.isFreeTrial ? 'Expires' : 
                                         mergedCredit.isFreeCredits ? 'Resets' : 
                                         subscriptionStatus.toUpperCase() == SubscriptionStatusEnum.CANCELLED ? 'Expires' : 'Resets'} on {formatDate(mergedCredit.expiryDate)}
                                    </p>
                                </React.Fragment>
                            ))}
                            </>
                        )}
                        
                        </div> 
                        <hr/>
                        {subscriptionStatus.toUpperCase() === SubscriptionStatusEnum.ACTIVE && paymentGateway.toUpperCase() !== GateWayTypeEnum.SHOPIFY &&
                        <div className={`${style.cancelSubscriptionContainer} ${isImpersonated() ? 'mb-20' : ''}`}>
                            <Link className={`${style.cancelSubscription}`} href="#" onClick={showModal}>Cancel subscription</Link>
                        </div>  
                        }
                        
                        {isImpersonated() &&
                         <div className={`${style.cancelSubscriptionContainer}`}>
                                 <Link className={`${style.upgradeSubscription}`} href="#" onClick={showEnterpriseUpgradeModal}>Upgrade to Enterprise</Link>
                         </div>  
                         }
                        
                        </>
                    </div>
                </div>

                {/* Right: Main content */}
                <div className={style.proMain}>
                    {/* Buy add-on credits */}
                    <p className={style.upgradeTitle}>Buy add-on credits</p>
                    <div className={style.buyCreditsBox}>
                        <div className={style.buyCreditsRow}>
                            <div className='d-flex flex-row' style={{width: 226}}>
                            <label style={{margin: 'auto 15px auto 0'}}>No. of credits</label>
                                <div className={style.starterPricingDropdown}>
                                    
                                <CreditPlansDropdown
                                    creditPlans={userBilling.allBilling.creditPlans}
                                    selectedPlan={selectedCreditPlan}
                                    setSelectedPlan={setSelectedCreditPlan}
                                    setPlanId={setCreditPlanId}
                                    setPaddleProduct={setCreditPaddleProduct}
                                    memberType={memberType()}
                                    setCreditPaddleProduct={setCreditPaddleProduct}
                                    disabled={hasShopifyWebshop || activeShopifySubscription()  
                                        ? true 
                                        : false}
                                />
                            </div>
                            </div>
                            <div className='d-flex flex-column' style={{marginLeft: 'auto'}}>
                                <span className={style.buyCreditsPrice}>USD {userBilling.allBilling.creditPlans.find(x => x.textDisplayCredits == selectedCreditPlan)?.amount || 0}</span>
                                <span className={style.buyCreditsDisclaimer}>exclusive of applicable tax</span>
                            </div>
                            <div className='credits-info' style={{margin: 'auto 0'}} >
                            <PaddleButton
                                userData={userBilling}
                                newUserData={newUserData}
                                type="credits"
                                isAnnual={false}
                                productId={creditPaddleProduct}
                                planId={creditPlanId}
                                credits={selectedCreditPlan}
                                accountUpdated={accountUpdated}
                                disabled={hasShopifyWebshop || activeShopifySubscription()
                                    ? true 
                                    : false}
                            />
                            </div>
                        </div>
                    </div>

                    {/* Scale with Enterprise */}
                    <p className={style.upgradeTitle}>Scale with Enterprise</p>
                    <div className={style.proPricingContainer}>
                        <div className={`${style.proPricing} mb-30`}>
                            <div className={`d-flex justify-content-between`}>
                                <div>
                                    <p className={style.proPricingTitle}>Enterprise</p>
                                    <p className={style.proPricingSubTitle}>For high-volume teams, multi-stores, and complex</p>
                                </div>
                                <div style={{marginLeft: 'auto'}}>
                                    <p className={style.proPricingPrice}>Custom pricing</p>
                                </div>
                            </div>
                            <div className='d-flex flex-row'>
                                <div>
                                    <div className={style.proPricingPerksRow}>
                                        <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                        <span>
                                        Tailored solutions with hands-on support
                                        </span>
                                    </div>
                                    <div className={style.proPricingPerksRow}>
                                        <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                        <span>
                                        Everything in Pro
                                        </span>
                                    </div>
                                    <div className={`${style.proPricingPerksRow}`}>
                                        <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                        <span>
                                        Custom onboarding and template setup 
                                        </span>
                                    </div>
                                    <div className={`${style.proPricingPerksRow}`}>
                                        <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                        <span>
                                        Dedicated integration support with direct access to our development team
                                        </span>
                                    </div>
                                    <div className={`${style.proPricingPerksRow}`}>
                                        <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                        <span>
                                        Multi-store and multi-user support
                                        </span>
                                    </div>
                                    <div className={`${style.proPricingPerksRow}`}>
                                        <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                        <span>
                                        Priority support with guaranteed response times
                                        </span>
                                    </div>
                                    <div className={`${style.proPricingPerksRow} mb-0`}>
                                        <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                        <span>
                                        Volume-based pricing and flexible credit management
                                        </span>
                                    </div>
                                </div>
                                <div className='ms-auto mt-auto' >
                                    <div className='credits-info' style={{marginLeft: 'auto', marginBottom: 0}}>
                                        <button className='btn btn-buycredits' style={{width: 160}}  onClick={() => window.open('https://writetext.ai/talk-to-us', '_blank')}>
                                            Talk to sales
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                        </div>
                    </div>
                    {memberType() == MemberTypeEnum.FREETRIAL &&
                    <p className={style.pricingDisclaimer}>* All prices are exclusive of applicable taxes.</p>
                    }
                    
                </div>
                </div>
                </>
                }
                {memberType() === MemberTypeEnum.ENTERPRISE &&
                
                <div className={style.proContainer}>
                {/* Left: Your plan */}
                    <div className={style.yourPlanCard}>
                        <p className={style.yourPlanTitle}>Your plan</p>
                        <div className={style.yourPlanBox}>
                            <span className={`${style.planName}`} style={{marginBottom: 20}}>
                                <Image src="/images/ic_crown.svg" width={20} height={20} alt="Starter" style={{marginRight: 8}} />
                                <p className={`mb-0 ${style.memberType}`}>Enterprise</p>
                            </span>
                            
                            <>
                            <div>
                                
                                <p className={style.creditsRemaining} style={{marginBottom: 20}}>
                                    {enterpriseCreditsDisplay()} allocated credits.
                                </p>
                                
                                {/* For Enterprise, we always show allocated credits, but we can show additional info if there are other credits */}
                                {getMergedCreditsByExpiry().filter(mergedCredit => !mergedCredit.isEnterprise).map((mergedCredit, index) => (
                                    <React.Fragment key={index}>
                                        <p className={style.creditsRemaining}>
                                            {formatCreditsDisplay(mergedCredit.totalAmount)}/{formatCreditsDisplay(mergedCredit.totalStartingAmount)} {mergedCredit.isSubscriptionCredits ? 'subscription credits' : 'credits'} from previous plan.
                                        </p>
                                        <p className={style.planExpiry}>
                                            {mergedCredit.isFreeTrial ? 'Expires' : 
                                             mergedCredit.isFreeCredits ? 'Resets' : 
                                             subscriptionStatus.toUpperCase() == SubscriptionStatusEnum.CANCELLED ? 'Expires' : 'Resets'} on {formatDate(mergedCredit.expiryDate)}
                                        </p>
                                    </React.Fragment>
                                ))}
                                
                            </div> 
                           
                            
                            </>
                        </div>
                    </div>
                    
                {/* Right: Main content */}
                <div className={style.proMain}>
                    {isImpersonated() &&
                    <>
                    <p className={style.upgradeTitle} style={{height: 20}}></p>
                    <div className={style.buyCreditsBox}>
                        <div className={`d-flex flex-row`}>
                            <div className='d-flex flex-column'>
                                <div className={`form-group d-flex flex-row req mr-20`}>
                                    <label htmlFor="noOfCredits" style={{margin: 'auto 10px auto 0', width: '100%', maxWidth: 110}}>No. of credits</label>
                                    <input id="noOfCredits" name="noOfCredits" type="text" min={1} max={10000} className={`form-control`} value={noOfCredits} onChange={handleNoOfCreditsChange} />
                                </div>
                                <div className={`form-group d-flex flex-row mr-20`}>
                                    <label htmlFor="price" style={{margin: 'auto 10px auto 0', width: '100%', maxWidth: 110}}>Price (USD)</label>
                                    <input id="price" name="price" type="text" min={1} max={10000} className={`form-control`} value={price} onChange={handlePriceChange} onFocus={handlePriceFocus} onBlur={handlePriceBlur} />
                                </div>
                            </div>
                            <div className='d-flex flex-column ms-auto'>
                                <div className={`form-group d-flex flex-row`}>
                                    <label style={{width: 100, margin: 'auto 10px auto 0'}} htmlFor="invoiceNumber">Invoice # </label>
                                    <input id="invoiceNumber" name="invoiceNumber" type="text" min={1} max={10000} className={`form-control`} value={invoiceNumber} onChange={handleInvoiceNumberChange} />
                                </div>
                                
                                <div className={`form-group d-flex flex-row`}>
                                    <label style={{width: 100, margin: 'auto 10px auto 0'}} htmlFor="tax">Tax </label>
                                    <input id="tax" name="tax" type="text" min={1} max={10000} className={`form-control`} value={tax} onChange={handleTaxChange} onFocus={handleTaxFocus} onBlur={handleTaxBlur} onKeyUp={handleTaxChange} />
                                </div>
                                <div className='credits-info mb-0'>
                                    <button 
                                        className='btn btn-buycredits' 
                                        style={{width: 160, marginRight: 0}} 
                                        onClick={addCredits}
                                        disabled={addingCredits}
                                    >
                                        {addingCredits ? 'Allocating...' : 'Allocate credits'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    </>
                    }
                    <p className={style.upgradeTitle}>Plan features</p>
                    <div className={style.buyCreditsBox} style={{height: '100%'}}>
                        <div className={style.buyCreditsRow} style={{alignItems: 'unset'}}>
                            <div style={{maxWidth: 333}}>
                                <div className={style.pricingPerksRow}>
                                    <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                    <span>
                                    Tailored solutions with hands-on support
                                    </span>
                                </div>
                                <div className={`${style.pricingPerksRow}`}>
                                    <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                    <span>
                                    Everything in Pro
                                    </span>
                                </div>
                                <div className={`${style.pricingPerksRow}`}>
                                    <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                    <span>
                                    Custom onboarding and template setup 
                                    </span>
                                </div>
                                <div className={`${style.pricingPerksRow} mb-0`}>
                                    <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                    <span>
                                    Dedicated integration support with direct access to our development team
                                    </span>
                                </div>
                            </div>
                            <div>
                                <div className={style.pricingPerksRow}>
                                    <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                    <span>
                                    Multi-store and multi-user support
                                    </span>
                                </div>
                                <div className={`${style.pricingPerksRow}`}>
                                    <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                    <span>
                                    Priority support with guaranteed response times
                                    </span>
                                </div>
                                <div className={`${style.pricingPerksRow} mb-0`}>
                                    <Image src='/images/ic_perks_check.svg' width={15} height={11} alt='check' />
                                    <span>
                                    Volume-based pricing and flexible credit management
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <p className={style.upgradeTitle}>Need more credits or a custom solution?</p>
                    <div className={style.enterpricePricingContainer}>
                        <div className={`${style.enterpricePricing} mb-30`}>
                            <div >
                                <div>
                                    {/* <p className={style.enterpricePricingTitle}>Need more credits or have a custom request?</p> */}
                                    <p className={`${style.enterpricePricingSubTitle}`}>If you&apos;re running low on credits or require a tailored solution, we&apos;re here to help. Reach out to your account manager to request additional credits or discuss scaling your plan. For any other questions or special requirements, feel free to contact us directly.</p>
                                   
                                </div>
                                <div className='d-flex flex-row'>
                                    <Image src="/images/ic_email.svg" width={18} height={18} alt="email" />
                                    <p className={style.enterpriseContactText}>Contact your account manager or send an email to <Link href="mailto:support@writetext.ai">support@writetext.ai</Link></p>
                                </div>
                                {/* <div className='credits-info' style={{marginLeft: 'auto', marginBottom: 0}}>
                                    <button className='btn btn-buycredits' style={{width: 160, marginRight: 0}}>
                                        Contact support
                                    </button>
                                </div> */}
                            </div>
                        </div>
                    </div>
                    
                </div>
                </div>
                
                }
                
            </div>
          </Content>
        </Body>
        
    </>
  )
}


const CreditPlansDropdown = ({ creditPlans, selectedPlan, setSelectedPlan, setPlanId,setPaddleProduct,memberType,setCreditPaddleProduct, disabled = false }) => {
    const AppSettings = require('../../settings/AppSetting').default
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const handlePlanChange = async (selectedValue) => {
        setSelectedPlan(selectedValue);
        setIsOpen(false);
        // Find the plan with matching textDisplayCredits and trigger the click event
        const paddleProducts = await apiService.get(`${AppSettings.API_URL}/Paddle/products/creditPlans`)
        //const paddleProductPlanId = await apiService.post(`${AppSettings.API_URL}/Paddle/pricing?planId=${planId}&productId=${paddleProducts.data[0].id}`)
        const paddleProduct = paddleProducts.data.data
        const plan = creditPlans.find(p => p.textDisplayCredits === selectedValue);
        
        setPlanId(plan.id);
        setCreditPaddleProduct(paddleProduct[0].id);
        setPaddleProduct(paddleProduct[0].id); // Always set to credit-specific product
        
        // Store the selected credit plan in session storage for auto-click scenarios
        sessionStorage.setItem('selectedCreditPlanId', plan.id);
        sessionStorage.setItem('selectedCreditPaddleProduct', paddleProduct[0].id);
    };
    const formatCreditDropdownDisplay = (text) => {
        //remove Credits text
        return text.replace("Credits","");

    }
    return (
        <div ref={dropdownRef} className={style.creditDropdownContainer}>
            <button
                type="button"
                className={`${style.creditDropdownToggle} ${disabled ? style.disabled : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                style={{width: memberType == MemberTypeEnum.STARTER || memberType == MemberTypeEnum.PROFESSIONAL ? 110 : 160}}
            >
                <span className={style.creditDropdownValue}>
                    {memberType == MemberTypeEnum.STARTER || memberType == MemberTypeEnum.PROFESSIONAL ? formatCreditDropdownDisplay(selectedPlan) : selectedPlan || 'Select credit plan'}
                </span>
                <Image 
                    src={isOpen ? '/images/ic_arrow_collapse_large.svg' : '/images/ic_arrow_expand_large.svg'} 
                    width={30} 
                    height={30} 
                    alt="dropdown arrow"
                />
            </button>
            
            {isOpen && !disabled && (
                <div className={style.creditDropdownMenu}>
                    {creditPlans.map((plan, index) => (
                        <button
                            key={index}
                            className={`${style.creditDropdownItem} ${selectedPlan === plan.textDisplayCredits ? style.creditDropdownItemSelected : ''}`}
                            onClick={() => handlePlanChange(plan.textDisplayCredits)}
                        >
                            {memberType == MemberTypeEnum.STARTER || memberType == MemberTypeEnum.PROFESSIONAL ? formatCreditDropdownDisplay(plan.textDisplayCredits) : plan.textDisplayCredits}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};
    const ProPlansDropdown = ({ proPlans, selectedPlan, setSelectedPlan, setPlanId, memberType, setPaddleProduct, disabled = false }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handlePlanChange = (selectedValue) => {
        setSelectedPlan(selectedValue);
        setIsOpen(false);
        
        // Set planId based on selected value
        if (selectedValue === 'Monthly') {
            setPlanId(proPlans.monthly.planId);
        } else if (selectedValue === 'Annual') {
            setPlanId(proPlans.annual.planId);
        }
        
        // For subscriptions, we don't need to set paddle product
        // The PaddleButton component handles subscription products internally
        // Clear paddle product to avoid conflicts with credit purchases
        setPaddleProduct('');
    };

    // Create options array from the proPlans object
    const options = [
        { label: 'Monthly', value: 'Monthly', planId: proPlans?.monthly?.planId },
        { label: 'Annual', value: 'Annual', planId: proPlans?.annual?.planId }
    ];

    return (
        <div ref={dropdownRef} className={style.creditDropdownContainer}>
            <button
                type="button"
                className={`${style.creditDropdownToggle} ${disabled ? style.disabled : ''}`}
                onClick={() => !disabled && setIsOpen(!isOpen)}
                disabled={disabled}
                style={{width: memberType == MemberTypeEnum.STARTER ? 110 : 160}}
            >
                <span className={style.creditDropdownValue}>
                    {selectedPlan || 'Monthly'}
                </span>
                <Image 
                    src={isOpen ? '/images/ic_arrow_collapse_large.svg' : '/images/ic_arrow_expand_large.svg'} 
                    width={30} 
                    height={30} 
                    alt="dropdown arrow"
                />
            </button>
            
            {isOpen && !disabled && (
                <div className={style.creditDropdownMenu}>
                    {options.map((option, index) => (
                        <button
                            key={index}
                            className={`${style.creditDropdownItem} ${selectedPlan === option.value ? style.creditDropdownItemSelected : ''}`}
                            onClick={() => handlePlanChange(option.value)}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};