import React from 'react'
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function Policy({type, anonymous}) {
  const AppSettings = require('../settings/AppSetting').default
    const [policy, setPolicy] = useState('')
    useEffect(() => {
        async function Init(){ 
                
            const locale = navigator.language || navigator.userLanguage; 
            const https = require("https");
            const agent = new https.Agent({ rejectUnauthorized: false,   });

            const requestUri = anonymous ? `${AppSettings.API_URL}/Policies/GetPolicyAnonymous?type=${type}` : `${AppSettings.API_URL}/Policies/GetPolicy?type=${type}`;
           
            await axios.get(requestUri, { httpsAgent: agent  }).then(res => {
              setPolicy(res.data.text)
            })
        }
    
        Init()
    },[])// eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={anonymous ? 'anonymous-policy-container' : 'policy-container'}><div dangerouslySetInnerHTML={{ __html: policy }} /></div>
  )
}
