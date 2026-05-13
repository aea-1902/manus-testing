import React from 'react'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from '../../components/Header'
import SideMenu from '../../components/SideMenu'
import Content from '../../components/Content'
import PolicyComponent from '../../components/Policy'
import Footer from '../../components/Footer'

import Body from '../../components/Body'
import {PolicyEnum} from "../../enum/PolicyType"
import { setAuthHeader } from '../../utils/axiosHeader'
export default function Policy({onlogout}) {
    
    const SSR = typeof window === 'undefined'
    const AppSettings = require('../../settings/AppSetting').default
    const [hasAddress, setHasAddress] = useState(false)
    const [acceptedTos, setAcceptedTos] = useState(true)
    const [loggedUser, setLoggedUser] = useState(null)
    const [user, setUser] = useState(null)
    const [error, setError] = useState(null)
    useEffect(() => {
        async function Init(){ 
            
            const locale = navigator.language || navigator.userLanguage; 
            const headers = {
            'Accept-Language': locale
            };

            const https = require("https");
            const agent = new https.Agent({ rejectUnauthorized: false,   });
                await axios.get(`${AppSettings.API_URL}/Account/GetAccount`,{ httpsAgent: agent  }).then(usr => {
                    if (usr.data.address != null){
                        if (usr.data.address.addressId != "00000000-0000-0000-0000-000000000000")
                            setHasAddress(true)
                            axios.get(`${AppSettings.API_URL}/Policies/GetAcceptedPolicy?type=${PolicyEnum.CookiePolicy}`,{ httpsAgent: agent  }).then(r => {
                                if (r.data != null)
                                {
                                    setAcceptedTos(r.data)
                                };
                            });
                    }
                    setLoggedUser(usr.data)
                })
        }
        async function getUser() {
            const AuthenticationService = require('../../services/AuthenticationService').default
            try
            {
              await AuthenticationService.getUser().then(u => {
                if (u == null)
                {
                  // AuthenticationService.login()
                }
                setAuthHeader(u.access_token)
                setUser(u)
                Init()
              })
            }
            catch(e){
              handleError(e)
            }
        }
        getUser()
    },[])// eslint-disable-line react-hooks/exhaustive-deps

    function AcceptPolicy()
    {
      axios.post(`${AppSettings.API_URL}/Policies/AcceptPolicy?type=${PolicyEnum.CookiePolicy}`,  { httpsAgent }).then(res => {
  
      })
    }

    const handleError = (e) => {
      setError(e.message);
    };

if (loggedUser)
  return (
    <>
    {/* <Header user={loggedUser.firstName} onlogout={onlogout} /> */}
        <Body>
            {/* <SideMenu userRole={loggedUser.role} authenticationType={""} /> */}
            <Content backgroundclass={"scrollable-container steps"}>
                    <PolicyComponent type={PolicyEnum.CookiePolicy} />
            </Content>
        </Body>
        
    {/* <Footer/> */}
    </>
  )
}
