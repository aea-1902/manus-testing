import React, { useState, useEffect,useRef, use  } from 'react'
import axios from 'axios'
import { setAuthHeader } from '../../utils/axiosHeader'
import { useRouter } from 'next/router'
import { addDays } from 'date-fns'

import Header from '../../components/Header'
import SideMenu from '../../components/SideMenu'
import Body from '../../components/Body'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import ModalDialog from '../../components/Modal'
import DateRangeComp from '../../components/DateRangeComp'
import CheckboxSelect from '../../components/CheckboxSelect'
import { Table } from "react-bootstrap";
import moment from 'moment';
import t from '../../public/translation/locale'
import { get, setMaxIdleHTTPParsers } from 'http'

import ApiService from '../../services/ApiService';
import Papa from 'papaparse';
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

function formatMoney(number){
  return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
function getActionHeader(mainRow) {
  if (mainRow.actionHeader === "Renewed subscription" && mainRow.documentType === "SubscriptionPeriod") {
    if (mainRow.documentId === "FreeTrial"){
      return "Free trial";
    }
    return "Subscription credits";
  } else if (mainRow.actionHeader === "" && mainRow.documentType === "Credit") {
    return "Free credits";
  } else if (mainRow.actionHeader === "Expired") {
    return "Expired credits";
  } else if (mainRow.actionHeader === "Free credits") {
    return "Free credits";
  } else if (mainRow.actionHeader === "Subscription credits") {
    return "Subscription credits";
  } else if (mainRow.actionHeader === "Get keyword analysis") {
    return "Get keyword analysis";
  } else if (mainRow.actionHeader == "Purchased"){
    return "Purchased";
  } else if (mainRow.actionHeader === "" && mainRow.documentType === "KeywordOptimization") {
    return "Keyword optimization"
  } else if (mainRow.actionHeader === "Generate image alt text") {
    return <>
    <span>Generated </span>
    <b>image alt text</b>
  </>
  } else if (mainRow.actionHeader === "" && mainRow.documentType === "KeywordDomainKeywords") {
    return "Get domain keywords"
  }

  else {
    return <>
      <span>{mainRow.actionHeader} </span>
      <b>{mainRow.action}</b>
    </>  }
}
function Row(props) {
  const { row, hasMore, hasSelected } = props;

  return (
    <>
      {
        row != null ? 
        row.map((mainRow, index) => (
          
          <tr key={index}>
                  <td className='font-13' scope="row">{formatDate(mainRow.date)}</td>
                  <td className='font-13'>{getActionHeader(mainRow)} {(mainRow.actionHeader === "Purchased" ? mainRow.action :  "")} {(mainRow.actionHeader === "Renewed subscription" ? "+ " + mainRow.creditUsage * -1 + " credits" : "")}</td>
                  <td className='font-13'><span>{mainRow.editor}</span></td>
                  <td className='text-right font-13'>
                     {(mainRow.actionHeader == "Purchased") && <span>{mainRow.currencyCode} {formatMoney(mainRow.cost)}</span>}
                     {(mainRow.actionHeader == "Generated" ||  mainRow.actionHeader == "Get keyword analysis") && <span>{mainRow.creditUsage} {mainRow.creditUsage > 1 ? "credits" : "credit"}</span>}
                     {(mainRow.actionHeader == "Expired") && <span>{mainRow.creditUsage} {mainRow.creditUsage > 1 ? "credits" : "credit"}</span>}
                     {(mainRow.actionHeader == "Generate image alt text") && <span>{mainRow.creditUsage} {mainRow.creditUsage > 1 ? "credits" : "credit"}</span>}
                     {(mainRow.actionHeader === "" && mainRow.documentType === "KeywordOptimization") && <span>{mainRow.creditUsage} {mainRow.creditUsage > 1 ? "credits" : "credit"}</span>}
                     {(mainRow.actionHeader === "" && mainRow.documentType === "KeywordDomainKeywords") && <span>{mainRow.creditUsage} {mainRow.creditUsage > 1 ? "credits" : "credit"}</span>}
                    {(mainRow.actionHeader == "Get domain keywords") && <span>{mainRow.creditUsage} {mainRow.creditUsage > 1 ? "credits" : "credit"}</span>}
                    {/* {(mainRow.actionHeader == "Renewed subscription") && <span>{mainRow.creditUsage} {mainRow.creditUsage > 1 ? "credits" : "credit"}</span>} */}
                    {(mainRow.actionHeader == "Executed" && mainRow.creditUsage > 0) && <span>{mainRow.creditUsage} {mainRow.creditUsage > 1 ? "credits" : "credit"}</span>}
                  </td>
                  <td className='text-right font-13'><span>{mainRow.creditsLeft}</span></td>
                </tr>
        ))
        :
        <p className='text-center'>No records to show</p>
      }
      <tr>
        {(hasMore && hasSelected) && (<div id="loader" className='text-center'>Loading...</div>)}
        {(!hasMore && hasSelected) && <p className='text-center'>Logs ends here</p>}

        {!hasSelected && <p className='text-center'>No records to show</p>}
      </tr>
    </>
  );
}
const Audit = ({userData}) => {
  
  const https = require("https");
  const httpsAgent = new https.Agent({ rejectUnauthorized: false });
  const AppSettings = require('../../settings/AppSetting').default
  const router = useRouter()
  const [auditLogs, setAuditLogs] = useState(null)
  const [filteredLogs, setFilteredLogs] = useState(null)
  const [unfilteredLogs, setUnfilteredLogs] = useState(null)
  const [range, setRange] = useState([
      {
        startDate: addDays(new Date(), -30),
        endDate: new Date(),
        key: 'selection'
      }
    ])
  const [translation, setTranslation] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [continuationToken, setContinuationToken] = useState(null)

  const [generatingCsv, setGeneratingCsv] = useState(false);
  async function getAuditLogs(selectedItems, fromAction) {
    fromAction = fromAction || false
    const startDate = new Date(range[0].startDate)
    const endDate = new Date(range[0].endDate)
    //get utc from startDate and endDate to use as parameters
    
    const startDateString = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate()
    const endDateString = endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate()
    if (selectedItems.length > 0 && selectedItems != undefined)
    {
      const apiUrl = `${AppSettings.API_URL}/Reporting/AuditLog?startDate=${startDateString}&endDate=${endDateString}${(continuationToken != null && !fromAction) ? "&continuationToken=" + continuationToken : ""}${selectedItems != undefined ? "&selectedItems=" + selectedItems : ""}`
      axios.get(apiUrl,{
        headers: {"Content-Type": "application/json"}}
      ).then((res) => {
        if (res.data.auditLogs.length > 0)
        {
          
          setContinuationToken(res.data.continuationToken)
          if (res.data.continuationToken == null)
          {
            setHasMore(false)
          }

          let filteredData = null
          //if (selectedItems.includes('All'))
          filteredData =  res.data.auditLogs
        // else
          //filteredData = selectedItems != undefined ? res.data.auditLogs.filter(obj => selectedItems.includes(obj.actionHeader)) : res.data.auditLogs
        
          if (!fromAction)
          {
            if (filteredLogs == null)
              setFilteredLogs(filteredData)
            else
              setFilteredLogs([...filteredLogs, ...filteredData])

              
          }
          else
          {
            setFilteredLogs(filteredData)}

        }
        else
        {
          setHasMore(false)
          setFilteredLogs(res.data.auditLogs)
        }

        })
        .catch(error => {
          setHasMore(false)
        })
    }else
    {
      setFilteredLogs([])
      setHasMore(false)
    }
  }
  const getAuditLogsAll = async () => {
    const startDate = new Date(range[0].startDate.getTime())
    const endDate = new Date(range[0].endDate.getTime())

    const today = new Date().getTime()
    //get utc from startDate and endDate to use as parameters
    
    const startDateObj = new Date(Number(startDate)).toLocaleDateString()
    const endDateObj = new Date(Number(endDate)).toLocaleDateString()


    const fileName = `AuditLogs_${startDateObj}-${endDateObj}_${today}.csv`;
    const startDateString = startDate.getFullYear() + "-" + (startDate.getMonth() + 1) + "-" + startDate.getDate()
    const endDateString = endDate.getFullYear() + "-" + (endDate.getMonth() + 1) + "-" + endDate.getDate()
    if (selectedItems.length > 0 && selectedItems != undefined)
    {
      
    setGeneratingCsv(true);
      const logs = await ApiService.get(`${AppSettings.API_URL}/Reporting/AuditLogAll?startDate=${startDateString}&endDate=${endDateString}${(continuationToken != null) ? "&continuationToken=" + continuationToken : ""}${selectedItems != undefined ? "&selectedItems=" + selectedItems : ""}`)
      if (logs.data.auditLogs.length > 0)
      {
        const rows = logs.data.auditLogs.map(data => ({
          'Type': data.documentType,
          'Document ID': data.documentId,
          'Time': data.date + 'Z',  // Format date to a readable format
          'Action': data.actionHeader + ' ' + data.action,
          'Currency': data.currencyCode,
          'Cost': data.cost,
          'Credit Balance': data.creditsLeft,
          'Credit Usage': data.creditUsage,
          'Editor': data.editor || '', // Handle null values
        }));
        const csv = Papa.unparse({
          fields: ['Type', 'Document ID', 'Time', 'Action', 'Currency', 'Cost', 'Credit Balance', 'Credit Usage', 'Editor'],
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
      }
    }
  }
    useEffect(() => {
      if (!isLoading)
      {
        getAuditLogs(selectedItems, true)
      
      }
    },[range])// eslint-disable-line react-hooks/exhaustive-deps 
    useEffect(() => {
        async function Init(){
          const locale = navigator.language.substring(0,2);
          setTranslation(t[locale] != undefined ? t[locale].Content["AuditTrails"] : t["en"].Content["AuditTrails"])
          //
          let filter = ["All", "Expired", "Generated", "Generate image alt text", "Purchased", "Subscription credits","Get keyword analysis","Free credits"]
          setSelectedItems(filter)
          getAuditLogs(filter)
        }
        async function getUser() {
          const AuthenticationService = require('../../services/AuthenticationService').default
          await AuthenticationService.getUser().then(u => {
            if (u != null)
            {
              setAuthHeader(u.access_token)
              Init()  
              setIsLoading(false)
            }
            
          })
        }
      getUser()
      
    },[])// eslint-disable-line react-hooks/exhaustive-deps

    function setActionFilter(value) {
        console.log(value)
    }
    const [selectedItems, setSelectedItems] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
  
    const dropdown = useRef(null);
    useEffect(() => {
      // only add the event listener when the dropdown is opened
      if (!dropdownOpen) return;
      function handleClick(event) {
        if (!dropdown.current.contains(event.target)) {
          setDropdownOpen(false);
        }
      }
      window.addEventListener("click", handleClick);
      // clean up
      return () => window.removeEventListener("click", handleClick);
    }, [dropdownOpen]);


    const handleCheckboxChangeAll = async (value) => {
      let prev = []
      if (value === "All") {
        if (selectedItems.includes(value)) {
          setSelectedItems([]);
          setFilteredLogs(null)
        }
        else {
          prev = ["All", "Expired", "Generated", "Generate image alt text", "Purchased", "Subscription credits","Get keyword analysis","Free credits"];
          setSelectedItems(prev);
          getAuditLogs(prev,true)
          // setHasMore(true)
        }
      }
      setHasMore(true)
    };

    const handleCheckboxChange = async (value) => {
      let prev = selectedItems;
      if (selectedItems.includes(value)) {
        prev = prev.filter(item => item !== value);
        prev = prev.filter(item => item !== "All");
        setSelectedItems(prev);
        //uncheck all

      } else {
        prev = [...prev, value];
        
        prev = prev.filter(item => item !== "All");
        if (prev.length == 6)
        {
          prev = ["All", "Expired", "Generated", "Generate image alt text", "Purchased", "Subscription credits","Get keyword analysis","Free credits"];
        }
        setSelectedItems(prev);

      }
      
      setHasMore(true)
      getAuditLogs(prev,true)

    };
    function handleScroll() {
      const element = document.getElementById('audit-log')
      const scrollableHeight = element.scrollHeight - element.clientHeight;
      if (element.scrollTop === scrollableHeight) {
          setPage(page + 1);
          if (hasMore)
            getAuditLogs(selectedItems,false)
      }
    }
    if (translation && userData)
    return (
      <>
      
      <ModalDialog target="billing" type="billing" click={() => {router.push('/billing')}}/>
        <Body>
          <Content>
            <div className='h-100'>
            <div className="header d-flex mb-30">
                <p>Audit trail</p>
                
                <div className="right ms-auto d-flex">
                  <button id='exportCsv' type="button" className={`btn btn-primary submit-button mt-auto${generatingCsv ? ' disabled' : ''}`} onClick={getAuditLogsAll} disabled={generatingCsv} >
                    {generatingCsv ? (
                      <>
                        <span className="spinner-border" role="status" aria-hidden="true"></span>
                        <span className="visually-hidden">Loading...</span>
                      </>
                    ) : (
                      "Export to CSV"
                    )}
                  </button>
                </div>
            </div>
            <div className="d-flex mb-36 audit">
                <div className='w30 mr-14'>
                    <p>Date range</p>
                    <DateRangeComp dateRange={setRange}/>
                </div>
                <div className='w30'>
                    <p>Actions</p>
                    <div ref={dropdown} className="dropdown">
                      
                      <button
                        className="btn btn-secondary dropdown-toggle custom-dropdown w-100"
                        type="button"
                        id="dropdownMenuButton"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded={dropdownOpen ? 'true' : 'false'}
                        onClick={() => setDropdownOpen(b => !b)}
                        style={{fontSize: '13px'}}
                      >
                        <span>
                        {selectedItems.length > 0 ? `${selectedItems.length} selected` : 'Select actions'}</span>
                      </button>
                      <div className={`dropdown-menu${dropdownOpen ? ' show' : ''}`} aria-labelledby="dropdownMenuButton">
                        <label className="dropdown-item select-all">
                          <input 
                            className='form-check-input'
                            type="checkbox"
                            value="Select all"
                            checked={selectedItems.includes('All')}
                            onChange={() => handleCheckboxChangeAll('All')}
                          />
                          <span 
                            style={{fontSize: '13px'}}>Select all</span>
                        </label>
                        <label className="dropdown-item">
                          <input
                            className='form-check-input'
                            type="checkbox"
                            value="Generated"
                            checked={selectedItems.includes('Generated')}
                            onChange={() => handleCheckboxChange('Generated')}
                          />
                          <span
                            style={{fontSize: '13px'}}>Generated</span>
                        </label>
                        <label className="dropdown-item">
                          <input
                            className='form-check-input'
                            type="checkbox"
                            value="Generate image alt text"
                            checked={selectedItems.includes('Generate image alt text')}
                            onChange={() => handleCheckboxChange('Generate image alt text')}
                          />
                          <span
                            style={{fontSize: '13px'}}>Generate image alt text</span>
                        </label>
                        <label className="dropdown-item">
                          <input
                            className='form-check-input'
                            type="checkbox"
                            value="Get keyword analysis"
                            checked={selectedItems.includes('Get keyword analysis')}
                            onChange={() => handleCheckboxChange('Get keyword analysis')}
                          />
                          <span
                            style={{fontSize: '13px'}}>Keyword analysis</span>
                        </label>
                        <label className="dropdown-item">
                          <input
                            className='form-check-input'
                            type="checkbox"
                            value="Purchased"
                            checked={selectedItems.includes('Purchased')}
                            onChange={() => handleCheckboxChange('Purchased')}
                          />
                          <span
                            style={{fontSize: '13px'}}>Purchased extra credits</span>
                        </label>
                        <label className="dropdown-item">
                          <input
                            className='form-check-input'
                            type="checkbox"
                            value="Subscription credits"
                            checked={selectedItems.includes('Subscription credits')}
                            onChange={() => handleCheckboxChange('Subscription credits')}
                          />
                          <span
                            style={{fontSize: '13px'}}>Subscription credits</span>
                        </label>
                        <label className="dropdown-item">
                          <input 
                            className='form-check-input'
                            type="checkbox"
                            value="Expired"
                            checked={selectedItems.includes('Expired')}
                            onChange={() => handleCheckboxChange('Expired')}
                          />
                          <span
                            style={{fontSize: '13px'}}>Expired credits</span>
                        </label>
                        <label className="dropdown-item">
                          <input 
                            className='form-check-input'
                            type="checkbox"
                            value="Free credits"
                            checked={selectedItems.includes('Free credits')}
                            onChange={() => handleCheckboxChange('Free credits')}
                          />
                          <span
                            style={{fontSize: '13px'}}>Free credits</span>
                        </label>
                      </div>
                    </div>
                </div>
                {/* <div className='w-100 pull-bottom'>
                  <input type='text' className="form-control h-45 ico-search" placeholder='Search' onChange={(item) => {setWildcardFilter(item.target.value)}}/>
                </div> */}
            </div>
            {
              filteredLogs != null ? 
              <div className='audit-log'>
                <Table className='mb-0 table-borderless'>
                  <thead>
                    <tr>
                      <th style={{fontWeight: '600'}} className='font-13' scope="col">Date</th>
                      <th style={{fontWeight: '600'}} className='font-13' scope="col">Action</th>
                      <th style={{fontWeight: '600'}} className='font-13' scope="col">User</th>
                      <th style={{fontWeight: '600'}} className='text-right font-13' scope="col">Cost</th>
                      <th style={{fontWeight: '600'}} className='text-right font-13' scope="col">Credits left</th>
                    </tr>
                  </thead>
                  <tbody id='audit-log' onScroll={handleScroll}>
                    <Row row={filteredLogs} hasMore={hasMore} hasSelected={selectedItems.length > 0} />
                  </tbody>
                </Table>
              </div>
              : 
              
              <div className='audit-log'>
              <p className='text-center'>No records to show</p>
              </div>
            }
            </div>
          </Content>  
        </Body>
      </>
    )
}

export default Audit