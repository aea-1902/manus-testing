import { useRouter } from 'next/router' 
import React, { useEffect } from 'react'
import Script from 'next/script'
import apiService from '../../services/ApiService'
import { event } from '../gtm'
import { initializePaddle } from '../../utils/initializePaddle'
export default function PaddleBuyCredits({userData, productId, planId}) {
  
  const AppSettings = require('../../settings/AppSetting').default
  const router = useRouter()
  const paddleToken = "test_f027a523c2a31e80f2a35ab496a"; 
  const openCheckout = async() => {

    const productResponse = await apiService.post(`${AppSettings.API_URL}/Paddle/pricing?planId=${planId}&productId=${productId}`)
    const productPriceId = productResponse.data.data.id
    const itemsList = [
      {
        priceId: productPriceId,
        quantity: 1,
      },
    ];
    
    const customerInfo = {
      email: userData.account.email,
      address: {
        countryCode: userData.account.address.country.iso2,
        postalCode: userData.account.address.postalCode,
      },
    };
    Paddle.Checkout.open({
      items: itemsList,
      customer: customerInfo
    });
  }

  useEffect(() => {
    initializePaddle(paddleToken, paddleEventCallbackCredits);
  },[])
  const paddleEventCallbackCredits = async(data) => {
    if (data.name == "checkout.completed") {
      apiService.post(`${AppSettings.API_URL}/Paddle/transaction/${data.data.transaction_id}/${data.data.items[0].price_name}/complete`)
      .then(response =>{
        
          if (response.data.transactionType == "subscription")
          {
            apiService.post(`${AppSettings.API_URL}/Billing/registerSubscription?id=` + response.data.transactionId + `&gateWay=Paddle`)
                .then(res => {
                    if(!AppSettings.API_URL.includes("writetextai-api-dev"))
                    {
                        event(!isAnnual ? "Subscribe monthly" : "Subscribe annual", {})
                    }
                      router.reload()
                  })
          }else
          {
            if (!AppSettings.API_URL.includes("writetextai-api-dev"))
              {
                  event(`Credits ${credits}`,{})
              }
            router.reload()
          }
      })
    }
  }
  return (
    <>
        <button className='btn buy-button' onClick={openCheckout}>Purchase Credits Now</button>
    </>
  )
}
