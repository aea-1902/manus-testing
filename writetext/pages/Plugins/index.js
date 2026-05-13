import React, { useState, useEffect } from 'react'
import axios from 'axios'

import Header from '../../components/Header'
import SideMenu from '../../components/SideMenu'
import Body from '../../components/Body'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import PluginsComponent from '../../components/Plugins'
import { setAuthHeader } from '../../utils/axiosHeader'
import { useRouter } from 'next/router'
import Image from 'next/image'
import t from '../../public/translation/locale'

function Plugins({userData}) {
   
    const [user, setUser] = useState([])
    const [translation, setTranslation] = useState(null)
    const router = useRouter()
    
    useEffect(() => {
      async function Init(){
          
      const locale = navigator.language.substring(0,2);
      setTranslation(t[locale] != undefined ? t[locale].Content["Plugins"] : t["en"].Content["Plugins"])
          const https = require("https");
            const httpsAgent = new https.Agent({ rejectUnauthorized: false });
            const AppSettings = require('../../settings/AppSetting').default
            
            
         }
         async function getUser() {
            const AuthenticationService = require('../../services/AuthenticationService').default
            await AuthenticationService.getUser().then(u => {
              if (u == null)
              {
                // AuthenticationService.login()
              }
              
              setAuthHeader(u.access_token)
             // setBillingInfoRequired(loggedAccount.company.requiredBilling)
              setUser(u)
              Init()  
            })
          }
      getUser()
      
    },[])// eslint-disable-line react-hooks/exhaustive-deps

    if (translation && userData)
    return (
        <>
            <Body>
                <Content>
                    <PluginsComponent translation={translation} userData={userData}/>
                </Content>  
            </Body>
        </>
    )
}

export default Plugins