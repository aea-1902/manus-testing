import React, { useEffect, useState } from 'react'
import axios from 'axios'
import Body from '../../components/Body'
import Content from '../../components/Content'
import { setAuthHeader } from '../../utils/axiosHeader'
import {Storagekeys} from '../../settings/StorageKeys';
import AppSettings from '../../settings/AppSetting'

function Servers(props){
    const { regions, models } = props;
    const [servers, setServers] = useState(null)


    async function handleModelChange(event){
        var id = event.target.dataset.id
        var domain = event.target.dataset.domain
        var selectedModel = event.target.value

      
        const https = require("https");
        const httpsAgent = new https.Agent({ rejectUnauthorized: false });
        await axios({
            method: 'POST',
            url: `${AppSettings.API_URL}/Admin/textservers/${id}/model/${selectedModel}`,
            headers: {"Content-Type": "application/json"}
          }).then(p => {
          })
        //update server model
    }
    return (
        <>
            {
                regions.map((r, index) => (
                    <div className='region' key={index}>
                        <div className='region-name'><p>{r.name}</p></div>
                        <div className='region-servers'>
                            {r.servers.length > 0 &&
                                r.servers.map((s, serverIndex) => (
                                    <div className='server' key={serverIndex}>
                                        <div><p>{s.id}</p></div>
                                        <div className='p-20'>
                                            <div className='d-flex mb-8'>
                                                <div>
                                                    <label>Model</label>
                                                </div>
                                                <div className='ml-auto model-select'>
                                                    <select id={`model-${s.id}`} className='ml-auto form-select' data-domain={r.domain} data-id={s.id} onChange={handleModelChange} defaultValue={s.model}>
                                                        <option value="">Select a model</option>
                                                            {
                                                                models.map((m, modelIndex) => (
                                                                    <option key={modelIndex} value={m}>{m}</option>
                                                                ))
                                                            }
                                                    </select>
                                                </div>
                                                
                                            </div>
                                            {
                                                s.attributes.map((a, attributesIndex) => (
                                                    <div className='d-flex mb-8' key={attributesIndex}>
                                                        <label className={a.name == "Error" ? "error" : ""}>{a.name}</label>
                                                        <label className={`ml-auto ${a.name == "Error" ? "error" : "" }`}>{a.value}</label>
                                                    </div>
                                                ))
                                            }
                                            
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                ))
            }
        </>
    )
}

export default function TextServers({userData}) {
    const [models, setModels] = useState(null)
    const [regions, setRegions] = useState(null)
    useEffect(() => {
        async function getTextServers(){
            const https = require("https");
            const httpsAgent = new https.Agent({ rejectUnauthorized: false });
            await axios.get(`${AppSettings.API_URL}/Admin/textservers`,{ httpsAgent: httpsAgent  }).then(p => {
                setModels(p.data.models)
                setRegions(p.data.regions)
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
                  getTextServers()
                }
              })
            }
            catch(e){
            }
          }
       getUser()
    },[])
if (userData)
  return (
  <>
    <Body>
        <Content>
            <div>
                <div>
                    <div className="header">
                        <p>Text servers</p>
                    </div>
                </div>
                
                <div>
                    {regions != null &&
                        <Servers regions={regions} models={models} />
                    }
                </div>
            </div>
        </Content>
      </Body>
  </>
  )
}
