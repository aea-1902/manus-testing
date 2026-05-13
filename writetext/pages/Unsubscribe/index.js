import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Content from '../../components/Content'
import apiService from '../../services/ApiService'
const AppSettings = require('../../settings/AppSetting').default
export default function Unsubscribe() {
  const [hasLoggedUser, setHasLoggedUser] = useState(null)
    const router = useRouter();
    let userAgent = typeof window !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
    const { query : { id }} = router
    let props = {
     id
    }
    useEffect(() => {
        const unsubscribe = async (id) => {
            await apiService.put(`${AppSettings.API_URL}/NotificationRecipients/Unsubscribe/${id}`)
        }
        if (props.id)
            unsubscribe(props.id)

        
        async function getUser() {
            const AuthenticationService = require('../../services/AuthenticationService').default
            AuthenticationService.getUser().then(u => {
              if (u != null)
              {
                setHasLoggedUser(true)
                //setSuccessfulLogin(true)
              }
              else
              {
                setHasLoggedUser(false)
              }
              
            })
          }
          getUser()
    },[router])
    useEffect(() => {
        
    },[])
    return (
        <>
            <Content backgroundclass={`${userAgent.includes('firefox') ? 'firefox' : ''} scrollable-container steps terms`}>
                <div className='anonymous-policy-container unsubscribe'>
                    
                    <div className='unsubscribe-image'></div>
                    <p className='unsubscribe-header-text'>You&apos;ve successfully unsubscribed</p> 
                    <p className='unsubscribe-sub-text mb-36'>We&apos;re sorry to see you go! You won’t receive further emails from us.<br/>
                    Change your mind? You can resubscribe by contacting the main account user of WriteText.ai.</p>
                      
                    <div className='d-flex'>
                        <input type="button" className="btn btn-primary btn-recipient-save m-auto font-14 h-45" value={hasLoggedUser ? 'Go to home' : 'Sign in'} onClick={() => window.location.href = "/home"}/>
                    </div>
                </div>
            </Content>
        </>
    )
}
    