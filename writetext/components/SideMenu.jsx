import React from 'react'
import Link from 'next/link'
import axios from 'axios'
import { setAuthHeader } from '../utils/axiosHeader'

import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import ModalDialog from '../components/Modal'

import ShiningIcon from './ShiningIcon'
import ShiningIconAnimated from './ShiningIconAnimated'


const SideMenu = ({userData}) => {
  const [isClient, setIsClient] = useState(false)
  const [isPageRefreshed, setIsPageRefreshed] = useState(false);
  const router = useRouter();
  const currentRoute = router.pathname;

  const [user, setLoggedUser] = useState([])
  const [credits, setCredits] = useState([])
  const [hasSubscription, setHasSubscription] = useState(false)

  const [totalAvailableCredits, setAvailableCredits] = useState(0)
  const [totalFreeCredits, setFreeCredits] = useState(0)
  const [freeCreditsExpirationDate, setFreeCreditsExpirationDate] = useState(null);
  const [buyCreditsOpened, setBuyCreditsOpened] = useState(false);

  const [fragment, setFragment] = useState('')

  const [successfulLogin, setSuccessfulLogin] = useState(false)
  const [isRouted, setIsRouted] = useState(false)
  const [ongoingPurchase, setOngoingPurchase] = useState(false)
  const AppSettings = require('../settings/AppSetting').default;

  // Function to set isRouted session key when side menu is clicked
  const setRoutedSession = () => {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem('isRouted', 'true');
      console.log('Session key isRouted set to true by side menu click');
    }
  };

  // Enhanced navigation function that sets session key
  const handleSideMenuNavigation = (route) => {
    console.log('Side menu navigation clicked:', route);
    setRoutedSession();
    router.push(route);
  };

  // Debug: Log the current session value on mount (but don't clear it)
  useEffect(() => {
    if (typeof sessionStorage !== 'undefined') {
      const currentValue = sessionStorage.getItem('isRouted');
      console.log('Current isRouted value on mount:', currentValue);
    }
  }, []);

  const buyCredits = () => {
    // setOngoingPurchase(true)
    // setBuyCreditsOpened(true)
    // setTimeout(() => {
    //   setOngoingPurchase(false)
    //   const { Modal } = require("bootstrap")
    //   const myModals = new Modal("#credits");
    //   myModals.show()

    // }, 800);
    setRoutedSession();
    router.push('/premium')
  }

  useEffect(() => {
    setIsClient(true)
    const https = require("https");
    const httpsAgent = new https.Agent({ rejectUnauthorized: false, Authorization: axios.defaults.headers.common['Authorization']});
    async function Init(){
      
      if (userData !== null)
      {
            
        if (userData.account.role.name != AppSettings.WAI_ADMIN)
        {
          if (userData.allBilling.billingInfo.billingInfoId !== "00000000-0000-0000-0000-000000000000")
          {
            if (userData.allBilling.billingInfo.subscriptions.status == "ACTIVE")
              setHasSubscription(true)
          }
        }
        if (userData.account.role.name != AppSettings.WAI_ADMIN)
        {
          
          if (userData.credit.freeCredits.length > 0 )
          {
            setFreeCredits(userData.credit.freeCredits[0].amount)
            setAvailableCredits(userData.credit.totalFreeCredits + userData.credit.totalCredits)
            setFreeCreditsExpirationDate(userData.credit.freeCredits[0].expiryDate)
          }else{
            setFreeCredits(0)
            setAvailableCredits(userData.credit.totalCredits)
          }
  
       
        }
            
      
      }
    }

      async function getUser() {
        const AuthenticationService = require('../services/AuthenticationService').default
        AuthenticationService.getUser().then(u => {
          if (u != null)
          {
            setAuthHeader(u.access_token)
            if (currentRoute !== "/home")
            Init()
            setSuccessfulLogin(true)
          }
          
        })
      }
      getUser()  
    
  },[])// eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
   

    const handleRouteChangeStart = () => {
      // Add logic here to refresh or update the SideMenu
      setIsRouted(true)
    };
    // This function will be called every time the route changes
    const handleRouteChange = () => {
      // Add logic here to refresh or update the SideMenu
      setTimeout(() => {
        setIsRouted(false)
      }, 2000);
    };
    router.events.on('routeChangeStart', handleRouteChangeStart);
    //
    // Subscribe to the router's routeChange event
    router.events.on('routeChangeComplete', handleRouteChange);

    // Cleanup the event listener when the component unmounts
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange);
      router.events.off('routeChangeStart', handleRouteChangeStart);
    };
  }, [router]);
  useEffect(() => {
    // Check if the page is being loaded for the first time
    if (performance.navigation.type === 1) {
      // Page is refreshed
      setIsRouted(true)
    } else {
      // Page is not refreshed
        setIsRouted(false)
    }
  }, []); // Empty dependency array ensures the effect runs only once on mount
  function formatDate(date) {
      
      const d = new Date(date)
      const userLocale = navigator.language.substring(0,2);
      const options = {
        year: 'numeric',
        month: userLocale == 'en' ? 'short' : 'long' ,
        day: 'numeric',
      };
      const formattedDate = d.toLocaleDateString(userLocale, options);
      return formattedDate

  }
  function formatNumber(num) {
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
  }

  function isExpired(date){
    const today = new Date();
    const d = new Date(date);
    return d < today;
  }
    
  if (userData)
      return (
        <>
        {isClient && userData != null && userData.account.role.name === "Administrator" ?
          <div className="sidebar">
          {userData.account.role.name === "Administrator" &&
              <>
                <div className={`sidebar-item d-flex ${currentRoute == "/Admin/LoginAs" && `active`}`} onClick={() => handleSideMenuNavigation('/admin/loginas')}>
                  <div className={` reporting no-bottom-border ${currentRoute == "/Admin/LoginAs" && `active`}`}></div>
                  <div><Link className={`${currentRoute == "/Admin/LoginAs" && `active`}`}  href="/Admin/LoginAs">Login as</Link></div>
                </div>
                <div className={`sidebar-item d-flex  ${currentRoute == "/Admin/PromptSetting" && `active`}`} onClick={() => handleSideMenuNavigation('/admin/promptsetting')}>
                  <div className={` reporting no-bottom-border ${currentRoute == "/Admin/PromptSetting" && `active`}`}></div>
                  <div><Link className={`${currentRoute == "/Admin/PromptSetting" && `active`}`} href="/Admin/PromptSetting">Prompt setting</Link></div>
                </div>
                <div className={`sidebar-item d-flex ${currentRoute == "/Admin/TextServers" && `active`}`} onClick={() => handleSideMenuNavigation('/admin/textservers')}>
                  <div className={` reporting no-bottom-border ${currentRoute == "/Admin/TextServers" && `active`}`}></div>
                  <div><Link className={`${currentRoute == "/Admin/TextServers" && `active`}`} href="/Admin/TextServers">Text servers</Link></div>
                </div>
              </>
          } 
          </div>
        : 
            isClient && 
            <div className="sidebar">
            <ModalDialog target="credits" type="credits" hasSubscription={hasSubscription} userData={userData} opened={buyCreditsOpened}/>
              <div className={`sidebar-item d-flex home ${currentRoute === "/Home" ? `active` : ''}`} onClick={() => handleSideMenuNavigation('/home')}>
                <div className={`home-icon ${currentRoute === "/Home" ? `active` : ''}`} ></div>
                <div><Link className={`${currentRoute === "/Home" ? `active` : ''}`} href="/home">Home</Link></div>
              </div>
      
              <div className={`sidebar-item d-flex account ${currentRoute === "/Account" ? `active` : ''}`} onClick={() => handleSideMenuNavigation('/account')}>
                <div className={`account-icon ${currentRoute === "/Account" ? `active` : ''}`}></div>
                <div><Link className={`${currentRoute === "/Account" ? `active` : ''}`} href="/account">Account</Link></div>
              </div>
      
              <div className={`sidebar-item d-flex premium has-premium ${currentRoute === "/Premium" ? `active` : ''}`} onClick={() => handleSideMenuNavigation('/premium')}>
                  <div className={`premium-icon ${currentRoute === "/Premium" ? `active` : ''}`}></div>
                  <div><Link className={`${currentRoute === "/Premium" ? `active` : ''}`} href="/premium">Plans & Credits</Link></div>
                  {isRouted && <ShiningIconAnimated/>}
                  {!isRouted && <ShiningIcon/>}
                  {/* <div className="shining-icon animated"></div> */}
              </div>
              <div className={`sidebar-item d-flex templates ${currentRoute.includes("/Templates") ? `active` : ''}`} onClick={() => handleSideMenuNavigation('/templates')}>
                  <div className={`templates-icon ${currentRoute.includes("/Templates") ? `active` : ''}`}></div>
                  <div><Link className={`${currentRoute.includes("/Templates") ? `active` : ''}`} href="/templates">Templates</Link></div>
                
              </div>
              <div className={`sidebar-item d-flex webshop ${currentRoute === "/Webshops" ? `active` : ''}`} onClick={() => handleSideMenuNavigation('/webshops')}>
                  <div className={`webshop-icon ${currentRoute === "/Webshops" ? `active` : ''}`}></div>
                  <div><Link className={`${currentRoute === "/Webshops" ? `active` : ''}`} href="/webshops">Linked webshops</Link></div>
                
              </div>
              <div className={`sidebar-item d-flex keywords ${currentRoute === "/Keyword" ? `active` : ''} ${currentRoute === "/Keyword/Settings" ? `active` : ''} ${currentRoute === "/Keyword/Report" ? `active` : ''}`} onClick={() => handleSideMenuNavigation('/keyword')}>
                  <div className={`keywords-icon ${currentRoute === "/Keyword" ? `active` : ''} ${currentRoute === "/Keyword/Settings" ? `active` : ''} ${currentRoute === "/Keyword/Report" ? `active` : ''}`}></div>
                  <div><Link className={`${currentRoute === "/Keyword" ? `active` : ''} ${currentRoute === "/Keyword/Settings" ? `active` : ''} ${currentRoute === "/Keyword/Report" ? `active` : ''}`} href="/keyword">Keyword management</Link></div>
              </div>
              <div className={`sidebar-item d-flex reporting ${currentRoute === "/Reports" ? `active` : ''} ${currentRoute === "/Reports/HistoryLogs" ? `active` : ''}`} onClick={() => handleSideMenuNavigation('/reports')}>
                  <div className={`reporting-icon ${currentRoute === "/Reports" ? `active` : ''} ${currentRoute === "/Reports/HistoryLogs" ? `active` : ''}`}></div>
                  <div><Link className={`${currentRoute === "/Reports" ? `active` : ''} ${currentRoute === "/Reports/HistoryLogs" ? `active` : ''}`} href="/reports">Reporting</Link></div>
              </div>
              <div className={`sidebar-item d-flex extensions ${currentRoute === "/Extensions" ? `active` : ''}`} onClick={() => handleSideMenuNavigation('/extensions')}>
                  <div className={`extensions-icon ${currentRoute === "/Extensions" ? `active` : ''}`}></div>
                  <div><Link className={`${currentRoute === "/Extensions" ? `active` : ''}`} href="/extensions">Chrome extension</Link></div>
              </div>
              <div className={`sidebar-item d-flex payments ${currentRoute === "/Payments" ? `active` : ''}`} onClick={() => handleSideMenuNavigation('/payments')}>
                  <div className={`payments-icon ${currentRoute === "/Payments" ? `active` : ''}`}></div>
                  <div><Link className={`${currentRoute === "/Payments" ? `active` : ''}`} href="/payments">Payments</Link></div>
              </div>
              <div className={`sidebar-item d-flex audit ${currentRoute === "/Audit" ? `active` : ''}`} onClick={() => handleSideMenuNavigation('/audit')}>
                  <div className={`audit-icon ${currentRoute === "/Audit" ? `active` : ''}`}></div>
                  <div><Link className={`${currentRoute === "/Audit" ? `active` : ''}`} href="/audit">Audit trail</Link></div>
              </div>
              <div className={`sidebar-item d-flex apikeys ${currentRoute === "/Api-Keys" ? `active` : ''}`} onClick={() => handleSideMenuNavigation('/api-keys')}>
                  <div className={`keys-icon ${currentRoute === "/Api-Keys" ? `active` : ''}`}></div>
                  <div><Link className={`${currentRoute === "/Api-Keys" ? `active` : ''}`} href="/api-keys">API keys</Link></div>
              </div>
{/* 
              <div className={`sidebar-item d-flex installation ${currentRoute === "/InstallationService" ? `active` : ''}`} onClick={() => handleSideMenuNavigation('/installationservice')}>
                  <div className={`installation-icon ${currentRoute === "/InstallationService" ? `active` : ''}`}></div>
                  <div><Link className={`${currentRoute === "/InstallationService" ? `active` : ''} `} href="/installationservice">Installation service</Link></div>
              </div>
               */}
              <div className={`sidebar-item d-flex plugins ${(currentRoute === "/Downloads" || currentRoute === "/Downloads/[...slug]") ? `active` : ''}`} onClick={() => handleSideMenuNavigation('/downloads')}>
                  <div className={`plugins-icon ${(currentRoute === "/Downloads" || currentRoute === "/Downloads/[...slug]") ? `active` : ''}`}></div>
                  <div><Link className={`${(currentRoute === "/Downloads" || currentRoute === "/Downloads/[...slug]") ? `active` : ''} `} href="/downloads">Downloads</Link></div>
              </div>

              <div className={`sidebar-item d-flex notifications ${currentRoute === "/Email-Notifications" ? `active` : ''}`} onClick={() => handleSideMenuNavigation('/email-notifications')}>
                  <div className={`notifications-icon ${currentRoute === "/Email-Notifications" ? `active` : ''}`}></div>
                  <div><Link className={`${currentRoute === "/Email-Notifications" ? `active` : ''}`} href="/email-notifications">Email notifications</Link></div>
              </div>

              {/* <div className='sidebar-item d-flex billing' onClick={() => router.push('/billing')}>
                  <div className={`billing-icon ${currentRoute === "/Billing" && `active`}`}></div>
                  <div><Link className={`${currentRoute === "/Billing" && `active`}`} href="/billing">Billing</Link></div>
              </div> */}
              {currentRoute !== "/Home" && currentRoute !== "/Billing" && currentRoute !== "/Premium" && currentRoute !== "/" && currentRoute !== "/InstallationService" &&  currentRoute !== "/signin-callback" &&
                
              <div className='mt-40'>
                <div className='credits-info'>
                    <button style={{margin: '0', width: '100%', maxWidth: '185px'}} className={`btn btn-buycredits mb5 ${ongoingPurchase ? 'button-loading' : ''}`} onClick={buyCredits} disabled={ongoingPurchase}>{!ongoingPurchase ? 'Buy Credits' : ''}</button>
                </div>
                <div>
                  <span className='credits-side'>
                    <div>Total credits available: {formatNumber(userData.credit.totalFreeCredits + userData.credit.totalCredits)}</div>
                    
                    {/* {((userData.credit.freeCredits.length > 0 && userData.credit.freeCredits[0].amount) > 0 && isExpired(userData.credit.freeCredits[0].expiryDate)) &&
                    <div className='expiration'>{formatNumber(userData.credit.freeCredits[0].amount)} out of {formatNumber(userData.credit.totalFreeCredits + userData.credit.totalCredits)} had expired on {formatDate(userData.credit.freeCredits[0].expiryDate)}</div>
                    }

                    {((userData.credit.freeCredits.length > 0 && userData.credit.freeCredits[0].amount > 0) && isExpired(userData.credit.freeCredits[0].expiryDate) == false)  &&
                    <div className='expiration'>{formatNumber(userData.credit.freeCredits[0].amount)} out of {formatNumber(userData.credit.totalFreeCredits + userData.credit.totalCredits)} will expire on {formatDate(userData.credit.freeCredits[0].expiryDate)}</div>
                    } */}
                
                  </span>
                </div>
              </div>
              }
            </div>
        }
        
        </>
      )
    
   
   
}

export default SideMenu
