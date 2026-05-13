import React from 'react'
import { useEffect } from 'react'
import { event } from '../components/gtm'
import PaymentSuccessfulModal from './Paddle/PaymentSuccessful';
const Body = ({children, background, classList}) => {
  
  const AppSettings = require('../settings/AppSetting').default
  let userAgent = navigator.userAgent.toLowerCase();

  const successfulPayment = () => {

    const { Modal } = require("bootstrap")
    const myModals = new Modal("#successfulPayment");
    myModals.show()
  }
  const sendGtmEvents = () => {
    let url = window.location.href;
    let params = new URLSearchParams(window.location.search);
    if (params.toString())
    {
      if (params.get('Subscription') != null)
      {
        let subscriptionType = params.get('Subscription')
        if ((!AppSettings.API_URL.includes("writetextai-api-staging") && !AppSettings.API_URL.includes("writetextai-api-dev")))
        {
          const isMonthly = subscriptionType == "Monthly"
          event(isMonthly ? "Subscribe monthly" : "Subscribe annual", {})
        }
      }
      
      if (params.get('Credits') != null)
      {
        function getNumbersFromString(str) {
          const numbers = str.match(/\d+/g) || []
          return numbers.map(Number)
       }
        let subscriptionType = params.get('Credits')
        const numbers = getNumbersFromString(subscriptionType)
        
        if ((!AppSettings.API_URL.includes("writetextai-api-staging") && !AppSettings.API_URL.includes("writetextai-api-dev")))
        {
            event(`Credits ${numbers[0]}`,{})
        }
      }
    }
  }
  useEffect(() => {
    let url = window.location.href;
    let params = new URLSearchParams(window.location.search);
    if (params.toString())
    {
      let qsValue = params.get('PaymentSuccessful');
      // get url and remove the search params
      url  = window.location.href.split('?')[0];
      if (qsValue === '1')
      {
        successfulPayment()
      }
      sendGtmEvents()
    }
  },[])
  return (
    <>
    
    <PaymentSuccessfulModal target="successfulPayment"/>
    <div className={`page-body ${userAgent.includes('firefox') ? 'firefox' : ''} scrollable-container ${background != undefined ? background : ''} ${classList != undefined ? classList : ''}`}>
                {children}
                
    </div>
    </>
  )
}

export default Body