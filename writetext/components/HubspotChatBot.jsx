import React, { useEffect } from 'react'
import Script from 'next/script'
export default function HubspotChatBot({userData}) {
    async function Init(){
        if (userData) {
            <Script  src="//js.hsforms.net/forms/embed/v2.js"></Script>
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
                          formId: '73f98a96-3fbd-4d07-b32e-180c1c8fa566',
                          target: '#hsChatBot',
                          onFormReady: function($form) {
                            $form.getElementsByClassName('hs-button')[0].style.display = 'none'
                          },
                          onFormSubmitted: function($form) {
                          }
                      })
                  }
              });
  
  
            });
        }
    }
    useEffect(() => {
        Init()
    }, [])
  return (
    <div id="hsChatBot" style={{display: 'none'}}></div>
  )
}
