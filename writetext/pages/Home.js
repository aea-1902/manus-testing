
import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Body from '../components/Body'
import Content from '../components/Content'
import Link from 'next/link'
import proTips from '../public/protips/tips'
import ApiService from '../services/ApiService'
import { HttpResponse } from '../enum/HttpResponse'
import { MemberTypeEnum } from '../enum/MemberType'
import {PolicyEnum} from "../enum/PolicyType"
import { formatTrialDate } from '../utils/helper'

const Home = ({userData}) => {
  const router = useRouter()
  const modalRef = useRef()

  const [credits, setCredits] = useState(null)

  const [totalAvailableCredits, setAvailableCredits] = useState(null)
  const [totalFreeCredits, setFreeCredits] = useState(null)
  const [freeCreditsExpirationDate, setFreeCreditsExpirationDate] = useState(null)

  const [acceptedTos, setAcceptedTos] = useState(true)
  
  const [dashboard, setDashboard] = useState(null)
  const [buyCreditsOpened, setBuyCreditsOpened] = useState(false)


  const [fragment, setFragment] = useState('')
  
  const [translation, setTranslation] = useState(null)
  const [hasSubscription, setHasSubscription] = useState(true)

  const [proTip, setProTip] = useState(null)
  
  const [ongoingPurchase, setOngoingPurchase] = useState(false)
  const AppSettings = require('../settings/AppSetting').default

  let buying = false
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
  useEffect(() => {
    
        async function Init(){ 
          
      ApiService.get(`${AppSettings.API_URL}/Reporting/Dashboard`)
      .then(response => setDashboard(response.data))
      let t = []
      const loadJson = async () => {
        const {default: loadJson } = await import('../public/translation/locale')
        t = loadJson
      } 
      await loadJson()
      
      const locale = navigator.language.substring(0,2); 
      setTranslation(t[locale] != undefined ? t[locale].Content["Home"] : t["en"].Content["Home"])
      const randomNumber = Math.floor(Math.random() * 4) + 1
      setProTip(proTips[randomNumber].Content)
      
      const fragment = window.location.hash.substr(1);
      
      if (fragment != '')
      {
        setFragment(fragment)
      }

      if (userData !== null && userData.allBilling !== null)
      {
        
        if (userData.allBilling.billingInfo.billingInfoId === "00000000-0000-0000-0000-000000000000")
        {       
          //router.push('/wizard')
        }
        else
        {
          if (userData.allBilling.billingInfo.subscriptions.status == "ACTIVE")
            setHasSubscription(true)
        }
        
        setCredits(userData.credit);
        if (userData.credit.freeCredits.length > 0)
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

    async function getUser() {
        const AuthenticationService = require('../services/AuthenticationService').default
          await AuthenticationService.getUser().then(async u  => {
            if (u == null) {
              AuthenticationService.login()
            }
            await Init()
          })
    }
    
    getUser()
  },[])// eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (userData !== null && router.isReady) { // Check if router is ready
      setTimeout(() => {
      if (window.location.hash.substr(1) == 'buy-credits' && !buying)
        {
          buyCredits()
        }
      }, 1000);
    }
  }, [router.isReady]);
  async function AcceptPolicy()
  {
    
    const policies = await ApiService.post(`${AppSettings.API_URL}/Policies/AcceptPolicy?type=${PolicyEnum.TermsOfService}`)
    if (policies.status == HttpResponse.HttpOk)
    {
      setAcceptedTos(true)
      router.reload()
    }
  }
  const buyCredits = () => {
    // setBuyCreditsOpened(true)
    // setOngoingPurchase(true)
    // buying = true
    // const { Modal } = require("bootstrap")
    // const myModals = new Modal("#credits");
    // myModals.show()
    
    // setOngoingPurchase(false)
    router.push('/premium')
  }
  function getFormattedDate(dateString) {
    const dateObject = new Date(dateString);
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const month = monthNames[dateObject.getMonth()];
    const day = String(dateObject.getDate());
    const year = dateObject.getFullYear();
    return `${month} ${day}, ${year}`;
  }

  function getFormattedTime(dateString) {
      const timeObject = new Date(dateString);
      const hours = String(timeObject.getHours()).padStart(2, '0');
      const minutes = String(timeObject.getMinutes()).padStart(2, '0');
      return `${hours}:${minutes}`;
  }
  
  const hasProAccess = () => {
    return userData.credit.hasProAccess;
  }

  
  const isFreeTrial = () => {
    return userData.credit.membershipType == MemberTypeEnum.FREETRIAL;
  }

  const isFreeTrialEnded = () => {
    const freeTrialExpiration = new Date(userData.credit.subscriptionExpiration);
    const today = new Date();
    return userData.credit.membershipType == MemberTypeEnum.FREETRIAL && freeTrialExpiration <= today;
  }

  const freeTrialEndDate = () => {
    return formatTrialDate(userData.credit.subscriptionExpiration);
  }

    if (translation && userData && proTip ){
        return (
          <>
            <Body background="blur-bg">
              <Content >
              {!userData.account.hasAcceptedLatestTerms && 
              <div className='header-tos'>
                <div>
                  <p className='tos-title'>We&apos;ve updated our terms</p>
                  <p className='tos-text'>We encourage you to review our updated <a href='/terms/Policy' target='_blank'>Terms of Service.</a> By continuing, you agree to the updated Terms.</p>
                </div>
                {userData.account.isLatestTermsRequired && 
                <div className="d-flex ml-auto"><button className="btn btn-primary tos-btn"  onClick={AcceptPolicy}>I agree</button> </div>}
                
                {!userData.account.isLatestTermsRequired &&
                <div className="d-flex ml-auto"><button className="btn btn-primary tos-btn btn-close"  onClick={AcceptPolicy}></button> </div>}
              </div>
              }
              <div className="header-dashboard">
                <p>{translation["PageHeaderText"]}</p>  
              </div>
              {isFreeTrial() && !isFreeTrialEnded() &&
              <div className={`header-tos free-trial-banner`}>
                  <div>
                    <p className={`banner-title mb-0`}>You&apos;re on free trial until {freeTrialEndDate()}.</p>
                    {/* <p className={`${style.bannerText} mb-0`}>To continue using WriteText.ai, you can purchase prepaid credits for text generation or subscribe to the Pro plan to retain full access—including SEO tools and automation.</p> */}
                  </div>
              </div>
              }
              {isFreeTrial() && isFreeTrialEnded() &&
              <div className={`header-tos free-trial-banner`}>
                  <div>
                    <p className="banner-title">Your free trial has ended.</p>
                    <p className="banner-text mb-0" style={{maxWidth: "740px"}}>To continue using WriteText.ai, purchase a credit bundle under Starter for text generation features or subscribe to the Pro plan to unlock SEO and automation tools.</p>
                  </div>
                  <div className='ms-auto mt-auto'>
                    <button className="btn btn-primary" onClick={() => router.push('/premium')} style={{width: '190px'}}>Go to Plans & Credits</button>
                  </div>
              </div>
              }
              <div className='d-flex mb-14 pro-tips'>
                <div className='pro-tip-label'>
                  <div className='pro-tip-icon'></div>
                  <div><p>pro tip</p></div>
                </div>
                <div>
                  <p className='tips-title'>{proTip["Title"]}</p>
                  <p className='tips-text'>{proTip["Description"]}</p>
                  {proTip["BuyCredits"] == true ? <label className='protip-link' onClick={buyCredits}>Buy Credits</label>  : proTip["Link"] != undefined ? <Link className='protip-link' href={proTip["Link"]}>{proTip["LinkText"]}</Link> : null}
                  
                </div>
                <div className='tips-image' dangerouslySetInnerHTML={{__html: proTip["Image"]}}></div>
              </div>
              <div className="container credits-info">
                              {/* {(!isFreeTrial() || (isFreeTrial() && !isFreeTrialEnded())) && 
                <div className="row credits p-40 mb-14">
                  <div className="d-flex center p-0">
                    <div className='home-credit-display'>
                      <div style={{margin: 'auto 0'}}>Total credits available: <label>{(userData.credit.totalFreeCredits + userData.credit.totalCredits) > 0 ? formatNumber(userData.credit.totalFreeCredits + userData.credit.totalCredits) : 0} {(userData.credit.totalFreeCredits + userData.credit.totalCredits) > 1 ? "credits" : "credit"}</label></div>
                    </div>
                  </div>
                </div>
                } */}
                
                {(!isFreeTrial() || (isFreeTrial() && !isFreeTrialEnded())) && 
                <div className="row credits p-40 mb-14">
                  <div className="d-flex center p-0">
                    <div className='home-credit-display'>
                      <div style={{margin: 'auto 0'}}>Total credits available: <label>{(userData.credit.totalFreeCredits + userData.credit.totalCredits) > 0 ? formatNumber(userData.credit.totalFreeCredits + userData.credit.totalCredits) : 0} {(userData.credit.totalFreeCredits + userData.credit.totalCredits) > 1 ? "credits" : "credit"}</label></div>

                      {(userData.credit.expiringDate !== undefined && userData.credit.expiringDate !== null) &&                      
                      <div className='expiration mt-10'>{userData.credit.expiringCredits !== undefined ? formatNumber(userData.credit.expiringCredits): 0}  {(userData.credit.totalFreeCredits + userData.credit.totalCredits) > 1 ? "credits" : "credit"} {isExpired(userData.credit.expiringDate) ? "had expired on" : "will expire on"} {formatDate(userData.credit.expiringDate)}</div>
                      }
                    
                    </div>
                    {(userData.credit.totalFreeCredits + userData.credit.totalCredits) !== null && 
                    
                    <div className='pull-right'>

                    <button style={{width: "124px"}} className={` btn btn-primary ${ongoingPurchase ? 'button-loading' : ''}`} onClick={buyCredits} disabled={ongoingPurchase}>{!ongoingPurchase ? 'Buy Credits' : ''}</button>
                      
                    </div>
                    }
                  </div>
               
                </div>
                }
                {dashboard != null && 
                <>
                  <div className="d-flex dashboard-cards">
                    <div style={{width: "100%", maxWidth: "265px"}}>
                      <div className="card mb-14">
                        <div className="card-body">
                          <p className="card-title">{formatNumber(dashboard.generatedPageTitle)}</p>
                          <p className="card-text">Total meta title generated</p>
                        </div>
                      </div>
                      <div className="card mt-7">
                        <div className="card-body">
                          <p className="card-title">{formatNumber(dashboard.generatedOpenGraphText)}</p>
                          <p className="card-text">Total Open Graph generated</p>
                        </div>
                      </div>
                    </div>
                    <div style={{width: "100%", maxWidth: "265px"}}>
                      <div className="card mb-14">
                        <div className="card-body">
                          <p className="card-title">{formatNumber(dashboard.generatedPageDescription)}</p>
                          <p className="card-text">Total page description generated</p>
                        </div>
                      </div>
                      <div className="card mt-7">
                        <div className="card-body">
                          <p className="card-title">{formatNumber(dashboard.generatedExcerpt)}</p>
                          <p className="card-text">Total product short description generated</p>
                        </div>
                      </div>
                    </div>
                    <div style={{width: "100%", maxWidth: "265px"}}>
                      <div className="card mb-14">
                        <div className="card-body">
                          <p className="card-title">{formatNumber(dashboard.generatedProductDescription)}</p>
                          <p className="card-text">{translation["TotalProductDescriptionGenerated"]}</p>
                        </div>
                      </div>
                      <div className="card mt-7">
                        <div className="card-body">
                          <p className="card-title">{formatNumber(dashboard.transferredText)}</p>
                          <p className="card-text">{translation["TotalTransferredTexts"]}</p>
                        </div>
                      </div>
                    </div>
                    <div style={{width: "100%", maxWidth: "265px"}}>
                      <div className="card mb-14">
                        <div className="card-body">
                          <p className="card-title">{formatNumber(dashboard.keywordAnalysis)}</p>
                          <p className="card-text">{translation["TotalKeywordAnalysis"]}</p>
                        </div>
                      </div>
                      <div className="card mt-7">
                        <div className="card-body">
                          <p className="card-title">{formatNumber(dashboard.generatedImageAltText)}</p>
                          <p className="card-text">{translation["TotalImageAltTextGenerated"]}</p>
                        </div>
                      </div>
                    </div>
                </div>
                {dashboard.lastUpdated != null && <div className="d-flex dashboard-info"><p className="mx-auto">Data refreshes every 24 hours. Last updated on {getFormattedDate(dashboard.lastUpdated)}, at {getFormattedTime(dashboard.lastUpdated)}.</p></div>
              }
                </>
                }
                
              </div>
              <div>
    
              </div>
    
              </Content>
            </Body>
            
          {/* <ModalDialog target="credits" type="credits" hasSubscription={hasSubscription} modalref={modalRef} userData={userData} opened={buyCreditsOpened}/> */}
          </>
        )
        }
      // }
    
}

export default Home
