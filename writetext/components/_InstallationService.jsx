import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from '@paypal/react-paypal-js'
import { Dropdown, Form,FloatingLabel } from 'react-bootstrap';
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import ModalPrompt from '../components/ModalPrompt'
import { event } from '../components/gtm'
import axios from 'axios'
import t from '../public/translation/locale'
import PaypalButtonInstallationService from '../components/Paypal/PaypalInstallationService'
import { Hint, Typeahead } from 'react-bootstrap-typeahead';
import ApiService from '../services/ApiService';
const AppSettings = require('../settings/AppSetting').default
import styles from '../styles/styling/InstallationService.module.css'
function InstallationService({userData, classList}) {

    const router = useRouter()
    const currentRoute = router.route.toLowerCase()
    const [translation, setTranslation] = useState(null)
    const domainsCount = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
    const [selectedDomainCount, setSelectedDomainCount] = useState(1)
    const [installationAmount, setInstallationAmount] = useState(0);

    const [selectedCountry, setSelectedCountry] = useState([])
    const [countriesList, setCountriesList] = useState([])
    const [isFormDirty, setIsFormDirty] = useState(false)
    const [paypalSettings, setPaypalSettings] = useState(null);
    useEffect(() => {
        const Init = async ()  => {
        const locale = navigator.language.substring(0,2); 
        setTranslation(t[locale] != undefined ? t[locale].Content["InstallationService"] : t["en"].Content["InstallationService"])
        const userAccount = await ApiService.get(`${AppSettings.API_URL}/Account/All?GetAccount=true&GetCredit=true&GetCreditPlans=true&GetPaymentSettings=true&GetBillingInfo=true&GetInstallationPlan=true&Gateway=PayPal`)
        
        setPaypalSettings(userAccount.data.allBilling.paymentSettings)
        const countries = await ApiService.get(`${AppSettings.API_URL}/CountryModels/GetCountries`)
        setCountriesList(countries.data)
        }

        Init()
    },[])
    
    useEffect(() => {
        setInstallationAmount(userData.allBilling.installationPlan.amount * selectedDomainCount)

        
    },[selectedDomainCount])
    const setCountry = (e) => {

        e.preventDefault();
        if (isFormDirty)
        {
          const countryName = document.getElementById("country").value
          const formData = new FormData()
          
          formData.append('CountryName', selectedCountry[0])
          formData.append('FirstName',userData.account.firstName)
          formData.append('LastName', userData.account.lastName);
          
          axios({
            method: 'POST',
            url: `${AppSettings.API_URL}/Account/UpdateAccountDetails`,
            data: formData,
            headers: {"Content-Type": "application/json"}
          }).then(r => {
           
              window.location.href = '/installationservice';
          })
        }
    }
    const handleAutoFillCountry = (e) => {
    if (e != null && e != undefined && e != "")
    {
        const country = countriesList.filter(c => c.text === e).map(function (c) { return c.text})
        if (country.length > 0)
        {
            setSelectedCountry(country)
        }
    }
    }
    
    const updateAccount = () => {
        
        setTimeout(() => {
     
            const { Modal } = require("bootstrap")
            const myModals = new Modal("#updateaccount")
            myModals.show()

        }, 800);
    }
if (userData && translation)
  return (
    <>
    
    <ModalPrompt target="installation" ></ModalPrompt>
        {paypalSettings != null &&
        <>
        <div>
            <div className="header">
                <p className='installation-info mb-15'>{translation["PageSubHeaderText"].replaceAll('{textAmountDisplay}',userData.allBilling.installationPlan.currency + ' ' + userData.allBilling.installationPlan.amount).replace('{textAmountDisplayMultiplied}', userData.allBilling.installationPlan.currency + ' ' + userData.allBilling.installationPlan.amount * 2)}</p>
                <p className='installation-info'> The price is the same across WooCommerce, Magento, and Shopify. Read more about the installation service <Link href="https://writetext.ai/installation-service" target='_blank'>here.</Link></p>
            </div>
        </div>
        
        <div className={`installation-service-paypal-container installation p40 ${classList}`}>
            <div style={{maxWidth: '500px', margin: '0 auto'}}>
                <div className='d-flex h-53 mb-30'>
                    <div className='w-49 left-text'>
                        <p>Installation service</p>
                        <p>{userData.allBilling.installationPlan.currency + ' ' + userData.allBilling.installationPlan.amount} per domain</p>
                    </div>
                    <div className='vl'></div>
                    <div className='right-text d-flex mr-0 ml-auto align-items-center domain-count'>
                        
                        <p className='mr-20 mb-0'>Number of domains</p>
                        <Dropdown >
                            <Dropdown.Toggle id="dropdown-domain" className={`form-control h-45 mw-225 ${styles.dropdownToggle}`}>{selectedDomainCount}</Dropdown.Toggle>
                            <Dropdown.Menu>
                            {domainsCount.map((item, index) => (
                                <Dropdown.Item key={index} onClick={()=>setSelectedDomainCount(item)}>{item}</Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                        
                    </div>
                </div>
                <div>
                    <PayPalScriptProvider 
                    options={{
                        "client-id": paypalSettings.clientId,
                        components: "buttons",
                        currency: userData.allBilling.installationPlan.currency
                    }}>
                    <PaypalButtonInstallationService planId={userData.allBilling.installationPlan.id} quantity={selectedDomainCount}  amount={installationAmount} subscriptionMessage={""}/>
                    </PayPalScriptProvider>
                </div>
            </div>
        </div>
        </>
    }
        </> 
        
     
  )
}

export default InstallationService