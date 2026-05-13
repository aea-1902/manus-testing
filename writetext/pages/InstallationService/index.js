import React, { useEffect, useState, useRef } from 'react'
import Body from '../../components/Body'
import Content from '../../components/Content'
import { setAuthHeader } from '../../utils/axiosHeader'
import InstallationServiceCom from '../../components/InstallationService'
import t from '../../public/translation/locale'
import ModalDialog from '../../components/Modal'
import ModalUpdateAccount from '../../components/ModalUpdateAccount'
function InstallationService({userData}) {

    const [translation, setTranslation] = useState(null)
    const modalRef = useRef()
    const [hasSubscription, setHasSubscription] = useState(false)
    const [buyCreditsOpened, setBuyCreditsOpened] = useState(false)
      const [ongoingPurchase, setOngoingPurchase] = useState(false)
      const [newUserData, setNewUserData] = useState(userData)
        const [accountUpdated, setAccountUpdated] = useState(false)
    useEffect(() => {

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
                
                    // if (userData.allBilling.paymentSettings == null)
                    //     {
                    //         // buyCredits()
                    //     }
                    
                    if (userData)
                    {
                        const locale = navigator.language.substring(0,2); 
                        setTranslation(t[locale] != undefined ? t[locale].Content["InstallationService"] : t["en"].Content["InstallationService"])
                        if (userData.allBilling.billingInfo.billingInfoId !== "00000000-0000-0000-0000-000000000000")
                        {
                            setHasSubscription(true)
                        }
                    }
                    
                     
                }
            })
        }
        getUser()
    },[userData])// eslint-disable-line react-hooks/exhaustive-deps
    const updateAccount = () => {
        
        setTimeout(() => {
     
            const { Modal } = require("bootstrap")
            const myModals = new Modal("#updateaccount")
            myModals.show()

        }, 800);
    }
  if  (translation && userData)
  return (
    <>
    
    <Body>
        <Content>
            
        <ModalUpdateAccount userData={userData} setdata={setNewUserData} setAccountUpdated={setAccountUpdated} modalref={modalRef}></ModalUpdateAccount>
        <div>
            <div className="header">
                <p className='mb-15'>Installation service</p>
            </div>
            
        {/* {userData.allBilling.billingInfo.country.id == 0 &&
                    <>
                      <div className='empty-webshop'></div>
                      <p className='empty-webshop-text'>It looks like some details are missing in your account, such as your address. Without this, we won&#39;t be able to display the payment options or proceed with the installation service.
                      Please update your account settings to ensure everything runs smoothly.</p> 
                      
                      <div className='d-flex'>
                            <input type="button" className="btn btn-primary center plugin w-auto" value="Update Account Details" onClick={updateAccount}/>
                      </div>
                    </>
        } */}
        </div>
        {/* {userData.allBilling.billingInfo.country.id != 0 && */}
            <div className='installation-service'>
                <InstallationServiceCom userData={userData}/>
            </div>
            {/* } */}
        </Content>
    </Body>
    </>
  )
}

export default InstallationService