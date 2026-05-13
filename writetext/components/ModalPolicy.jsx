
import {PolicyEnum} from "../enum/PolicyType"
import { useEffect, useState } from 'react'
import axios from 'axios'

export default function ModalPrompt({target, modalref, policyType}) {
  
  const AppSettings = require('../settings/AppSetting').default
  const [policy, setPolicy] = useState('')
  function GetPolicy()
  {
    
    axios.get(`${AppSettings.API_URL}/Policies/GetPolicy?type=${policyType}`, { httpsAgent }).then(res => {
            setPolicy(res.data.text)
    })
  }

  function AcceptPolicy()
  {
    axios.post(`${AppSettings.API_URL}/Policies/AcceptPolicy?type=${policyType}`, { httpsAgent }).then(res => {

    })
  }
  useEffect(() => {
    GetPolicy()
  },[])// eslint-disable-line react-hooks/exhaustive-deps
  const https = require("https")
  const httpsAgent = new https.Agent({ rejectUnauthorized: false })
  
    let title = ""
    let text = ""
    if (policyType === PolicyEnum.PrivacyPolicy) {
      title = "Privacy Policy"
      text = "This is the privacy policy."
    } else if (policyType === PolicyEnum.TermsOfService) {
      title = "We've updated our terms"
      text = "We encourage you to review our updated <a href='/terms/policy' target='_blank'>Terms of Service.</a> By continuing, you agree to the updated Terms listed here."
      
    } else if (policyType === PolicyEnum.CookiePolicy) {
      title = "Cookies Policy"
      text = "This is the cookies policy."
    }
    return (
      <div className="d-flex justify-content-center align-items-center" ref={modalref}>
        <div
          className="modal fade"
          id={target}
          tabIndex="-1"
          aria-labelledby={target}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-body tos-modal-body">
                <div>
                  <div className="modal-text d-flex">
                    <div className="">
                    <p className="tos-title">{title}</p>
                      <p className="tos-text" dangerouslySetInnerHTML={{ __html: text }} ></p>
                    </div>
                    <div className="right d-flex"><button className="btn btn-primary tos-btn" data-bs-dismiss="modal" onClick={AcceptPolicy}>I agree</button> </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  