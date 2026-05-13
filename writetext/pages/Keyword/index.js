import React, { useState, useEffect } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import Image from 'next/image';
import FollowTooltip from '../../components/FollowTooltip';
import Body from "../../components/Body";
import Content from "../../components/Content";
import DateRangeComp from '../../components/DateRangeComp';
import apiService from '../../services/ApiService';
import styles from "../../styles/styling/Keyword.module.css";

import KeywordSettings from '../../components/Keyword/Settings';
import { useRouter } from 'next/router';

import { addDays } from 'date-fns'

import { MemberTypeEnum } from '../../enum/MemberType'

export default function Keyword({userData, reloadAccount}) {
  const router = useRouter();
  const AppSettings = require('../../settings/AppSetting').default;
  const [range, setRange] = useState([
    {
      startDate: addDays(new Date(), -30),
      endDate: new Date(),
      key: 'selection'
    }
  ])
  const [urlFilter, setUrlFilter] = useState("All");
  const [editorFilter, setEditorFilter] = useState('All');
  const [editors, setEditors] = useState([]);
  
  const [data, setData] = useState(null);
  const [domains, setDomains] = useState([]);
  const [csvGeneratingKeywords, setCsvGeneratingKeywords] = useState(false);
  const [filteredStores, setFilteredStores] = useState([]);

  const [showMain, setShowMain] = useState(true);
  const [showKeywordSettings, setShowKeywordSettings] = useState(false);
  const [showKeywordCannibalizationReport, setShowKeywordCannibalizationReport] = useState(false);
  const [settingsRows, setSettingsRows] = useState([]);

  const memberType = () => {
    return userData.credit.membershipType
  }
  const getKeywords = async () => {
    setCsvGeneratingKeywords(true)
    const startDate = new Date(range[0].startDate)
    const endDate = new Date(range[0].endDate)
    //convert startDate to readable date format for api
    const startDateString = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate()
    //convert endDate to readable date format for api
    const endDateString = endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate()
  
    const today = new Date().getTime()
    const startDateObj = new Date(Number(startDate)).toLocaleDateString()
    const endDateObj = new Date(Number(endDate)).toLocaleDateString()
    const fileName = `Keywords_${startDateObj}-${endDateObj}_${today}.csv`;
    let apiUrl;
    if (urlFilter == "All")
    {
      apiUrl = `${AppSettings.API_URL}/Reporting/ExportKeywords?startDate=${startDateString}&endDate=${endDateString}&emailEditor=${encodeURIComponent(editorFilter)}&storeUrl=All`
    }
    else
    {
      const storeId = domains.find(domain => domain.domain === urlFilter).urlId
      apiUrl = `${AppSettings.API_URL}/Reporting/ExportKeywords?startDate=${startDateString}&endDate=${endDateString}&emailEditor=${encodeURIComponent(editorFilter)}&storeUrl=${storeId}`

    }
    //api call to get keywords
    const res = await apiService.get(apiUrl)
    setCsvGeneratingKeywords(false)
    // Create blob from response data and trigger download
    const blob = new Blob([res.data], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.setAttribute('download', fileName);
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  }
  async function getReports(){
    const startDate = new Date(range[0] ? range[0].startDate : range.startDate)
    const endDate = new Date(range[0] ? range[0].endDate : range.endDate)
    //convert startDate to readable date format for api
    const startDateString = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate()
    //convert endDate to readable date format for api
    const endDateString = endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate()
    //if (filteredStores.length == 0)
    //{

    const webshops = await apiService.get(`${AppSettings.API_URL}/Webshop/GetWebshopURLs?includeDeleted=true`);
    if (webshops.data.length > 0)
        if (startDate.getTime() < endDate.getTime() || startDate.getTime() === endDate.getTime())
        {
          try {
            const res = await apiService.get(`${AppSettings.API_URL}/Reporting/Summary?startDate=${startDateString}&endDate=${endDateString}&emailEditor=${encodeURIComponent(editorFilter)}&storeUrl=${encodeURIComponent(urlFilter)}`)
                  
            if (res.data !== null)
            {
              setData(res.data.domains);
              if (editorFilter === "All")
              {
                const editors = res.data.editors.map((item) => item)
                setEditors([...new Set(editors.flatMap((item) => item))])
              }
             
              setDomains(res.data.domains)

  
              // Create array of store params for text action export
              const storeParams = res.data.domains.map(domain => {
                return JSON.stringify({
                  urlId: domain.urlId,
                  storeId: domain.storeId,
                  startDate: startDate.getTime(),
                  endDate: endDate.getTime()
                })
              })
              
            }
          } catch (error) {
            console.error('Error fetching reports:', error);
          }
        }
     
    
  }

  useEffect(() => {
    getReports();
  }, [range]);

  useEffect(() => {
    apiService.get(`KeywordSettings`).then((res) => {
      if (res.data) {
        setSettingsRows(res.data.domains);
      }
    });
  }, []);

  const hasProAccess = () => {
    return userData.credit.hasProAccess;
  }

  const isFreeTrial = () => {
    return userData.credit.membershipType == MemberTypeEnum.FREETRIAL;
  }
  return (
    
    <>
      {userData && showMain && (
      <Body>
        <Content>
          <>
          <div className="header d-flex">
            <div className='d-flex mb-30'>
              <p className='mb-0'>Keyword management </p>
              {!hasProAccess() && <Image src="/images/ic_pro.svg" alt="pro" width={49} height={19} style={{marginTop: '13.5px', marginLeft: '15px'}} />}
            </div>
          </div>
          {isFreeTrial() && !hasProAccess() &&
              <div className={`header-tos free-trial-banner`}>
                  <div>
                    <p className="banner-title">Your free trial has ended.</p>
                    <p className="banner-text mb-0" style={{maxWidth: "740px"}}>To continue using Keyword Management features, subscribe to the Pro plan.</p>
                  </div>
                  <div className='ms-auto mt-auto'>
                    <button className="btn btn-primary" onClick={() => router.push('/premium')} style={{width: '190px'}}>Go to Plans & Credits</button>
                  </div>
              </div>
          }
          {!isFreeTrial() && !hasProAccess() &&
            <>
              <div className='header-tos'>
                  <div>
                    <p className='tos-title'>This is a Pro feature.</p>
                    <p className='tos-text' style={{marginBottom: '0px', marginRight: '0px'}}>These features are only available for Pro users. Subscribe to the Pro plan to unlock SEO and automation tools.</p>
                  </div>
                  
                  <div className='ms-auto mt-auto'><button className="btn btn-primary tos-btn"  onClick={() => router.push('/premium')} style={{width: '190px'}}>Go to Plans & Credits</button> </div>
              </div>
            </>
          }
          <div className={styles.keywordContainerRow}>
            {/* <div className={`${styles.keywordContainerRowItemIcon} ${styles.keywordContainerRowItemIconKeywords}`}></div> */}
            <div className={styles.keywordContainerRowItemContent}>
              <p className={styles.keywordContainerRowItemContentTitle}>Export target keywords</p>
              <div className='mb-30'>
                <p className={styles.keywordContainerRowItemContentDescription}>Download a list of your target keywords in a CSV file for easy tracking, analysis, or sharing with your team.</p>
              </div>
              <div className='d-flex'>
                <div className={`w-100 mr-14 ${styles.keywordContainerRowItemContentFilter}`}>
                  <p className='mb-8' style={{fontWeight: '500', fontSize: '13px', lineHeight: '100%'}}>Date range</p>
                    <DateRangeComp dateRange={setRange} disabled={!hasProAccess()}/>
                </div>
                <div className={`w-100 mr-14 ${styles.keywordContainerRowItemContentFilter}`}>
                  <p className='mb-8' style={{fontWeight: '500', fontSize: '13px', lineHeight: '100%'}}>Linked webshop</p>
                    <Dropdown disabled={!hasProAccess()}>
                      <Dropdown.Toggle id="dropdown-domain" className='form-control h-45 mw-225 bg-white font-13' style={{height: '45px'}} disabled={!hasProAccess()}>{urlFilter}</Dropdown.Toggle>
                      <Dropdown.Menu>
                          <Dropdown.Item onClick={() => setUrlFilter("All")} style={{fontSize: '13px'}}>All</Dropdown.Item>
                          {
                            domains != null &&
                            domains.map((option, index) => (
                              <Dropdown.Item key={index} onClick={() => setUrlFilter(option.domain)} style={{fontSize: '13px'}}>{option.domain}</Dropdown.Item>
                            ))
                          }
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
                <div className={`ml-auto d-flex ${styles.keywordContainerRowItemContentButtonContainer}`}>
                  <button id='exportCsv' type="button" className={`btn btn-primary  ${styles.keywordContainerRowItemContentButton} mt-auto ${csvGeneratingKeywords || !hasProAccess() ? ' disabled' : ''}`} onClick={getKeywords} disabled={csvGeneratingKeywords || !hasProAccess()} >
                    {csvGeneratingKeywords ? (
                      <>
                        <span className="spinner-border" role="status" aria-hidden="true"></span>
                        <span className="visually-hidden">Loading...</span>
                      </>
                    ) : (
                      "Export keywords"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className={styles.keywordContainerRow}>
            <div className='d-flex'>
              {/* <div className={`${styles.keywordContainerRowItemIcon} ${styles.keywordContainerRowItemIconSettings}`}></div> */}
              <div className={styles.keywordContainerRowItemContent}>
                <p className={styles.keywordContainerRowItemContentTitle}>Keyword cannibalization monitoring settings</p>
                
                <p className={styles.keywordContainerRowItemContentDescription}>Customize how and when WriteText.ai tracks keyword cannibalization, helping you stay on top of potential SEO issues.</p>
              </div>
            </div>
            <div className={`ml-auto d-flex ${styles.keywordContainerRowItemContentButtonContainer}`}>
              <button id='exportCsv' type="button" className={`btn btn-primary ${styles.keywordContainerRowItemContentButton} m-auto`} onClick={() => router.push('/keyword/settings')} disabled={(isFreeTrial() && !hasProAccess()) || (!hasProAccess())}>
                  Go to settings
              </button>
            </div>
          </div>
          <div className={styles.keywordContainerRow}>
            <div className='d-flex'>
              {/* <div className={`${styles.keywordContainerRowItemIcon} ${styles.keywordContainerRowItemIconCannibalization}`}></div> */}
              <div className={styles.keywordContainerRowItemContent}>
                <p className={styles.keywordContainerRowItemContentTitle}>Keyword cannibalization report</p>
                <p className={styles.keywordContainerRowItemContentDescription}>See which pages on your store/s are competing for the same keywords, so you can optimize your content for better search rankings.</p>                 
              </div>
            </div>
            <div className={`ml-auto d-flex ${styles.keywordContainerRowItemContentButtonContainer}`}>
              {!hasProAccess() &&
                  <button  id='exportCsv' type="button" className={`btn btn-primary ${styles.keywordContainerRowItemContentButton} m-auto`} onClick={() => router.push('/keyword/report')} disabled={settingsRows.length === 0 || (isFreeTrial() && !hasProAccess()) || (!hasProAccess())} >
                    Open keyword cannibalization 
                  </button>
              }
              {hasProAccess() &&
                <>
                {settingsRows.length === 0 &&
                  <FollowTooltip
                    content="Report only available when settings have been configured and executed."
                  >
                      <button  id='exportCsv' type="button" className={`btn btn-primary ${styles.keywordContainerRowItemContentButton} m-auto ${settingsRows.length > 0}`} onClick={() => router.push('/keyword/report')} disabled={settingsRows.length === 0 || memberType() == MemberTypeEnum.FREETRIAL} >
                        Open keyword cannibalization 
                      </button>
                  </FollowTooltip>
                }
                {settingsRows.length > 0 &&
                  <button id='exportCsv' type="button" className={`btn btn-primary ${styles.keywordContainerRowItemContentButton} m-auto `} onClick={() => router.push('/keyword/report')} >
                    Open keyword cannibalization 
                  </button>
                }
                </>
              }
            </div>
          </div>
          </>
        </Content>
      </Body>
    )}
    {userData && showKeywordSettings && ( 
      <Body>
        <Content>
          <div className='header'>
            <p className={`font-24 d-flex`}><p className={`back-btn ${styles.keywordBackBtn}`} onClick={() => {setShowKeywordSettings(false); setShowMain(true);}}></p>Settings</p>
          </div>  
        <KeywordSettings userData={userData} reloadAccount={reloadAccount} />
        </Content>
      </Body>
    )}
    </>
  )
}
