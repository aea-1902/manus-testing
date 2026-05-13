import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Body from '../../components/Body'
import Content from '../../components/Content'
import DateRangeComp from '../../components/DateRangeComp'
import Link from 'next/link'
import Image from 'next/image'
import { Table } from "react-bootstrap";

import { addDays } from 'date-fns'
import { setAuthHeader } from '../../utils/axiosHeader'
import {Storagekeys} from '../../settings/StorageKeys';

import { debounce } from 'lodash';

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


function Row(props) {
  const { row, loadMore } = props;
  const AppSettings = require('../../settings/AppSetting').default
  const https = require("https");
  const agent = new https.Agent({ rejectUnauthorized: false });

  // Add scroll event listener to detect when user reaches bottom of table
  useEffect(() => {
    const handleScroll = (e) => {
      const element = e.target;
      if (element.scrollHeight - element.scrollTop === element.clientHeight) {
        loadMore();
      }
    };

    const tableBody = document.querySelector('.report-table');
    if (tableBody) {
      tableBody.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (tableBody) {
        tableBody.removeEventListener('scroll', handleScroll);
      }
    };
  }, [loadMore]);

  async function SetImpersonation(email){
    const usr = await axios.get(`${AppSettings.API_URL}/Admin/LoginAs?email=${encodeURIComponent(email)}`,{ httpsAgent: agent  })
    sessionStorage.setItem(Storagekeys.LoggedInAs_Key, JSON.stringify(usr.data))
    window.location.href = '/'
  }

  async function SetExpiration(companyId){
    const usr = await axios.post(`${AppSettings.API_URL}/Admin/SetSubscriptionExpiration?companyId=${companyId}`,{ httpsAgent: agent  })
    alert("Expiration set");
  }

  return (
    <React.Fragment>
      {row != null && row.map((mainRow, index) => (
        <tr key={index} >
          <td>{mainRow.fullName}</td>
          <td className='text-nowrap'>{mainRow.email}</td>
          <td style={{whiteSpace: 'pre-line'}}>{mainRow.domains}</td>
          <td className='text-nowrap'>{formatDate(mainRow.createdAt)}</td>
          <td className='text-nowrap'>{mainRow.totalCreditUsage}</td>
          <td className='text-nowrap'>{mainRow.webshopsCount}</td>
          <td className='text-nowrap'>{mainRow.totalPayments}</td>
          <td className='text-nowrap'>{mainRow.totalPaymentsSubscription}</td>
          <td><Link href="#" onClick={() => SetImpersonation(mainRow.email)}>Login as</Link></td>
          <td><Link href="#" onClick={() => SetExpiration(mainRow.companyId)}>Set expiration</Link></td>
        </tr>
      ))}
    </React.Fragment>
  );
}

export default function LoginAs({userData}) {

const SSR = typeof window === 'undefined'
const https = require("https");
const agent = new https.Agent({ rejectUnauthorized: false,   });

const [maintAccountUsers, setMainAccountUsers] = useState(null)
const [searchTerm, setSearchTerm] = useState('');
const [filteredData, setFilteredData] = useState([]);
const [range, setRange] = useState([
  {
    startDate: addDays(new Date(), -30),
    endDate: new Date(),
    key: 'selection'
  }
])
const [displayLimit, setDisplayLimit] = useState(50);

const AppSettings = require('../../settings/AppSetting').default
useEffect(() => {
    
   
    async function GetMainAccount() {
        
        await axios.get(`${AppSettings.API_URL}/Admin/GetAllMainAccountUsers`,{ httpsAgent: agent  }).then(usr => {
          // debugger;
            setMainAccountUsers(usr.data)

        })
    }
    async function getUser() {
        const AuthenticationService = require('../../services/AuthenticationService').default
        try
        {
          await AuthenticationService.getUser().then(u => {
            if (u != null)
            {
              setAuthHeader(u.access_token)
              GetMainAccount()
            }
          })
        }
        catch(e){
        }
      }
      
   getUser()
},[])// eslint-disable-line react-hooks/exhaustive-deps

const debouncedSearch = debounce((searchValue) => {
  if (maintAccountUsers != null) {
    const lowercasedFilter = searchValue.toLowerCase();
    const filtered = maintAccountUsers.filter(item =>
      item.fullName.toLowerCase().includes(lowercasedFilter) ||
      item.email.toLowerCase().includes(lowercasedFilter) ||
      item.domains.toLowerCase().includes(lowercasedFilter)
    );

    setFilteredData(filtered);
  }
}, 1000);


useEffect(() => {
  if (maintAccountUsers != null)
  {
    
  const lowercasedFilter = searchTerm.toLowerCase();
  // debugger;
  const filtered = maintAccountUsers.filter(item =>
    item.fullName.toLowerCase().includes(lowercasedFilter) ||
    item.email.toLowerCase().includes(lowercasedFilter) ||
    item.domains.toLowerCase().includes(lowercasedFilter)
  );

  setFilteredData(filtered);

  }
},[searchTerm, maintAccountUsers])// eslint-disable-line react-hooks/exhaustive-deps
useEffect(() => {
  
  if (maintAccountUsers != null)
  {
    
  async function GetMainAccount() {
    
    const startDateString = new Date(range[0].startDate).getTime()
    const endDateString = new Date(range[0].endDate).getTime()
    await axios.get(`${AppSettings.API_URL}/Admin/GetAllMainAccountUsers?startDate=${startDateString}&endDate=${endDateString}`,{ httpsAgent: agent  }).then(usr => {
        setMainAccountUsers(usr.data)
    })
  }

  GetMainAccount();
}
},[range])
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
function sortReport (c)
  {
    var sortedReport = [];
    if (filteredData != null)
    {
      var sortedAsc = isArraySortedAsc(filteredData, c)
    
      var sortedReport = []
  
      sortedReport = sortArrayOfObjects(filteredData, c, sortedAsc ? 'desc' : 'asc')
      setFilteredData(sortedReport)
    }
  }

  // Add this function to load more records
  const loadMore = () => {
    setDisplayLimit(prevLimit => prevLimit + 50);
  };

  // Modify the filtered data to respect the display limit
  const limitedFilteredData = filteredData.slice(0, displayLimit);

  if (userData)
    return (
      <>
        <Body>
          <Content>         
            <div className="header d-flex">
              <div><p>Login As</p></div>
            </div>
            {maintAccountUsers  != null &&
            <>
            
            <div className="form-group d-flex bd-highlight">
              <div className='w-100 mr-14'>
                <p className='mb-8'>Search user or email or domain</p>
                <div className='w-100'><input id='search' className='form-control' type="text" placeholder="Search..." value={searchTerm} onChange={e => {setSearchTerm(e.target.value); debouncedSearch(e.target.value)}} /></div>                      </div>
              <div className='w-100 mr-14'>
                <p className='mb-8'>Date range (for statistics)</p>
                  <DateRangeComp dateRange={setRange}/>
              </div>
            </div>
            <div className='report-table' style={{ maxHeight: '570px', overflow: 'auto' }}>
              <Table bordered className='rounded-top table-fixed reports-table'>
                <thead className='table-dark h-54'>
                  <tr>
                    <th><span className='d-flex' onClick={() => {sortReport("fullName")}}><p className='mb-0'>User </p><Image alt="Sort Url" src="/images/ic_sort.svg" width={20} height={20}></Image></span></th>
                    <th><span className='d-flex' onClick={() => {sortReport("email")}}><p className='mb-0'>Email </p><Image alt="Sort Url" src="/images/ic_sort.svg" width={20} height={20}></Image></span></th>
                    <th><span className='d-flex' onClick={() => {sortReport("domains")}}><p className='mb-0'>Domains </p><Image alt="Sort Url" src="/images/ic_sort.svg" width={20} height={20}></Image></span></th>
                    <th><span className='d-flex' onClick={() => {sortReport("createdAt")}}><p className='mb-0'>Date registered </p><Image alt="Sort Url" src="/images/ic_sort.svg" width={20} height={20}></Image></span></th>
                    <th><span className='d-flex' onClick={() => {sortReport("totalCreditUsage")}}><p className='mb-0'>Total credit usage </p><Image alt="Sort Url" src="/images/ic_sort.svg" width={20} height={20}></Image></span></th>
                    <th><span className='d-flex' onClick={() => {sortReport("webshopsCount")}}><p className='mb-0'>Webshops (count) </p><Image alt="Sort Url" src="/images/ic_sort.svg" width={20} height={20}></Image></span></th>
                    <th><span className='d-flex' onClick={() => {sortReport("totalPayments")}}><p className='mb-0'>Payments (count) </p><Image alt="Sort Url" src="/images/ic_sort.svg" width={20} height={20}></Image></span></th>
                    <th><span className='d-flex' onClick={() => {sortReport("totalPaymentsSubscription")}}><p className='mb-0'>Subscription Payments (count) </p><Image alt="Sort Url" src="/images/ic_sort.svg" width={20} height={20}></Image></span></th>
                    <th className='pe-none'></th>
                    <th className='pe-none'></th>
                  </tr>
                </thead>
                <tbody>
                  <Row row={limitedFilteredData} loadMore={loadMore} />
                </tbody>
              </Table>
            </div>
            </>
            }
          </Content>
        </Body>
      </> 
    )
}
