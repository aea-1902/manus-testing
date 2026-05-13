import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Payments from '../../components/Payments'
import Header from '../../components/Header'
import SideMenu from '../../components/SideMenu'
import Body from '../../components/Body'
import Content from '../../components/Content'
import Footer from '../../components/Footer'
import ModalDialog from '../../components/Modal'
import { setAuthHeader } from '../../utils/axiosHeader'
import { useRouter } from 'next/router'
import t from '../../public/translation/locale'
const Payment = ({userData}) => {
   
  const [payments,setPayments] = useState([])
  const [user, setUser] = useState([])
  const router = useRouter()
  const [translation, setTranslation] = useState(null)
  const [hasSubscription, setHasSubscription] = useState(false)
  const [loaded, setLoaded] = useState(false)
 

  useEffect(() => {
      async function Init(){
        

        const locale = navigator.language.substring(0,2); 
        setTranslation(t[locale] != undefined ? t[locale].Content["Payments"] : t["en"].Content["Payments"])
        const https = require("https");
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });
        const AppSettings = require('../../settings/AppSetting').default

        await axios.get(`${AppSettings.API_URL}/Billing/GetPayments`,{ httpsAgent }).then(r => {
          setPayments(r.data) 
          setLoaded(true)
        })
       }
       async function getUser() {
          const AuthenticationService = require('../../services/AuthenticationService').default
          await AuthenticationService.getUser().then(u => {
            setAuthHeader(u.access_token)
            setUser(u)
            Init()  
          })
        }
    getUser()
    
  },[])// eslint-disable-line react-hooks/exhaustive-deps
         
     
  if (userData && loaded)
  return (
    <>

      <Body>
        <Content>
          <div>
            <div className="header">
                <p className='mb-30'>{translation["PageHeaderText"]}</p>
            </div>
            <div>
              {payments.length != 0 ? 
              
              <Payments payments={payments} />
              :
              <>
              
              <div className='empty-payment'></div>
              <p className='empty-payment-text'>Your payment records will show here.</p> 
              </>
              }
            </div>
          </div>
        </Content>  
      </Body>
    </>
  )
}

export default Payment