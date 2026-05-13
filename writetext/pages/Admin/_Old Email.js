import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Body from '../../components/Body'
import Content from '../../components/Content'
import { setAuthHeader } from '../../utils/axiosHeader'
import AppSettings from '../../settings/AppSetting'
import ModalPrompt from '../../components/ModalPrompt'

import {Tabs, Tab} from 'react-bootstrap'

export default function EmailTransaction({userData}) {
    //get url slugs
    const router = useRouter();
    const { query } = router;
    const emailSlug = query.email;
    
    const [emailTransaction, setEmailTransaction] = useState(null)
    useEffect(() => {
        async function getEmailTransactions(){
            const https = require("https");
            const httpsAgent = new https.Agent({ rejectUnauthorized: false });
            await axios.get(`${AppSettings.API_URL}/Admin/Email/1b29da2b-53ed-4090-a2d9-9ab284e1222a/2517012215769714632_536ed4b9-3fcf-4e41-baca-9b3a6d3d58d3`,{ httpsAgent: httpsAgent  }).then(p => {
               console.log(p.data)
               setEmailTransaction(p.data)
            })
        }
        async function getUser() {
            const AuthenticationService = require('../../services/AuthenticationService').default
            await AuthenticationService.getUser().then(u => {
                if (u != null)
                {
                    setAuthHeader(u.access_token)
                    getEmailTransactions()
                }
            })
        }
        getUser()
    },[])

    function formatDateTime(date) {
        const d = new Date(date);
        const userLocale = navigator.language.substring(0, 2);
        const options = {
            year: 'numeric',
            month: userLocale == 'en' ? 'short' : 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
        };
        const formattedDateTime = d.toLocaleDateString(userLocale, options);
        return formattedDateTime;
    }
  if (userData && emailTransaction)
  return (
    <>
    <Body>
        <Content>
            <div className='email-content' >
                <div className='container'>
                    <div className='form-group d-flex'>
                        <div className="form-floating mr-14 w-100">
                            <input id='recipient' className='form-control' type='text' placeholder='Recipient' value={emailTransaction.recipient} />
                            <label htmlFor='recipient'>Recipient</label>
                        </div>
                        <div className="form-floating mr-14 w-100">
                            <input id='type' className='form-control' type='text' placeholder='Type' value={emailTransaction.type} />
                            <label htmlFor='type'>Type</label>
                        </div>
                    </div>
                    <div className='form-group d-flex'>
                        <div className="form-floating mr-14 w-100">
                            <input id='subject' className='form-control' type='text' placeholder='Subject' value={emailTransaction.subject} />
                            <label htmlFor='subject'>Subject</label>
                        </div>
                        <div className="form-floating mr-14 w-100">
                            <input id='dateSent' className='form-control' type='text' placeholder='Date sent' value={formatDateTime(emailTransaction.dateSent)} />
                            <label htmlFor='dateSent'>Date sent</label>
                        </div>
                    </div>
                    <Tabs
                        defaultActiveKey="emailtransaction"
                        id="email-transaction-tabs"
                        className="email-tabs mb-3"
                    >
                    <Tab eventKey="emailtransaction" title="Email">
                        <div>
                            <iframe title='Email transaction'
                                width="100%"
                                height="550"
                                srcDoc={emailTransaction.htmlContent} >
                                
                            </iframe>
                        </div>
                    </Tab>
                        <Tab eventKey="textcontent" title="Text content">
                            <div className='form-group d-flex'>
                                <div className="form-floating mr-14 w-100">
                                    <textarea id='textContent' className='form-control' height="270" placeholder='Text content' value={emailTransaction.textContent}></textarea>
                                    <label htmlFor='textContent'>Text content</label>
                                </div>
                            </div>
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </Content>
    </Body>
    </>
  )
}
