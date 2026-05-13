import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { useRouter } from 'next/router'

import styles from '../../styles/styling/Reports.module.css'

import Header from '../../components/Header'
import SideMenu from '../../components/SideMenu'
import Body from '../../components/Body'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import ModalDialog from '../../components/Modal'
import ModalEditors from '../../components/ModalEditors'
// import Dropdown from 'react-bootstrap/Dropdown'
import { addDays } from 'date-fns'

import IconButton from '@mui/material/IconButton';
// import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
// import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import "rsuite/dist/rsuite.min.css";

import { setAuthHeader } from '../../utils/axiosHeader'

import 'react-date-range/dist/styles.css'; // main css file
import 'react-date-range/dist/theme/default.css'; // theme css file
import DateRangeComp from '../../components/DateRangeComp'
import { Dropdown, Form } from 'react-bootstrap';
import Router from 'next/router'
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Link from 'next/link'
import Tooltip from 'react-bootstrap/Tooltip';

import Image from 'next/image'
import { Table } from "react-bootstrap";
import moment from 'moment';
import t from '../../public/translation/locale'
import apiService from '../../services/ApiService';
import Papa from 'papaparse';
let rowEditors = "";
  function showEditors(e)
  {
    rowEditors = e;
    const { Modal } = require("bootstrap")
    const myModals = new Modal("#message");
    myModals.show()

  }
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


const KeyboardArrowDownIcon = () => {
  return <Image src='/images/ic_arrow_expand_large.svg' width={30} height={30} alt='info'></Image>
}

const KeyboardArrowUpIcon = () => {
  return <Image src='/images/ic_arrow_collapse_large.svg' width={30} height={30} alt='info'></Image>
}

function Row(props) {
    const { row } = props;

    const [isOpen, setIsOpen] = useState([]);

    const handleToggle = (index) => {
      const newIsOpen = [...isOpen];
      newIsOpen[index] = !newIsOpen[index]; 
      setIsOpen(newIsOpen);
    };

    const LinkWithToolip = ({ id, children, title, url, deleted }) => {
      const validUrl = getValidUrl(url);
      return (
        <OverlayTrigger key='right' placement='right' overlay={<Tooltip id={id}>{title}</Tooltip>}>
          <a className={`font-13 domain-url ${deleted == true && `deleted`}`} href={validUrl} target='_blank' rel="noreferrer" style={{marginTop: '9px'}}>{children}</a>
        </OverlayTrigger>
      );
    };

    //check if string has domain format
    const isDomain = (str) => {
      if (!/^https?:\/\//.test(str)) 
      {
          return false;
      }
      const match = str.match(/^https?:\/\/([^\/:]+)(:\d+)?(\/.*)?$/);
      if (!match) return false;

      const hostname = match[1];

      if (hostname.length < 2) {
          return false;
      }
      
      if (/^\d{1,3}(\.\d{1,3}){3}$/.test(hostname)) {
          return false;
      }
      const url = new URL(str);
      const isUrl = /^[a-zA-Z0-9-]+\.[a-zA-Z0-9.-]+$/.test(url.hostname);
      if (!isUrl)
      {
        const regex = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z0-9-]{2,}$/;
        const isTrue = regex.test(str);
        return isTrue;
      }
      return isUrl;
   }

    // Method to get valid URL without http/https duplication
    const getValidUrl = (url) => {
      if (!url) return null;
      
      // Check if URL already has a protocol
      if (url.startsWith('http://') || url.startsWith('https://')) {
        // Validate the existing URL
        try {
          new URL(url);
          return url;
        } catch (error) {
          return null;
        }
      }
      
      // If no protocol, add https:// by default
      const validUrl = `https://${url}`;
      
      // Validate the URL
      try {
        new URL(validUrl);
        return validUrl;
      } catch (error) {
        return null;
      }
    }
      return (

        <React.Fragment>
           {
            row != null ? 
            row.map((mainRow, index) => (
            
              
              <>
                <tr className={isOpen[index] ? 'row-selected' : ''} key={index} >
                  {
                    (mainRow.stores.length == 1)
                    ?
                    <>
                    <td>{isDomain(mainRow.domain) ? <LinkWithToolip title={mainRow.domain} id={`tr-`+index} url={mainRow.domain} deleted={mainRow.deleted}>{mainRow.domain}</LinkWithToolip> : mainRow.domain}</td>
                    <td className='text-right font-13'>{mainRow.generatedPageTitle}</td>
                    <td className='text-right font-13'>{mainRow.generatedPageDescription}</td>
                    <td className='text-right font-13'>{mainRow.generatedProductDescription}</td>
                    <td className='text-right font-13'>{mainRow.generatedExcerpt}</td>
                    <td className='text-right font-13'>{mainRow.generatedOpenGraphText}</td>
                    <td className='text-right font-13'>{mainRow.generatedImageAltText}</td>
                    <td className='text-right font-13'>{mainRow.creditsUsed}</td>
                    <td className=' font-13'>{formatDate(mainRow.lastUpdate)}</td>
                    <td className='text-center font-13'><Link href='/reports' onClick={() => showEditors(mainRow.editors.length > 1 ? mainRow.editors.join(',\n') : mainRow.editors )} title='Editors'><Image  src='/images/ic_editor.svg' width={22} height={22} alt='info'></Image></Link></td>
                    <td className='text-center font-13'><Link className='history-link' href={{pathname:  `/reports/historylogs`,
                      query: {
                        storeId: mainRow.stores[0].storeId,
                        urlId: mainRow.urlId,
                        startDate: props.startDate,
                        endDate: props.endDate,
                        user: props.user,
                        url: mainRow.domain,
                      }
                    }} data-params={JSON.stringify({
                      storeId: mainRow.stores[0].storeId,
                      urlId: mainRow.urlId, 
                      startDate: props.startDate,
                      endDate: props.endDate,
                      user: props.user,
                      url: mainRow.domain
                    })} rel="noreferrer" title="See history logs" ><Image  src='/images/ic_history.svg' width={30} height={30} alt='info'></Image></Link></td>
                    
                    </>
                    : 
                    <>
                      <td>{isDomain(mainRow.domain) ? <LinkWithToolip title={mainRow.domain} id={`tr-`+index} url={mainRow.domain}  deleted={mainRow.deleted}>{mainRow.domain}</LinkWithToolip> : mainRow.domain}</td>
                      <td className='text-right font-13'>{mainRow.generatedPageTitle}</td>
                      <td className='text-right font-13'>{mainRow.generatedPageDescription}</td>
                      <td className='text-right font-13'>{mainRow.generatedProductDescription}</td>
                      <td className='text-right font-13'>{mainRow.generatedExcerpt}</td>
                      <td className='text-right font-13'>{mainRow.generatedOpenGraphText}</td>
                      <td className='text-right font-13'>{mainRow.generatedImageAltText}</td>
                      <td className='text-right font-13'>{mainRow.creditsUsed}</td>
                      <td className=' font-13'>{formatDate(mainRow.lastUpdate)}</td>
                      <td className='text-center font-13'><Link href='/reports' onClick={() => showEditors(mainRow.editors.length > 1 ? mainRow.editors.join(',\n') : mainRow.editors )} title='Editors'><Image  src='/images/ic_editor.svg' width={22} height={22} alt='info'></Image></Link></td>
                      <td className='text-center font-13'>
                      <button aria-label="expand row" style={{background: 'inherit'}} onClick={() => handleToggle(index)}>
                        {isOpen[index] ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                      </button>
                      </td>
                    </>
                  
                  }
                  
                </tr>
                {
                (mainRow.stores.length > 1) &&
                mainRow.stores.map((historyRow, i) => (
                    (isOpen[index]) ? 
                    <tr className={isOpen[index] ? 'subrow-selected' : ''} key={i}>
                    <td className='d-flex font-13'>
                      <Image className='newline-icon' src='/images/new-line.svg' width={12} height={12} alt='info'></Image>
                      {isDomain(`https://` + historyRow.storeId) ? <LinkWithToolip title={historyRow.storeId} id={`tr-sub-`+index} url={historyRow.storeId}>{historyRow.storeId}</LinkWithToolip> : <span style={{marginTop: '9px'}}>{historyRow.storeId}</span>}
                    </td> 
                    <td className='text-right font-13'>{historyRow.generatedPageTitle}</td>
                    <td className='text-right font-13'>{historyRow.generatedPageDescription}</td>
                    <td className='text-right font-13'>{historyRow.generatedProductDescription}</td>
                    <td className='text-right font-13'>{historyRow.generatedExcerpt}</td>
                    <td className='text-right font-13'>{historyRow.generatedOpenGraphText}</td>
                    <td className='text-right font-13'>{historyRow.generatedImageAltText}</td>
                    <td className='text-right font-13'>{historyRow.creditsUsed}</td>
                    {/* <td>{historyRow.editors != null ? historyRow.editors.join(',')  : null }</td> */}
                    <td className='font-13'>{formatDate(historyRow.lastUpdate)}</td>
                    <td className='text-center font-13'><Link href='/reports' onClick={() => showEditors(historyRow.editors != null ? historyRow.editors.join(',\n')  : null )}><Image  src='/images/ic_editor.svg' width={22} height={22} alt='info'></Image></Link></td>
                    <td className='text-center font-13'><Link className='history-link' href={{
    pathname: '/reports/historylogs',
    query: {
      storeId: historyRow.storeId,
      urlId: mainRow.urlId,
      startDate: props.startDate,
      endDate: props.endDate,
      user: props.user,
      url: `https://${historyRow.storeId}`,
    },
  }} data-params={JSON.stringify({storeId: historyRow.storeId, urlId: mainRow.urlId, startDate: props.startDate, endDate: props.endDate, user: props.user, url: historyRow.storeId})} rel="noreferrer" title="See history logs" ><Image  src='/images/ic_history.svg' width={30} height={30} alt='info'></Image></Link></td>
                  </tr> : null
                  
                  ))
                  
                  }
                  </>
              
             )
             )
            : null
           
           }
           
        </React.Fragment>
      );
    }

export default function Reporting({userData}) {

  const SSR = typeof window === 'undefined'
  const [url, setURL] = useState('');

  const handleChangeURL = (event) => {
    setURL(event.target.value);
  };
const [urlFilter, setUrlFilter] = useState('All')
const [filteredStores, setFilteredStores] = useState([])
const [loadingStores, setLoadingStores] = useState(true)
const [editorFilter, setEditorFilter] = useState('All')


const [data, setData] = useState(null)

const [editors, setEditors] = useState(null)
const [domains, setDomains] = useState(null)
const [hasNoAddress, setHasNoAddress] = useState(false)
const router = useRouter()
const [translation, setTranslation] = useState(null)
const [range, setRange] = useState([
  {
    startDate: addDays(new Date(), -30),
    endDate: new Date(),
    key: 'selection'
  }
])

const [isLoading, setIsLoading] = useState(true)

const [generatingCsvKeywords, setCsvGeneratingKeywords] = useState(false);
const [generatingCsvTextActions, setCsvGeneratingTextActions] = useState(false);
const [toExport, setToExport] = useState([]);
const https = require("https");
const httpsAgent = new https.Agent({ rejectUnauthorized: false });
const AppSettings = require('../../settings/AppSetting').default
const startDate = addDays(new Date(), -30)
const endDate = new Date()


async function getReports(){
  
  const startDate = new Date(range[0].startDate)
  const endDate = new Date(range[0].endDate)
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
          const res = await apiService.get(`${AppSettings.API_URL}/Reporting/Summary?startDate=${startDateString}&endDate=${endDateString}&emailEditor=${encodeURIComponent(editorFilter)}&storeUrl=${encodeURIComponent(urlFilter)}`,{httpsAgent})
                
          if (res.data !== null)
          {
            setData(res.data.domains);
            if (editorFilter === "All")
            {
              const editors = res.data.editors.map((item) => item)
              setEditors([...new Set(editors.flatMap((item) => item))])
            }
            if (urlFilter === "All")
            {
              setDomains(res.data.domains)
            }
            setFilteredStores(res.data.domains)

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
          // Handle error, e.g., log it or display an error message
          setFilteredStores([])
        }
      }
   

      setLoadingStores(false)
  //}
  
  
}
useEffect(() => {
  if (!isLoading)
  {
    getReports();
    if (data != null)
    {
        const startDate = new Date(range[0].startDate)
        const endDate = new Date(range[0].endDate)
        if (startDate.getTime() !== endDate.getTime())
        {
          

          const filteredData = data.filter(obj => {
            const time = new Date(obj.lastUpdate).getTime()
            return (startDate.getTime() <= time && time <= endDate.getTime() )
          })

          const filteredStoresData = filteredData.map(item => {
            const filteredStores = item.stores.filter(store => {
              const time  = new Date(store.lastUpdate).getTime()
              return (startDate.getTime() <= time && time <= endDate.getTime() )
            });
            const sortedData = filteredStores.sort((a, b) => {
              const dateA = new Date(a.lastUpdate);
              const dateB = new Date(b.lastUpdate);
              return dateB - dateA; // Sort in descending order (most recent first)
            } );
            return { ...item, stores: sortedData };
          });
          const sortedMainRow = filteredStoresData.sort((a, b) => {
            const dateA = new Date(a.lastUpdate);
            const dateB = new Date(b.lastUpdate);
            return dateB - dateA; // Sort in descending order (most recent first)
          } );

          setFilteredStores(sortedMainRow)
          setLoadingStores(false)
        }
    }
  }
  
},[range])// eslint-disable-line react-hooks/exhaustive-deps

useEffect(() => {
  if (!isLoading)
  {
    getReports()

  }
 
}, [urlFilter])// eslint-disable-line react-hooks/exhaustive-deps

useEffect(() => {
  if (!isLoading)
  {
    getReports()
  }
}, [editorFilter])// eslint-disable-line react-hooks/exhaustive-deps


useEffect(() => {
  if (hasNoAddress){
  router.push('/account')
  }
},[hasNoAddress])// eslint-disable-line react-hooks/exhaustive-deps

useEffect(() => {
    async function Init(){
      
      const locale = navigator.language.substring(0,2);
      setTranslation(t[locale] != undefined ? t[locale].Content["Reports"] : t["en"].Content["Reports"])
    }

    async function getUser() {
      const AuthenticationService = require('../../services/AuthenticationService').default
      await AuthenticationService.getUser().then(u => {
        if (u == null)
        {
          // AuthenticationService.login()
        }
        else
        {
          setAuthHeader(u.access_token)
          Init() 
          getReports()
          setIsLoading(false)
        }
        //setUser(u)
      })
    }
  getUser()
}, [])// eslint-disable-line react-hooks/exhaustive-deps

  function DateChanged()
  {
    console.log("changed")
  }
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  
  function isArraySortedAsc(arr, key) {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i][key] < arr[i - 1][key]) {
        return false;
      }
    }
    return true;
  }
  
  function sortArrayOfObjects(array, key, order = 'asc') {
    const sortedArray = array.slice(); // Create a shallow copy of the array to avoid modifying the original array
  
    sortedArray.sort((a, b) => {
      const valueA = a[key];
      const valueB = b[key];
  
      if (order === 'asc') {
        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;
      } else if (order === 'desc') {
        if (valueA > valueB) return -1;
        if (valueA < valueB) return 1;
      }
  
      return 0;
    });
  
    return sortedArray;
  }
  const sortReport = (c) =>
  {
    var sortedReport = [];
    if (filteredStores != null)
    {
      var sortedAsc = isArraySortedAsc(filteredStores, c)
    
      var sortedReport = []
  
      sortedReport = sortArrayOfObjects(filteredStores, c, sortedAsc ? 'desc' : 'asc')
      setFilteredStores(sortedReport)
      setLoadingStores(false)
    }
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
    const res = await apiService.get(apiUrl,{httpsAgent})
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
  const exportToCsv = async (json, params) => {
    try {
      // Parse JSON from request body
      const jsonArray = json;
  
      // Check if the input is valid
      if (!Array.isArray(jsonArray)) {
        return res.status(400).json({ error: 'Invalid JSON format. Expected an array of objects.' });
      }
  
      // Flatten each object in the array
      const rows = jsonArray.flatMap(data => {
        return data.fields.flatMap(field => {
          let webshop = '';
          let type = '';
          let recordId = '';
          try {
            const splits = (data.objectId || '').split('_');
            if (splits.length == 2)
            {
              type = '';
              recordId = splits[1] || '';
            }
            else if (splits.length == 3)
            {
              
              type = splits[1] || '';
              recordId = splits[2] || '';
            }
            else
            {
              type = '';
              recordId = '';}
          } catch (error) {
            type = '';
            recordId = '';
          }
          webshop = domains.filter(item => item.stores.some(store => store.storeId === data.storeId))[0].domain
          return field.value.map(value => ({
            'Store': webshop,
            'Store ID': data.storeId,
            'Type': field.fieldType == "Image Alt Text" ? "Image" : type,
            'Record ID': recordId,
            'Request ID': data.requestId,
            'Text ID': field.documentId,
            'Editor': data.editor,
            'Action': data.actionDisplay.replace(/"/g, '""').split("by")[0].trim(),
            'Text Type': field.fieldType,
            'Text': value,
            'Date and Time': data.timeStamp + 'Z' // Format timestamp
          }));
        });
      });
      const startDateObj = new Date(Number(params.startDate)).toLocaleDateString()
      const endDateObj = new Date(Number(params.endDate)).toLocaleDateString()
  
  
      const today = new Date().getTime()
      const fileName = `TextActions_${startDateObj}-${endDateObj}_${today}.csv`;
      
  
  
  // Convert rows with custom headers using Papa.unparse
      const csv = Papa.unparse({
        fields: ['Store','Store ID', 'Type', 'Record ID', 'Request ID', 'Text ID', 'Editor', 'Action', 'Text Type', 'Text', 'Date and Time'],
        data: rows
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      
      setGeneratingCsv(false);
    } catch (error) {
    }
  }
  const getTextActions = async () => {
    setCsvGeneratingTextActions(true);
    let allExportData = [];

    const paramsToProcess = {
      filteredStores: filteredStores,
      startDate: new Date(range[0].startDate).getTime(),
      endDate: new Date(range[0].endDate).getTime(), 
      user: editorFilter
    };
    for (const domain of filteredStores) {
      for (const mainRow of domain.stores)
      {
        
        let exportContinuationToken = '';
        let exportHasMore = true;
        let exportData = [];
        const params = {
          storeId: mainRow.storeId,
          urlId: domain.urlId,
          startDate: paramsToProcess.startDate,
          endDate: paramsToProcess.endDate,
          user: paramsToProcess.user
        }

        const fetchHistory = async () => {
          while (exportHasMore) {
              const formData = new FormData();
              formData.append('type', 'Product');

              if (params.urlId) formData.append('urlId', params.urlId);
              if (params.storeId) formData.append('storeId', params.storeId);
              if (params.textId) formData.append('textId', params.textId);
              if (params.startDate) formData.append('startDate', params.startDate);
              if (params.endDate) formData.append('endDate', params.endDate);
              if (exportContinuationToken) formData.append('continuationToken', exportContinuationToken);

              if ((params.storeId && params.urlId) || params.textId) {
                  try {
                      const res = await apiService.postWithFormData(`/Reporting/History`, formData);
                      if (res.data.histories.length > 0) {
                          exportData = [...exportData, ...res.data.histories];

                          if (res.data.continuationToken) {
                              exportContinuationToken = res.data.continuationToken;
                          } else {
                              exportHasMore = false;
                          }
                      } else {
                          exportHasMore = false;
                      }
                  } catch (error) {
                      console.error("Error fetching history:", error);
                      exportHasMore = false;
                  }
              } else {
                  exportHasMore = false;
              }
          }
      };

      await fetchHistory(); // Wait for the data fetching to complete
      allExportData = [...allExportData, ...exportData]; // Append data from this element
      }
      
    }


  setToExport(allExportData);
  exportToCsv(allExportData, paramsToProcess); // Assuming params are not needed after processing all elements
  setCsvGeneratingTextActions(false);
  }

  
  if (translation && userData)
  return (
    <>
    
    <ModalEditors target="message" editors={rowEditors}></ModalEditors>
    <ModalDialog target="address" type="address" click={() => {router.push('/account')}}/>
    <ModalDialog target="billing" type="billing" click={() => {router.push('/billing')}}/>
      <Body>
      <Content>
      <div className="header d-flex">
        <div><p className='mb-30'>{translation["PageHeaderText"]}</p></div>
          <div className="ml-auto">
                  <button id='exportCsv' type="button" className={`btn btn-primary submit-button reporting mt-auto${generatingCsvTextActions ? ' disabled' : ''}`} onClick={getTextActions} disabled={generatingCsvTextActions} >
                    {generatingCsvTextActions ? (
                      <>
                        <span className="spinner-border" role="status" aria-hidden="true"></span>
                        <span className="visually-hidden">Loading...</span>
                      </>
                    ) : (
                      "Export text actions"
                    )}
                  </button>
          </div>
        </div>
        <div className="reporting-dropdowns d-flex mb-36">
          <div className='w-100 mr-14'>
            <p className='mb-8'>Date range</p>
              <DateRangeComp dateRange={setRange}/>
          </div>
          <div className='w-100 mr-14'>
            <p className='mb-8'>Linked webshops</p>
              <Dropdown >
                <Dropdown.Toggle id="dropdown-domain" className={`form-control h-45 mw-225 ${styles.dropdownToggle}`}>{urlFilter}</Dropdown.Toggle>
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
          <div className='w-100'>
            <p className='mb-8'>Users</p>
              <Dropdown >
                <Dropdown.Toggle id="dropdown-users" className={`form-control h-45 mw-225 ${styles.dropdownToggle}`}>{editorFilter}</Dropdown.Toggle>
                <Dropdown.Menu>
                    <Dropdown.Item onClick={() => setEditorFilter("All")} style={{fontSize: '13px'}}>All</Dropdown.Item>
                    {
                      editors != null &&
                      editors.map((option, index) => (
                        <Dropdown.Item key={index} onClick={() => setEditorFilter(option)} style={{fontSize: '13px'}}>{option}</Dropdown.Item>
                      ))
                    }
                  </Dropdown.Menu>
              </Dropdown>
          </div>
      </div>
    
          {
            filteredStores.length > 0 ? 
            <div className='report-table'>
            <Table bordered className='table-fixed reports-table'>
                <thead className='h-54'>
                    <tr className='border border-white' key={0}>
                        <th style={{minWidth: '270px'}}><span className='d-flex' onClick={() => {sortReport("domain")}}><p>Linked webshops </p><Image alt="Sort Url" src="/images/ic_sort_black.svg" width={15} height={15}></Image></span></th>
                        <th style={{width: '75px'}}><span className='d-flex' onClick={() => {sortReport("generatedPageTitle")}}><p>Meta title </p><Image alt="Sort Page Title" src="/images/ic_sort_black.svg" width={15} height={15}></Image></span></th>
                        <th style={{width: '79px'}}><span className='d-flex' onClick={() => {sortReport("generatedPageDescription")}}><p>Page desc. </p><Image alt="Sort Page Description" src="/images/ic_sort_black.svg" width={15} height={15}></Image></span></th>
                        <th style={{width: '80px'}}><span className='d-flex' onClick={() => {sortReport("generatedProductDescription")}}><p>Desc. </p><Image alt="Sort Product Description" src="/images/ic_sort_black.svg" width={15} height={15}></Image></span></th>
                        <th style={{width: '94px'}}><span className='d-flex' onClick={() => {sortReport("generatedExcerpt")}}><p>Product short desc. </p><Image alt="Sort Product Excerpt" src="/images/ic_sort_black.svg" width={15} height={15}></Image></span></th>
                        <th style={{width: '84px'}}><span className='d-flex' onClick={() => {sortReport("generatedOpenGraphText")}}><p>Open Graph </p><Image alt="Sort Open graph" src="/images/ic_sort_black.svg" width={15} height={15}></Image></span></th>
                        <th style={{width: '103px'}}><span className='d-flex' onClick={() => {sortReport("generatedImageAltText")}}><p>Image alt text </p><Image alt="Sort Image alt text" src="/images/ic_sort_black.svg" width={15} height={15}></Image></span></th>
                        <th style={{width: '92px'}}><span className='d-flex' onClick={() => {sortReport("creditsUsed")}}><p>Credits used </p><Image alt="Sort Credits used" src="/images/ic_sort_black.svg" width={15} height={15}></Image></span></th>
                        {/* <th><span className='d-flex' onClick={() => {sortReport("editors")}}><p>Editors </p><Image alt="Sort editors" src="/images/ic_sort.svg" width={20} height={20}></Image></span></th> */}
                        <th style={{width: '99px'}}><span className='d-flex' onClick={() => {sortReport("lastUpdate")}} ><p>Last updated </p><Image alt="Sort Last updated" src="/images/ic_sort_black.svg" width={15} height={15}></Image></span></th>
                        <th style={{width: '40px'}}></th>
                        <th style={{width: '40px'}}></th>
                    </tr>
                </thead>
                <tbody>
                  <Row row={filteredStores} startDate={new Date(range[0].startDate).getTime()} endDate={new Date(range[0].endDate).getTime()} user={editorFilter}/>
                </tbody>
            </Table>
              </div>
            :
            !loadingStores &&
            <p className='no-records'>It seems like you have not generated content yet, start generating now!</p>
          }
         
    
      </Content>  
    </Body>
    </>
    
  );
}
