import { useRouter } from 'next/router' 
import React, { useEffect, useState } from 'react'
import apiService from '../../services/ApiService'

import { initializePaddle } from '../../utils/initializePaddle'

import { AccountTypeEnum } from '../../enum/AccountType'
import { MemberTypeEnum } from '../../enum/MemberType'

export default function PaddleButton({userData, newUserData, type ,isAnnual,productId, planId, accountUpdated, disabled }) {
    const AppSettings = require('../../settings/AppSetting').default
    const router = useRouter()
    const [ongoingPurchase, setOngoingPurchase] = useState(false)
    const memberType = () => {
      return userData.credit.membershipType
    }
    const getProducts = async (type) => {
      
       return await apiService.get(`${AppSettings.API_URL}/Paddle/products/subscriptionPlans`)
        .then(response => {
            return response.data
        })
        .then(result => {
          const id = result.data.find(r=>r.name.toLowerCase().includes(type.toLowerCase())).id
         return getProductsPrice(id);
        })
        .catch(error => {
          console.error(error)
        });
      }
    const getProductsPrice = async (productId)=> {
        
      return  await apiService.get(`${AppSettings.API_URL}/Paddle/pricing/${productId}`)
        .then(response => {
            return response.data
        })
        .then(result => {
          return result
        })
        .catch(error => {
          console.error(error)
        });
      }
  const openCheckoutCreditsFromCallback = async() => {
      setOngoingPurchase(true)
      const productResponse = await apiService.post(`${AppSettings.API_URL}/Paddle/pricing?planId=${planId}&productId=${productId}`)
      const productPriceId = productResponse.data.data.id
      const address = await apiService.get(`${AppSettings.API_URL}/Paddle/customer/${userData.account.company.customerId}/address`);
      const addressId = address.data.length > 0 ? address.data.data[0].id : '';
      const itemsList = [
        {
          priceId: productPriceId,
          quantity: 1,
        },
      ];
      //on bangladesh when we pass the customer id it adds GST
      //when passing business id it adds VAT
      const customerInfoBusiness = {
        id: newUserData.account.company.customerId,
        address:{
          id: addressId
        },
        business: {
          id:  newUserData.account.company.businessId
        }
      }
      const customerInfoIndividual = {
        id: newUserData.account.company.customerId,
        address:{
          id: addressId
        }
      }

      const customerIndividualWithoutPaddleAddress = {
        id: newUserData.account.company.customerId,
        address:{
          countryCode: newUserData.account.address.country.iso2,
          postalCode: newUserData.account.address.postalCode
        }
      }

      const customerBusinessWithoutPaddleAddress = {
        id: newUserData.account.company.customerId,
        address:{
          countryCode: newUserData.account.address.country.iso2,
          postalCode: newUserData.account.address.postalCode
        },
        business: {
          id:  newUserData.account.company.businessId
        }
      }

      const customerInfo = newUserData.account.company.accountType === AccountTypeEnum.Individual
      ? (addressId !== '' ? customerInfoIndividual : customerIndividualWithoutPaddleAddress)
      : (addressId !== '' ? customerInfoBusiness : customerBusinessWithoutPaddleAddress);

      const url  = window.location.href.split('?')[0];

      Paddle.Checkout.open({
        settings:{
          successUrl: url + `?PaymentSuccessful=1`,
        },
        items: itemsList,
        customer: customerInfo
      })
      
      setTimeout(() => {
        setOngoingPurchase(false)
      },3000)
  }
  const openCheckoutCredits = async() => {
    setOngoingPurchase(true)
    // Store the button type in session storage
    sessionStorage.setItem('paddleButtonType', 'credits')
    
    const newData = await apiService.get(`${AppSettings.API_URL}/Account/All?GetAccount=true&GetCredit=true&GetCreditPlans=true&GetPaymentSettings=true&GetBillingInfo=true&GetInstallationPlan=true&Gateway=Paddle`);
   
    if (newData.data.account.company.accountType == null)
    {
      const { Modal } = require("bootstrap")
      const creditsModal = document.getElementById('credits');
          // Create a Bootstrap Modal instance
      const modalInstance = Modal.getInstance(creditsModal);

      if (modalInstance) {
        modalInstance.hide(); // Programmatically hide the modal on error
      }

      const myModals = new Modal("#updateaccount")
      myModals.show()
    }
    else
    {
      // Check if we have stored credit plan selection in session storage (for auto-click scenarios)
      const storedPlanId = sessionStorage.getItem('selectedCreditPlanId');
      const storedProductId = sessionStorage.getItem('selectedCreditPaddleProduct');
      
      // Use stored values if available, otherwise use props
      const planIdToUse = storedPlanId || planId;
      const productIdToUse = storedProductId || productId;
      
      const productResponse = await apiService.post(`${AppSettings.API_URL}/Paddle/pricing?planId=${planIdToUse}&productId=${productIdToUse}`)
      const productPriceId = productResponse.data.data.id
      const address = await apiService.get(`${AppSettings.API_URL}/Paddle/customer/${newData.data.account.company.customerId}/address`);
      const addressId = address.data.length > 0 ? address.data.data[0].id : '';
      const itemsList = [
        {
          priceId: productPriceId,
          quantity: 1,
        },
      ];
      //on bangladesh when we pass the customer id it adds GST
      //when passing business id it adds VAT
      const customerInfoBusiness = {
        id: newData.data.account.company.customerId,
        address:{
          id: addressId
        },
        business: {
          id:  newData.data.account.company.businessId
        }
      }
      const customerInfoIndividual = {
        id: newData.data.account.company.customerId,
        address:{
          id: addressId
        }
      }

      const customerIndividualWithoutPaddleAddress = {
        id: newData.data.account.company.customerId,
        address:{
          countryCode: newData.data.account.address.country.iso2,
          postalCode: newData.data.account.address.postalCode
        }
      }

      const customerBusinessWithoutPaddleAddress = {
        id: newData.data.account.company.customerId,
        address:{
          countryCode: newData.data.account.address.country.iso2,
          postalCode: newData.data.account.address.postalCode
        },
        business: {
          id:  newData.data.account.company.businessId
        }
      }

      const customerInfo = newData.data.account.company.accountType === AccountTypeEnum.Individual
      ? (addressId !== '' ? customerInfoIndividual : customerIndividualWithoutPaddleAddress)
      : (addressId !== '' ? customerInfoBusiness : customerBusinessWithoutPaddleAddress);

      const url  = window.location.href.split('?')[0];

      Paddle.Checkout.open({
        settings:{
          successUrl: url + `?PaymentSuccessful=1&Credits=${planIdToUse}`,
        },
        items: itemsList,
        customer: customerInfo
      })
      
      // Clear the stored credit plan selection after use
      sessionStorage.removeItem('selectedCreditPlanId');
      sessionStorage.removeItem('selectedCreditPaddleProduct');
      
    }
    setTimeout(() => {
      setOngoingPurchase(false)
    },3000)
  }
    const openCheckoutSubscription = async() => {
      setOngoingPurchase(true)
      // Store the button type in session storage
      sessionStorage.setItem('paddleButtonType', 'subscription')
      
      const newData = await apiService.get(`${AppSettings.API_URL}/Account/All?GetAccount=true&GetCredit=true&GetCreditPlans=true&GetPaymentSettings=true&GetBillingInfo=true&GetInstallationPlan=true&Gateway=Paddle`);
     
      if (newData.data.account.company.accountType == null)
      {
        const { Modal } = require("bootstrap")
        const creditsModal = document.getElementById('credits');
            // Create a Bootstrap Modal instance
        const modalInstance = Modal.getInstance(creditsModal);
  
        if (modalInstance) {
          modalInstance.hide(); // Programmatically hide the modal on error
        }
  
        const myModals = new Modal("#updateaccount")
        myModals.show()
      }
      else
      {
        
        const productPrices = await getProducts(isAnnual ? 'Annual' : 'Monthly')
        const priceName = isAnnual ? 'Annual' : 'Monthly'
        const productPrice = productPrices.find(r => r.name.toLowerCase().includes(priceName.toLowerCase()))
        
        const address = await apiService.get(`${AppSettings.API_URL}/Paddle/customer/${newData.data.account.company.customerId}/address`);
        const addressId = address.data.length > 0 ? address.data.data[0].id : ''
        
        const customerInfoBusiness = {
          id: newData.data.account.company.customerId,
          address:{
            id: addressId
          },
          business: {
            id:  newData.data.account.company.businessId
          }
        }
        const customerInfoIndividual = {
          id: newData.data.account.company.customerId,
          address:{
            id: addressId
          }
        }
    
        const customerIndividualWithoutPaddleAddress = {
          id: newData.data.account.company.customerId,
          address:{
            countryCode: newData.data.account.address.country.iso2,
            postalCode: newData.data.account.address.postalCode
          }
        }
    
        const customerBusinessWithoutPaddleAddress = {
          id: newData.data.account.company.customerId,
          address:{
            countryCode: newData.data.account.address.country.iso2,
            postalCode: newData.data.account.address.postalCode
          },
          business: {
            id:  newData.data.account.company.businessId
          }
        }
    
        const customerInfo = newData.data.account.company.accountType === AccountTypeEnum.Individual
        ? (addressId !== '' ? customerInfoIndividual : customerIndividualWithoutPaddleAddress)
        : (addressId !== '' ? customerInfoBusiness : customerBusinessWithoutPaddleAddress);
    
        const url  = window.location.href.split('?')[0];

          Paddle.Checkout.open({
            settings:{
              successUrl: url + `?PaymentSuccessful=1&Subscription=${productPrice.name}`,
            },
            items: [
              {
                priceId: productPrice.id,
                quantity: 1,
              },
            ],
            customer: customerInfo,
          })

      }
        
      setTimeout(() => {
        setOngoingPurchase(false)
      },3000)
      }
      const openCheckoutSubscriptionFromCallback = async() => {
        setOngoingPurchase(true)
        
        const productPrices = await getProducts()
        const priceName = isAnnual ? 'Annual' : 'Monthly'
        const productPrice = productPrices.find(r => r.name.toLowerCase().includes(priceName.toLowerCase()))
        
        
        const address = await apiService.get(`${AppSettings.API_URL}/Paddle/customer/${userData.account.company.customerId}/address`);
        const addressId = address.data.length > 0 ? address.data.data[0].id : ''
        
        const customerInfoBusiness = {
          id: userData.account.company.customerId,
          address:{
            id: addressId
          },
          business: {
            id:  userData.account.company.businessId
          }
        }
        const customerInfoIndividual = {
          id: userData.account.company.customerId,
          address:{
            id: addressId
          }
        }
    
        const customerIndividualWithoutPaddleAddress = {
          id: userData.account.company.customerId,
          address:{
            countryCode: userData.account.address.country.iso2,
            postalCode: userData.account.address.postalCode
          }
        }
    
        const customerBusinessWithoutPaddleAddress = {
          id: userData.account.company.customerId,
          address:{
            countryCode: userData.account.address.country.iso2,
            postalCode: userData.account.address.postalCode
          },
          business: {
            id:  userData.account.company.businessId
          }
        }
    
        const customerInfo = userData.account.company.accountType === AccountTypeEnum.Individual
        ? (addressId !== '' ? customerInfoIndividual : customerIndividualWithoutPaddleAddress)
        : (addressId !== '' ? customerInfoBusiness : customerBusinessWithoutPaddleAddress);
    
        const url  = window.location.href.split('?')[0];

          Paddle.Checkout.open({
            
            settings:{
              successUrl: url + `?PaymentSuccessful=1`,
            },
            items: [
              {
                priceId: productPrice.id,
                quantity: 1,
              },
            ],
            customer: customerInfo,
          })

          setTimeout(() => {
            setOngoingPurchase(false)
          },3000)
      }
    const paddleEventCallback = async(data) => {
      //  if (data.data.name == 'checkout.completed')
      //  {
      //  // window.location.hash = '#PaymentSuccessful'
      //   //window.location.reload()
      //  }
    }
    
    useEffect(() => {
      initializePaddle(userData.allBilling.paddlePaymentSettings, paddleEventCallback);
    },[])

    if (userData)
    {
      if (type == 'subscription')
        return (
          <>
            <div className='credits-info mb-0 mt-auto'>
              <button id='buy-subscription' className={`btn btn-buycredits ${ongoingPurchase ? 'button-loading' : ''}`} onClick={openCheckoutSubscription} disabled={ongoingPurchase || disabled}>{!ongoingPurchase ? 'Select plan' : ''}</button>
            </div>
          </>
        )

      return(
          <>
          {(planId != null && productId != null) ? 
          <>
          <div className='credits-info mb-0'>
            <button id='buy-credits' className={`btn btn-buycredits ${ongoingPurchase ? 'button-loading' : ''}`} onClick={openCheckoutCredits} disabled={ongoingPurchase || disabled}>{!ongoingPurchase ? memberType() == MemberTypeEnum.FREETRIAL ? 'Buy credits' : 'Purchase credits' : ''}</button>
          </div></>
          : null }
        </>
      ) 
    }
}