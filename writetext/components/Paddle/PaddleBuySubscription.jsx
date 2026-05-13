import { useRouter } from 'next/router' 
import React, { useEffect } from 'react'
import Script from 'next/script'
import apiService from '../../services/ApiService'
import { event } from '../gtm'

import { initializePaddle } from '../../utils/initializePaddle'

export default function PaddleBuySubscription({userData,isAnnual}) {
    const AppSettings = require('../../settings/AppSetting').default
    const router = useRouter()
    
    const paddleToken = "test_9ce8bbcb4cf9bc93bdd21292800"; 
    const getProducts = async () => {
      
       return await apiService.get(`${AppSettings.API_URL}/Paddle/products/subscriptionPlans`)
        .then(response => {
            return response.data
        })
        .then(result => {
         return getProductsPrice(result.data[0].id);
        })
        .catch(error => {
          console.error(error);
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
          console.error(error);
        });
      }
    
    const openCheckoutSubscription = async() => {
        

        const productPrices = await getProducts()
        const priceName = isAnnual ? 'Annual' : 'Monthly';
        const productPrice = productPrices.find(r => r.name === priceName);
        
        const customerInfo = {
            email: userData.account.email,
            address: {
            countryCode: userData.account.address.country.iso2,
            postalCode: userData.account.address.postalCode,
            },
        };

        Paddle.Checkout.open({
          items: [
            {
              priceId: productPrice.id,
              quantity: 1,
            },
          ],
          customer: customerInfo,
        });
      }
    const paddleEventCallbackSubscription = async(data) => {
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
    useEffect(() => {
      initializePaddle(paddleToken, paddleEventCallbackSubscription);
    },[])
    return (
    <>
        <button className='btn buy-button' onClick={openCheckoutSubscription}>Subscribe now</button>
    </>
  )
}