import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

import Header from '../../components/Header'
import SideMenu from '../../components/SideMenu'
import Body from '../../components/Body'
import Content from '../../components/Content'
import Footer from '../../components/Footer'

import AccountComponent from '../../components/Account'

import { setAuthHeader } from '../../utils/axiosHeader'
import Link from 'next/link'
import { FloatingLabel, Form } from 'react-bootstrap';
import { Hint, Typeahead } from 'react-bootstrap-typeahead';

import 'react-bootstrap-typeahead/css/Typeahead.css';
import 'react-bootstrap-typeahead/css/Typeahead.bs5.css';
import ModalDialog from '../../components/Modal'
import ModalPrompt from '../../components/ModalPrompt'
import t from '../../public/translation/locale'


export default function Account({userData}){
    const SSR = typeof window === 'undefined'

    const [user, setLoggedUser] = useState(null)
    const [credits, setCredits] = useState(null)
    const https = require("https");
    const httpsAgent = new https.Agent({ rejectUnauthorized: false })

    const [translation, setTranslation] = useState(null)
    const [hasSubscription, setHasSubscription] = useState(false)
    const AppSettings = require('../../settings/AppSetting').default
    
    const router = useRouter()
    const [showButton, setShowButton] = useState(false);

    // Callback function to set showButton to true after the Account component is rendered
      const handleRender = () => {
          setShowButton(true);
      };
    
    useEffect(() => {
      
      const locale = navigator.language.substring(0,2); 
      setTranslation(t[locale] != undefined ? t[locale] : t["en"])
        async function Initialize(u) {


            await axios.get(`${AppSettings.API_URL}/Billing/GetBillingInfo?gateway=PayPal`,{ httpsAgent }).then(info => {
              if (info.data.billingInfoId === "00000000-0000-0000-0000-000000000000")
              {
               // router.push('/wizard')
              }
              else
              {
                if (info.data.subscriptions.status == "ACTIVE")
                setHasSubscription(true)
              }
            })
  
            // await axios.get(`${AppSettings.API_URL}/Account/GetAccount`,{ httpsAgent }).then(usr => {
            //     setLoggedUser(usr.data)
            //     axios.get(`${AppSettings.API_URL}/Reporting/CreditBalance`,{ httpsAgent }).then(r => {
            //         setCredits(r.data);
            //       });
                
            // })

        }

      // async function getUser() {
      //   const AuthenticationService = require('../../services/AuthenticationService').default
      //   await AuthenticationService.getUser().then(u => {
      //     if (u == null)
      //     {
      //       AuthenticationService.login()
      //     }
          
      //     setAuthHeader(u.access_token)
      //     Initialize()   
      //   })
      // }
      
      //getUser()
      
    },[])// eslint-disable-line react-hooks/exhaustive-deps




    if (translation && userData)
    
  return (
    
        // credits ?
        <>
        <ModalPrompt target="message"></ModalPrompt>
        
            <Body>
                <Content>
                    <AccountComponent userData={userData} translation={translation.Content["Account"]} onRender={handleRender}/>
                </Content>
            </Body>
        </>
        // : null
        
          
  )
}
