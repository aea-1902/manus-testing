import React, { useEffect, useState } from "react";
import { useRouter } from 'next/router';
import { usePathname } from 'next/navigation';

import { setAuthHeader } from '../utils/axiosHeader'
import Head from 'next/head';

import axios from 'axios'

import { appWithTranslation } from 'next-i18next'

import Header from '../components/Header'
import SideMenu from '../components/SideMenu'
import Footer from '../components/Footer'

import {authenticate} from '../utils/authProvider'
function Layout({children}) {
    const SSR = typeof window === 'undefined'
    const [hasToken, setHasToken] = useState(false)
    const [user, setLoggedUser] = useState(null)
    const [credits, setCredits] = useState(null)
    const [loaded, setLoaded] = useState(false)
    const [hasSubscription, setHasSubscription] = useState(false)
    const [billingInfo, setBillingInfo] = useState(null)
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    let _userBillingInfo = null;
    let hasSideMenu = false;
    const router = useRouter();
    const currentRoute = usePathname().toLocaleLowerCase();
    let route = null;
    
    switch (currentRoute)
    {
      case '/account':
        route = "Account";
        hasSideMenu = true;
        break;
      case '/home':
        route = "Home";
        hasSideMenu = true;
        break;
      case '/billing':
        route = "Billing";
        hasSideMenu = true;
        break;
      case '/payments':
        route = "Payments";
        hasSideMenu = true;
        break;
      case '/webshops':
        route = "Webshops";
        hasSideMenu = true;
        break;
      case '/reports':
        route = "Reporting";
        hasSideMenu = true;
        break;
      case '/reports/historylogs':
        route = "History Logs"
        hasSideMenu = true;
        break;
      case '/audit':
        route = "Audit Logs"
        hasSideMenu = true;
        break;
      case '/plugins':
        route = "Plugins"
        hasSideMenu = true;
        break;
      case '/wizard':
        route = "Wizard"
        break;
      case '/privacy':
        route = "Privacy";
        break;
      case '/cookie':
        route = "Cookies";
        break;
      case '/terms':
        route = "Terms";
        isAnonymous = true;
        break;
      case '/suppliers':
        route = "Suppliers";
        isAnonymous = true;
        break;
      
      case '/privacy/policy':
        route = "Privacy";
        isAnonymous = true;
        hasSideMenu = true;
        break;
      case '/cookie/policy':
        route = "Cookies";
        isAnonymous = true;
        hasSideMenu = true;
        break;
      case '/terms/policy':
        route = "Terms";
        hasSideMenu = true;
        break;
      case '/installationservice':
        route = "Installation service";
        hasSideMenu = true;
        break;
      case '/cancellationsurvey':
        route = "Cancellation survey";
        hasSideMenu = true;
        break;
      default:
        route = false;
        break;
    }
  
    useEffect(() => {
      require("bootstrap/dist/js/bootstrap.bundle.min.js");
  
      async function initUser(u){
        
        const AppSettings = require('../settings/AppSetting').default
        const axiosInstance = require('../utils/axiosInstance').default
        const https = require("https");
        const httpsAgent = new https.Agent({ rejectUnauthorized: false, Authorization: axios.defaults.headers.common['Authorization']});
        //if (axios.defaults.headers.common['Authorization'] !== '')
        //{
          await axios.get(`${AppSettings.API_URL}/Account/All?GetAccount=true&GetCredit=true&GetCreditPlans=true&GetPaymentSettings=true&GetBillingInfo=true&GetInstallationPlan=true&Gateway=PayPal`,{ httpsAgent } ).then(usr => {
           
         //await axiosInstance.get(`/Account/All?GetAccount=true&GetCredit=true&GetCreditPlans=true&GetPaymentSettings=true&GetBillingInfo=true&GetInstallationPlan=true&Gateway=PayPal` ).then(usr => {
            setUserData(usr.data)
            if (usr.data.account.role.name == "Administrator")
            {
              router.push('/Admin/LoginAs')
            }
            else
            {
              // if (usr.data.allBilling.billingInfo.billingInfoId === "00000000-0000-0000-0000-000000000000")
              // {       
              //   router.push('/wizard')
              // }
              // else
              // {
                let routeFromStorage = localStorage.getItem('currentRoute')
                if (routeFromStorage != null)
                {
                  router.push(routeFromStorage)
                }
                else
                {
                  if (currentRoute == "/")
                  {
                    router.push('/home')
                  }
                  else
                  { 
                    if (currentRoute !== "/signin-callback")
                    {
                      router.push(currentRoute)
                    }
                    else
                    {router.push('/home')}
                  }
                }
              //}
            }
            
          })
       
       // }
      }
      
      async function getUser() {
        
        const AuthenticationService = require('../services/AuthenticationService').default
        await AuthenticationService.getUser().then(async u => {
          if (u != null)
          {
            setLoading(false)
            
            setHasToken(true)
            setAuthHeader(u.access_token)
            localStorage.setItem('jwtToken', u.access_token)
           // console.log(u)
           
             initUser()   
          }
          else
          {
            //debugger
             //AuthenticationService.login()
          }
          
        })
      }
      
      if (currentRoute !== "/signin-callback" && currentRoute !== "/signout-callback-oidc" && currentRoute !== "/silent-callback")
      {
        if (currentRoute === "/")
        {
          localStorage.setItem('currentRoute', '/home');
        }
        else
        { 
          localStorage.setItem('currentRoute', currentRoute)
        }
      }
      if (currentRoute !== '/terms' && currentRoute !== '/signin-callback')
      {
        //debugger
        //authenticate()
        getUser()
        //initUser()
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])
  
  
  return (
    <>
    <Header userData={userData} />
    <div className="d-flex">
     {hasSideMenu && <SideMenu userData={userData} />}
    {/* {React.cloneElement(children, {userData: userData})} */}
    </div> 
    {userData && 
    <Footer/>}
    </>
  )
}

export default Layout