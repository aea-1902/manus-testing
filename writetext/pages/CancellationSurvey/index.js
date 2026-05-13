import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'

import Body from '../../components/Body'
import Content from '../../components/Content'
import PluginsComponent from '../../components/Plugins'
import { setAuthHeader } from '../../utils/axiosHeader'
import { useRouter } from 'next/router'
import t from '../../public/translation/locale'

function CancellationSurvey({userData}) {
   
    const [user, setUser] = useState([])
    const [translation, setTranslation] = useState(null)
    const router = useRouter()
    
    useEffect(() => {
      async function Init() {
        const https = require("https");
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });
        const AppSettings = require('../../settings/AppSetting').default

        const locale = navigator.language.substring(0,2); 
        setTranslation(t[locale] != undefined ? t[locale].Content["CancellationSurvey"] : t["en"].Content["CancellationSurvey"])

        if (userData) {
          const scriptLoader = document.createElement('script');
          scriptLoader.src='//js.hs-scripts.com/41405234.js';
          scriptLoader.async = true;
          document.body.appendChild(scriptLoader);

          scriptLoader.addEventListener('load', () => {
            /* Start of HubSpot tracking code */
            var _hsq = window._hsq = window._hsq || [];
            _hsq.push(["identify",{
                email: userData.account.email
            }]);
            /* End of HubSpot tracking code */

            const script = document.createElement('script');
            script.src='//js.hsforms.net/forms/v2.js';
            document.body.appendChild(script);

            script.addEventListener('load', () => {
                // @TS-ignore
                if (window.hbspt) {
                    // @TS-ignore
                    window.hbspt.forms.create({
                        region: 'na1',
                        portalId: '41405234',
                        formId: 'adda4a17-f02b-4ada-8623-4c5f4a2f16fb',
                        target: '#cancellationForm',
                        onFormReady: function($form) {
                          $form.getElementsByTagName("input").namedItem("email").value = userData.account.email;
                          $form.getElementsByTagName("textarea")[0].style.height = '180px'
                        },
                        onFormSubmitted: function($form) {
                          document.getElementById('skip-survey').style.display = 'none'
                          document.getElementById('installation-info').style.display = 'none'
                        }
                    })
                }
            });

            //create onFormSubmitted for the hubspot form

          });
        }
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
            setUser(u)
            Init()  }
        })
      }
      if (userData)
      {
        if (userData.allBilling.billingInfo.accountCancelledDate == null) {
          router.push('/home')
        }
      }
       
        getUser()

    },[userData])// eslint-disable-line react-hooks/exhaustive-deps

    if (translation && userData)
    {
      if (userData.allBilling.billingInfo.accountCancelledDate != null) {
        return (
            <>
                <Body>
                    <Content>
                        <div className='d-flex'>
                            <div className="header">
                                <p>{translation["PageHeaderText"]}</p>
                            </div>
                            <div className='ml-auto'>
                              <Link id='skip-survey' href="/premium">Skip survey<Image className='ml-8' src="/images/ic-forward.svg" width="8" height="10" alt='skip survey'></Image></Link>
                            </div>
                        </div>
                        <div>
                            <div className="header">
                                <p id='installation-info' className='installation-info'>{translation["PageSubHeaderText"]}</p>
                            </div>
                        </div>
                        <div id="cancellationForm">
                        </div>
                    </Content>  
                </Body>
            </>
        )
      }
    }
}

export default CancellationSurvey