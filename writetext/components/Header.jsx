import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router';
import axios from 'axios'
import { setAuthHeader } from '../utils/axiosHeader'
import { usePathname } from 'next/navigation';
import Image from 'next/image'
import Link from 'next/link'
import ModalDialog from '../components/Modal'

import {Storagekeys} from '../settings/StorageKeys';
const appSetting = require('../settings/AppSetting').default
export default function Header({userData}){
  const [isClient, setIsClient] = useState(false)
  const router = useRouter();
  const currentRoute = router.pathname.toLocaleLowerCase();
  const [hasLoggedUser, setHasLoggedUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  let anonymous = false;
  switch (currentRoute)
  {
    case '/privacy':
      anonymous = true;
      break;
    case '/cookie':
      anonymous = true;
      break;
      
    case '/refund':
      anonymous = true;
      break;
    case '/terms':
      anonymous = true;
      break;
    case '/suppliers':
      anonymous = true;
      break;
    case '/privacy/policy':
      anonymous = false;
      break;
    case '/cookie/policy':
      anonymous = false;
      break;
    case '/terms/policy':
      anonymous = false;
      break;
    case '/unsubscribe':
      anonymous = true;
      break;
    default:
      anonymous = false;
      break;
  }

  const showModal = () => {
    
    let loggedInUser = JSON.parse(sessionStorage.getItem(Storagekeys.LoggedInAs_Key));
    if(loggedInUser === null){
      
    const { Modal } = require("bootstrap")
    const myModals = new Modal("#logout");
    myModals.show()
    }
    else
    {
      Signout()
    }
  }
  function formatNumber(num) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}
  function SignIn(){
      const AuthenticationService = require('../services/AuthenticationService').default
      window.location.href = "/"
  }
  
  async function Signout(){
    const AuthenticationService = require('../services/AuthenticationService').default
    await AuthenticationService.logout()

    const localStorageKey = 'templatesAccordionStates';
    localStorage.removeItem(localStorageKey);
    sessionStorage.removeItem('isRouted');
  }

  useEffect(() => {
    setIsClient(true)
    const AppSettings = require('../settings/AppSetting').default
    const https = require("https");
    const httpsAgent = new https.Agent({ rejectUnauthorized: false, Authorization: axios.defaults.headers.common['Authorization']});
    async function initUser(){
      // await axios.get(`${AppSettings.API_URL}/Account/GetAccount`,{ httpsAgent } ).then(usr => {
      //   setLoggedUser(usr.data)
      // })
    //  await axios.get(`${AppSettings.API_URL}/Reporting/CreditBalance`,{ httpsAgent }).then(r => {
    //     setCredits(r.data);
    //   });
    }
    async function getUser() {
      const AuthenticationService = require('../services/AuthenticationService').default
      AuthenticationService.getUser().then(u => {
        if (u != null)
        {
          setHasLoggedUser(true)
          setAuthHeader(u.access_token)
          initUser()   
          //setSuccessfulLogin(true)
        }
        else
        {
          setHasLoggedUser(false)
        }
        
      })
    }
    getUser()
  },[])

  const handleNavigation = () => {
    const AuthenticationService = require('../services/AuthenticationService').default
    AuthenticationService.getUser().then(u => {
    if(u.profile.role === "Administrator"){
      window.location.href = "/";
    }
    else{
      window.location.href = "/home";
    }
  })
  }

  if (anonymous || (userData))
  return (
    <>
    <nav className="navbar">
      <Link href="https://writetext.ai/" target='_blank'>
          <Image src="/images/logo_writetext.svg" className="d-inline-block align-top"  width="200" height="34" alt="logo_writetext" priority/>
      </Link>
      <div className='d-flex'>
        
      {!anonymous && isClient && userData != undefined ?
      <>
        <div className='user font-13'>
          <p className='d-flex'><Image src="/images/ic_profile.svg" width="16" height="18" alt="User"></Image>Welcome, {userData.account.firstName}</p>
        </div>
        <div>
          {userData.account.role.name !== "Administrator" && 
          <div className='font-13 credit-count'>
             <p>{formatNumber(userData.credit.totalFreeCredits + userData.credit.totalCredits)} {(userData.credit.totalFreeCredits + userData.credit.totalCredits) > 1 ? "credits" : "credit"}</p>
            
          </div>}
        </div>
        <div className='support'>
          <a className='link' href='https://writetext.ai/create-a-ticket' target='_blank'>Support</a>
        </div>
        <div className='logout' >
          <a className='link' onClick={showModal}>Log out</a>
        </div>
      <ModalDialog target="logout" type="logout" click={Signout}/></>
      : 
      <div >
        {hasLoggedUser != null && <input type='button' className='btn btn-primary' onClick={handleNavigation} value={hasLoggedUser ? 'Go to home' : 'Sign in'} style={{width: '126px'}}/>}
        
      </div>
      }
        
      </div>
    </nav>
  </>
  )
}


