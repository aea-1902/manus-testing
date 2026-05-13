import React from 'react'
import { useEffect, useState, useRef } from 'react'
import { setAuthHeader } from '../../utils/axiosHeader'
import { useRouter } from 'next/router'
import axios from 'axios'
import Image from 'next/image'

import Body from '../../components/Body'
import Content from '../../components/Content'
import PluginsComponent from '../../components/Plugins'
import ModalDialog from '../../components/Modal'

import t from '../../public/translation/locale'


function Welcome() {
    
    const modalRef = useRef()
    const router = useRouter()
    const https = require("https")
    const httpsAgent = new https.Agent({ rejectUnauthorized: false })
    
    const AppSettings = require('../../settings/AppSetting').default
    const [user, setUser] = useState([])
    const [translation, setTranslation] = useState(null)
    const [dialogOpened, setDialogOpened] = useState(false)
    const [newUserData, setNewUserData] = useState(null)
    useEffect(() => {
        async function getAccount(){
            let account
            let webshops
            await axios.get(`${AppSettings.API_URL}/Account/All?GetAccount=true&GetCredit=true&GetCreditPlans=true&GetPaymentSettings=true&GetBillingInfo=true&GetInstallationPlan=true&Gateway=PayPal`,{ httpsAgent } ).then(usr => {
                account = usr.data.account
                setNewUserData(usr.data)
                axios.get(`${AppSettings.API_URL}/Webshop/GetWebshopURLs?includeDeleted=true`,{ httpsAgent }).then(w=> {
                   webshops = w.data
                   if (account.address.country != null)
                    closeModalDialog()
                   if (account.address.country != null && webshops.length > 0)
                       window.location.href = '/'
                  })
            })

            // if (account.address.country != null && webshopes.length > 0)
            //     window.location.href = '/home'
        }
        async function setPageVisited(){
            await axios.post(`${AppSettings.API_URL}/Welcome/UpdateWelcomeAccessDate`,{ httpsAgent  })
        }
        async function Init(){
            
            const locale = navigator.language.substring(0,2);
            getAccount();
            setTranslation(t[locale] != undefined ? t[locale].Content["Welcome"] : t["en"].Content["Welcome"])
            setPageVisited();
            setInterval(() => {
                getAccount();
            }, 5000);
       
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

  const closeModalDialog = () => {
    setDialogOpened(false)
    const myModalElement = document.getElementById('credits');

    // Function to hide the modal by removing Bootstrap's 'show' class
    const hideModal = () => {
      if (myModalElement) {
        myModalElement.classList.remove('show');
        myModalElement.style.display = 'none';
        myModalElement.setAttribute('aria-hidden', 'true');
        myModalElement.removeAttribute('aria-modal');
        myModalElement.removeAttribute('role');

        // If backdrop exists, remove it
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
          backdrop.remove();
        }
      }
    };

    setTimeout(hideModal, 1000);

  }
  useEffect(() => {
    
    const setCountry = () => {
           
        setDialogOpened(true)
        const { Modal } = require("bootstrap")
        const myModals = new Modal("#credits",{
            backdrop: 'static',
            keyboard: false
        });
        myModals.show()
    }
    
    
    if (newUserData !== null && newUserData.account.address.country == null && dialogOpened == false)  {
        
        setTimeout(() => {
            setCountry()
        }, 2000);
    }
  }, [newUserData]);
    if (!newUserData)
    {
        return  (<div style={{minHeight: '80vh'}}></div>)
    }
    if (translation && newUserData) {
        return (
            <>
                {/* userData.account.company.eligibleForFreePremiumCredits */}
                <div className='welcome-container w-100' style={{minHeight: '80vh'}}>
                    <Body classList={'m-0 scrollable-body'}>
                        <Content>
                            <div className='mt-0 mb-0 mx-auto'>
                                <iframe src={`https://writetext.ai/savings-calculator-iframe?${!newUserData.account.company.eligibleForFreePremiumCredits ? "hidefree=true" : ""}${newUserData.credit.membershipType > 0 ? "&premium=true" : "&premium=false"}`}
                                 width="100%" height="180px" frameborder="0"></iframe>
                            </div>
                            <div className={`d-flex welcome-content ${!newUserData.account.company.eligibleForFreePremiumCredits ? 'no-free-banner' : ''}`}>
                                {newUserData != null ? <PluginsComponent  translation={translation} userData={newUserData}/> : null}
                                
                            </div>
                        </Content>
                    </Body>
                </div>
                
                <ModalDialog target="credits" type="credits" hasSubscription={false} modalref={modalRef} userData={newUserData} opened={dialogOpened}/>
            </>
          
        )
    }
}

export default Welcome