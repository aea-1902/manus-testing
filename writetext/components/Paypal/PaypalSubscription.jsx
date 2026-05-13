import React, {useEffect, useState} from 'react'
import { useRouter } from 'next/router' 
import axios from 'axios'
import Image from 'next/image'
import {
    PayPalButtons,
    usePayPalScriptReducer
} from '@paypal/react-paypal-js'

import { event } from '../gtm'
export default function PaypalSubscription({ subscription_id, amount , subscriptionMessage, isMonthly}) {
    
    const AppSettings = require('../../settings/AppSetting').default

    const router = useRouter()
    const https = require("https");
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

    const [{ options, isPending, isResolved, isRejected }, dispatch] = usePayPalScriptReducer();
    const [paypalsubscriptionid, updatePaypalSubscriptionId] = useState(null)
    const [ongoingPayment, setOngoingPayment] = useState(false)
    const [error, setError] = useState(null);

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

    const handleError = (err) => {
        setError(err.message);
    };

    return (
        
        <div className="paypal-button-container">
        {isPending && <Image src="https://writetextaistorage.z6.web.core.windows.net/ic_loader_writetext_backend.gif" width={100} height={100} alt="loader"></Image>}
        {isRejected && <p>There is an issue connecting to PayPal and you may need to refresh the page to try again.
         If the issue persists, it might be an issue with your browser, and you may need to update it to the latest version or clear your cache and cookies to resolve the problem.</p>}
            {!isPending && 
            <>
            {!ongoingPayment ? 
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
                setOngoingPayment(true)
                if((!AppSettings.API_URL.includes("writetextai-api-staging") && !AppSettings.API_URL.includes("writetextai-api-dev")))
                {
                    event(isMonthly ? "Subscribe monthly" : "Subscribe annual", {})
                }
                updatePaypalSubscriptionId(data.subscriptionID)
            }}

            onError={(err) => {
                handleError(err)
                setOngoingPayment(false)
            }
            }
            style={{
                label: "paypal",
                layout: "horizontal",
                tagline: false
            }}
           // fundingSource="paypal"
        /> : <Image src="https://writetextaistorage.z6.web.core.windows.net/ic_loader_writetext_backend.gif" width={100} height={100} alt="loader"></Image>}</>
            }
         
           
            
        </div>
    )
}