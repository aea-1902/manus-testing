import { useEffect, useState } from "react";
import { useRouter } from 'next/router';

import { setAuthHeader } from '../utils/axiosHeader'
import Head from 'next/head'

import axios from 'axios'
import '../styles/globals.css'
import '../styles/styles.css?v=1'
import '../styles/typeahead.css'
import "bootstrap/dist/css/bootstrap.min.css";


import { appWithTranslation } from 'next-i18next'

import Header from '../components/Header'
import SideMenu from '../components/SideMenu'
import Footer from '../components/Footer'
import HubspotChatBot from "../components/HubspotChatBot";
import ApiService from "../services/ApiService";
import LoadingScreen from "../components/LoadingScreen";
function MyApp({ Component, pageProps }) {
  const [hasToken, setHasToken] = useState(false)
  const [userData, setUserData] = useState(null)
  const [willReroute, setWillReroute] = useState(false)
  const [hasError, setHasError] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isImpersonated, setIsImpersonated] = useState(false)
  const router = useRouter()
  const currentRoute = router.pathname.toLocaleLowerCase()
  
   
  const [isMaximized, setIsMaximized] = useState(false);
  
  //const currentRoute = router.asPath.toLocaleLowerCase();
  const AppSettings = require('../settings/AppSetting').default
  let route = null
  let hasSideMenu = false
  let hasChatbot = true
  let noindexfollow = false
  switch (currentRoute)
      {
        case '/account':
          route = "Account"
          hasSideMenu = true
          break;
        case '/home':
          route = "Home"
          hasSideMenu = true
          break;
        case '/billing':
          route = "Billing"
          hasSideMenu = true
          break;
        case '/payments':
          route = "Payments"
          hasSideMenu = true
          break;
        case '/webshops':
          route = "Webshops"
          hasSideMenu = true
          break;
        case '/reports':
          route = "Reporting"
          hasSideMenu = true
          break;
        case '/reports/historylogs':
          route = "History Logs"
          hasSideMenu = true
          break;
        case '/audit':
          route = "Audit Logs"
          hasSideMenu = true
          break;
        case '/plugins':
          route = "Plugins"
          hasSideMenu = true
          break;
        case '/wizard':
          route = "Wizard"
          break;
        case '/welcome':
          route = "Welcome"
          break;
        case '/privacy':
          route = "WriteText.ai Privacy Notice"
          noindexfollow = true
          break;
        case '/cookie':
          route = "WriteText.ai Cookie Policy"
          noindexfollow = true
          break;
          
        case '/refund':
          route = "WriteText.ai Refund Policy"
          noindexfollow = true
          break;
        case '/terms':
          route = "WriteText.ai Terms of Service"
          noindexfollow = true
          break;
        case '/suppliers':
          route = "WriteText.ai Suppliers"
          noindexfollow = true
          break;
        case '/privacy/policy':
          route = "WriteText.ai Privacy Notice"
          hasSideMenu = true
          noindexfollow = true
          break;
        case '/cookie/policy':
          route = "WriteText.ai Cookie Policy"
          hasSideMenu = true
          noindexfollow = true
          break;
        case '/terms/policy':
          route = "WriteText.ai Terms of Service"
          hasSideMenu = true
          noindexfollow = true
          break;
        case '/installationservice':
          route = "Installation service"
          hasSideMenu = true
          break;
        case '/cancellationsurvey':
          route = "Cancellation survey"
          hasSideMenu = true
          break;
        case '/admin/loginas':
          route = "Login as"
          hasSideMenu = true
          hasChatbot = false
          break;
        case '/admin/promptsetting':
          route = "Prompt setting"
          hasSideMenu = true
          hasChatbot = false
          break;
        case '/admin/email/[[...slug]]':
          route = "Email transactions"
          hasSideMenu = true
          hasChatbot = false
          break;
        case '/downloads/[...slug]':
          route = "Downloads"
          hasSideMenu = true
          break;
        case '/downloads':
          route = "Downloads"
          hasSideMenu = true
          break;
        case '/extensions':
          route = "Chrome extensions"
          hasSideMenu = true
          break;
        case '/premium':
          route = "Plans & Credits"
          hasSideMenu = true
          break;
        case '/api-keys':
          route = "API Keys"
          hasSideMenu = true
          break;
        case '/email-notifications':
          route = "Email notifications"
          hasSideMenu = true
          break;
        case '/unsubscribe':
          route = "Unsubscribe"
          noindexfollow = true
          break;
        case '/keyword':
          route = "Keyword management"
          hasSideMenu = true
          break;
        case '/keyword/settings':
          route = "Keyword cannibalization monitoring settings"
          hasSideMenu = true
          break;
        case '/keyword/report':
          route = "Keyword cannibalization report"
          hasSideMenu = true
          break;
        case '/templates':
          route = "Templates"
          hasSideMenu = true
          break
        case '/templates/add':
          route = "Templates"
          hasSideMenu = true
          break;
        case '/templates/edit/[templatetype]/[id]':
          route = "Templates"
          hasSideMenu = true
          break;
        case '/templates/master/[templatetype]/[id]':
          route = "Templates"
          hasSideMenu = true
          break;
        case '/templates/master/[templatetype]/preview/[id]':
          route = "Templates"
          hasSideMenu = true
          break;
        default:
          route = "WriteText.ai Platform"
          hasSideMenu = true
          break;
      }
  async function reloadAccount(){
    const accountData = await ApiService.get(`${AppSettings.API_URL}/Account/All?GetAccount=true&GetCredit=true&GetCreditPlans=true&GetPaymentSettings=true&GetBillingInfo=true&GetInstallationPlan=true&Gateway=Paddle`)
    setUserData(accountData.data)
  }

  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js")
    
    async function getAccount(user){
      let account
      let webshops
      const accountData = await ApiService.get(`${AppSettings.API_URL}/Account/All?GetBillingInfo=true&GetCredit=true&GetBillingInfo=true&Gateway=Paddle`)
      
      if (user != null)
      {
        if (user.account.role.name !== AppSettings.WAI_ADMIN)
        { 
              if (user.credit.totalCredits != accountData.data.credit.totalCredits)
                {
                  const credits = accountData.data.credit.credits
                  const latestCreditsTransaction = credits.reduce((latest, current) => {
                    return new Date(current.date) > new Date(latest.date) ? current : latest
                  })
                  let url = window.location.href;
                    url  = window.location.href.split('?')[0]
                  router.replace(url).then(() => {
                    window.location.reload()
                  });
                }
        
                if (user.allBilling.billingInfo.subscriptions == null)
                {
                  if (accountData.data.allBilling.billingInfo.subscriptions != null)
                  {
                    let url = window.location.href;
                      url  = window.location.href.split('?')[0]
                    router.replace(url).then(() => {
                      window.location.reload()
                    });
                  }
                }
                if (user.allBilling.billingInfo.subscriptions != null)
                {
                    if (user.allBilling.billingInfo.subscriptions.nextBillingDate != accountData.data.allBilling.billingInfo.subscriptions.nextBillingDate ||
                      user.allBilling.billingInfo.subscriptions.status != accountData.data.allBilling.billingInfo.subscriptions.status
                    )
                    {   
                      let url = window.location.href;
                        url  = window.location.href.split('?')[0]       
                      router.replace(url).then(() => {
                        window.location.reload()
                      });
                    }
                }
        }
       
      }
    }

    async function initUser(u){
      
        let webshops;
        await ApiService.get(`${AppSettings.API_URL}/Account/All?GetAccount=true&GetCredit=true&GetCreditPlans=true&GetPaymentSettings=true&GetBillingInfo=true&GetInstallationPlan=true&Gateway=Paddle`).then(usr => {
            setUserData(usr.data)
            if (usr.data.account.role.name !== AppSettings.WAI_ADMIN)
            {
              let url = window.location.href;
              let params = new URLSearchParams(window.location.search);
              if (params.toString())
              {
                let qsValue = params.get('PaymentSuccessful');
                if (qsValue === '1')
                {
                  setInterval(() => {
                    getAccount(usr.data)
                  },2000)
                }
              }
              ApiService.get(`${AppSettings.API_URL}/Webshop/GetWebshopURLs?includeDeleted=true`).then(u=> {
                  webshops = u.data
                  if (webshops.length == 0)
                  {       
                    if (currentRoute == '/')
                      router.replace('/downloads');
                  }
                  else
                  {
                    
                    setWillReroute(false);
                       if (currentRoute == "/")
                       {
                        const routeFromStorage = localStorage.getItem('currentRoute')
                        if (routeFromStorage)
                        {
                          if (routeFromStorage.includes('templates'))
                          {
                            router.push('/templates')
                          }
                          else
                          router.push(routeFromStorage)
                        }
                        else
                        {
                          router.push('/home')
                        }
                       }
                       else
                       { 
                         if (currentRoute !== "/signin-callback")
                         {
                          if (!currentRoute.startsWith('/templates/') && !currentRoute.startsWith('/reports/'))
                           router.push(currentRoute)
                         }
                         else
                         {
                          const routeFromStorage = localStorage.getItem('currentRoute')
                          if (routeFromStorage)
                          {
                            router.push(routeFromStorage)
                          }
                          
                           router.push('/')
                         }
                       }
                 }
              })
               
            }
            else
              setWillReroute(false);
        }).catch(err => {
          setHasError(true)
          //router.push('/404'); // Redirect to the custom 404 page
        });
     
    }
    async function getUser() {
      
      const AuthenticationService = require('../services/AuthenticationService').default
      const { Storagekeys } = require('../settings/StorageKeys')
      
      // Check if user is impersonated by looking at session storage
      const loggedInAsUser = JSON.parse(sessionStorage.getItem(Storagekeys.LoggedInAs_Key))
      if (loggedInAsUser !== "undefined" && loggedInAsUser) {
        setIsImpersonated(true)
      }
      
      AuthenticationService.getUser().then(async u => {
        if (u != null)
        {
          
          setHasToken(true)
          setAuthHeader(u.access_token)
          initUser()   
        }
        else
        {
          
          AuthenticationService.login()
        }
        
      })
    }
    
    if (currentRoute !== "/signin-callback" && currentRoute !== "/signout-callback-oidc" && currentRoute !== "/silent-callback")
    {
    
       if (currentRoute !== "/" && currentRoute !== "/home")
       {
        if (currentRoute !== "/admin/loginas")
        {
          if (currentRoute !== "/terms" && currentRoute !== "/privacy" && currentRoute !== "/cookie" && currentRoute !== "/suppliers" && currentRoute !== "/refund" && currentRoute !== "/unsubscribe")
          {
            localStorage.setItem('currentRoute', currentRoute)
          }
        }
       }
    }
    
    if (currentRoute !== "/terms" && currentRoute !== "/privacy" && currentRoute !== "/cookie" && currentRoute !== "/suppliers" && currentRoute !== "/refund" && currentRoute !== "/unsubscribe")
    {
      if (currentRoute !== "/signin-callback")
      {
        if (!hasToken)
          getUser()
      }
    }
    

    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[hasToken])
  
  // Handle admin redirect after impersonation state is properly set
  useEffect(() => {
    if (userData && 
        userData.account && 
        userData.account.role && 
        userData.account.role.name === "Administrator" && 
        !isImpersonated && 
        !currentRoute.startsWith('/admin/') && 
        !currentRoute.startsWith('/signin-callback') && 
        !currentRoute.startsWith('/signout-callback') && 
        !currentRoute.startsWith('/silent-callback')) {
      if (typeof window !== 'undefined') {
        window.location.href = '/admin/loginas'
      }
    }
  }, [userData, isImpersonated, currentRoute])
  

  
 

  
  // Early return for any redirect scenarios to prevent rendering errors
  if (currentRoute == "/signin-callback")
  {
    return (
     <Component {...pageProps} />
    )
  }
  if (hasError)
    return (
      <Component {...pageProps} />
     )
  
  // Early return if we're in a redirect state to prevent any rendering
  // Only redirect if we have userData and can confirm the user is not impersonated
  if (userData && 
      userData.account && 
      userData.account.role && 
      userData.account.role.name === "Administrator" && 
      !isImpersonated && 
      !currentRoute.startsWith('/admin/') && 
      !currentRoute.startsWith('/signin-callback') && 
      !currentRoute.startsWith('/signout-callback') && 
      !currentRoute.startsWith('/silent-callback')) {
    // Immediately redirect without rendering anything
    if (typeof window !== 'undefined') {
      window.location.href = '/admin/loginas'
    }
    return <LoadingScreen />
  }
 
  // Additional safety check - if we're still loading or in transition, show loading
  if (!userData && !["/terms", "/privacy", "/cookie", "/refund", "/suppliers", "/unsubscribe"].includes(currentRoute)) {
    return <LoadingScreen />
  }
  
  return (
    <>
    <Head>
      {(!AppSettings.API_URL.includes("writetextai-api-staging") && !AppSettings.API_URL.includes("writetextai-api-dev")) ? <>
        <script rel="preload"	 src={`https://www.googletagmanager.com/gtag/js?id=${AppSettings.GOOGLE_ANALYTICS}`} defer/>
        <script rel="preload"	 dangerouslySetInnerHTML={{__html: ` window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
    
              gtag('config', '${AppSettings.GOOGLE_ANALYTICS}');`}} defer/>
        </> : <></>}
        <meta name="ga_config" enabled={(!AppSettings.API_URL.includes("writetextai-api-staging") && !AppSettings.API_URL.includes("writetextai-api-dev"))} id={AppSettings.GOOGLE_ANALYTICS} />
      {(!AppSettings.API_URL.includes("writetextai-api-staging") && !AppSettings.API_URL.includes("writetextai-api-dev")) ? <>
      {/* <script type="text/javascript" src="//script.crazyegg.com/pages/scripts/0121/9769.js" async="async"></script> */}
      <script async rel="preload"	 dangerouslySetInnerHTML={{__html:`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
      })(window, document, "clarity", "script", "kpr6idic5s");`}} defer>
      
      </script>
      <script async rel="preload"	 dangerouslySetInnerHTML={{__html: `window._tfa = window._tfa || [];
      window._tfa.push({notify: 'event', name: 'page_view', id: 1038271});
      !function (t, f, a, x) {
            if (!document.getElementById(x)) {
                t.async = 1;t.src = a;t.id=x;f.parentNode.insertBefore(t, f);
            }
      }(document.createElement('script'),
      document.getElementsByTagName('script')[0],
      '//cdn.taboola.com/libtrc/unip/1038271/tfa.js',
      'tb_tfa_script');`}} defer>
      </script> 

      </> : <></>}
      
    <meta name="viewport" content="width=device-width" initial-scale="1.0" />
    <title>{route}</title>
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />

    <link href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@200;300;400;500;600;700&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet"></link>
    <link href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000&family=Plus+Jakarta+Sans:ital,wght@0,200..800;1,200..800&display=swap" rel="stylesheet"></link>
    {/* <link href="https://fonts.googleapis.com/css2?family=Inter:wght@500;700&display=swap" rel="stylesheet" />
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@500;600;700&display=swap" rel="stylesheet" /> */}
    <link rel="icon" type="image/x-icon" href="/favicon_writetext.png" />
    {currentRoute === "/welcome" ? <link rel="preload" href="/images/img-peter-contactpage 1.svg" as="image" /> : <></>}
    {noindexfollow ? <meta name="robots" content="noindex, follow" /> : <meta name="robots" content="noindex, nofollow" />}
    
    <script src="https://cdn.paddle.com/paddle/v2/paddle.js" defer></script>
    {/* <script src="https://cdn.jsdelivr.net/npm/js-beautify@1.14.7/js/lib/beautify-html.min.js" defer></script> */}

    </Head>
    <>
    <Header userData={userData} />
    <div className="d-flex wrapper">
    {!userData && !["/terms", "/privacy", "/cookie", "/refund", "/suppliers", "/unsubscribe"].includes(currentRoute) && (
    <LoadingScreen />
    )}
      {currentRoute !== "/" && !willReroute && hasSideMenu && <SideMenu userData={userData} />}
      {(willReroute && currentRoute == "/welcome") || !willReroute ? 
        willReroute && currentRoute == "/welcome" ? <Component {...pageProps}/> : <Component userData={userData} reloadAccount={reloadAccount} {...pageProps} /> 
        : currentRoute == "/terms" || currentRoute == "/privacy" || currentRoute == "/cookie" || currentRoute == "/refund" || currentRoute == "/suppliers" || currentRoute == "/unsubscribe"
        ? <Component {...pageProps} /> : <div style={{ minHeight: "80vh" }} />}
     {userData && hasChatbot && <HubspotChatBot userData={userData} />}
    </div> 
    {userData && currentRoute !== "/" && 
    <Footer/>
    }
    </>
    
    </>  
  ) 
  
    
  }
   
  

export default appWithTranslation(MyApp)
