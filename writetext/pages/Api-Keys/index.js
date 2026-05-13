import React, { useEffect, useState, useRef } from 'react'
import Image from 'next/image'
import { Table } from "react-bootstrap";
import t from '../../public/translation/locale'
import Body from '../../components/Body'
import Content from '../../components/Content'
import ModalApiKeys from '../../components/ApiKeys/ModalApiKeys'
import ModalDelete from '../../components/ApiKeys/ModalDelete'

import apiService from '../../services/ApiService'
import {LocaleDateString} from '../../helpers/DateHelper'
import { MemberTypeEnum } from '../../enum/MemberType'
import { useRouter } from 'next/router'
export default function ApiKeys({userData}) {
  const AppSettings = require('../../settings/AppSetting').default
  const modalRef = useRef()
  const router = useRouter()
  const [translation, setTranslation] = useState(null)
  const [tokens, setTokens] = useState([])
  const [keyId, setKeyId] = useState('')
  const [keyData, setKeyData] = useState(null)
  const [keyIdToDelete, setKeyIdToDelete] = useState(null)
  const [reload, setReload] = useState(false)
  const [region, setRegion] = useState([])
  const [loadingTokens, setLoadingTokens] = useState(true)
  
  useEffect(() => {
    const init = async () => {
      const locale = navigator.language.substring(0,2)
      setTranslation(t[locale] != undefined ? t[locale].Content["ApiKeys"] : t["en"].Content["ApiKeys"])
      await getRegions()
      await getKeys()
    }
    init()
  },[])
  
  const memberType = () => {
    return userData.credit.membershipType
  }
  const getRegions = async ()=>{
    let region = ''
    const retVal = await apiService.get(`${AppSettings.API_URL}/Regions`)

    const pingRegions = async () => {
      retVal.data.forEach(async e => {
        const ping = await apiService.get(`https://${e}/Text/Ping`)
        if (region == '')
        {
          region = ping.request.responseURL
          const url = new URL(ping.request.responseURL)
          const domain = url.hostname
          setRegion(domain)
        }
      });
    }
    await pingRegions()

  }
  const getKeys = async () => {
    
    const retVal = await apiService.get(`${AppSettings.API_URL}/ApiToken/AccessTokens`)
      
    setTokens(retVal.data)
    setLoadingTokens(false)
  }
  const generateKeys = async () => {
    setKeyId('')
    setKeyData(null)
    
    const { Modal } = require("bootstrap")
    const myModals = new Modal("#create-key");
    myModals.show()
  }
  const deleteKey = async () => {
    await apiService.post(`${AppSettings.API_URL}/ApiToken/${keyIdToDelete}/DeleteApiAccessToken`)
    await getKeys()
  }
  const editKey = async (value) => {
    setKeyId(value),
    setKeyData(tokens.filter(token => token.id == value)[0])
    const { Modal } = require("bootstrap")
    const myModals = new Modal("#create-key");
    myModals.show()
  }
  const confirmDeleteKey = async (value) => {
    setKeyIdToDelete(value)
    const { Modal } = require("bootstrap")
    const myModals = new Modal("#delete-key");
    myModals.show()
  }
  const hasProAccess = () => {
    return userData.credit.hasProAccess;
  }
  if (translation && userData) 
  return (
    <>
      <Body>
        <Content>
          <ModalApiKeys target="create-key" modalref={modalRef} keyId={keyId} keyData={keyData} setReload={setReload} setKeyId={setKeyId} onSave={getKeys} region={region} ></ModalApiKeys>
          <ModalDelete target="delete-key" modalref={modalRef}  prompt="" onDelete={deleteKey}></ModalDelete>
          <div className='d-flex'>
            <div>
              <div className="header d-flex">
                  <p>API keys</p>
                  
                  {!hasProAccess() && <Image src="/images/ic_pro.svg" alt="pro" width={49} height={19} style={{marginTop: '13.5px', marginLeft: '15px'}} />}
                  {hasProAccess() &&
                    <div className='ms-auto'>
                        <button className="btn btn-primary btn-secret mb-15" onClick={generateKeys}>Create secret key</button>
                    </div>
                  }
              </div>
              <div className="header">
                          <p className='installation-info mb-0'>If you plan to use the WriteText.ai API, you must generate an API key. This key allows your applications to authenticate and interact with our API services. <br></br><br></br> Do <b>not</b> share your API key with others or expose it in client-side code (such as browsers or public repositories). If an API key is compromised, it may be automatically disabled to protect your account and data.<br></br><br></br></p>
                          
                          <p className='installation-info mb-30'><b>Disclaimer: </b>WriteText.ai is not responsible for any unauthorized use of your API key. While we take security measures to protect your data, we <b>cannot be held liable</b> if an API key is compromised and is <b>not automatically disabled</b>. It is your responsibility to keep your API key secure. <br></br><a href="https://writetext.ai/api" target="_blank">Learn more about the API</a> or <a href="https://writetext.ai/api/docs/getting-started" target="_blank" >view the API documentation.</a></p>
                  </div>
              <div className='d-flex'>
                
                <div className='w-100'>
                  {!hasProAccess() &&
                  <>
                    <div className='header-tos'>
                        <div>
                          <p className='tos-title'>This is a Pro feature.</p>
                          <p className='tos-text' style={{marginBottom: '0px', marginRight: '0px'}}>These features are only available for Pro users. Subscribe to the Pro plan to unlock SEO and automation tools.</p>
                        </div>
                        
                        <div className='ms-auto mt-auto'><button className="btn btn-primary tos-btn"  onClick={() => router.push('/premium')} style={{width: '190px'}}>Go to Plans & Credits</button> </div>
                    </div>
                  </>
                  }
                  {hasProAccess() && 
                  <>
                    {loadingTokens ?
                    <div className='d-flex'>
                      <Image className='mx-auto' src="https://writetextaistorage.z6.web.core.windows.net/ic_loader_writetext_backend.gif" width={100} height={100} alt="loader"></Image>
                    </div>
                    : 
                    <>
                      {tokens.length == 0 
                      ?
                      <div className='no-keys d-flex mb-42'> 
                          <div className='mx-auto'>
                              <p>You don&apos;t have any API keys right now. Click the button above to make one and get started.</p>   
                          </div>
                          {/* <div className='m-auto'> 
                              <button className="btn btn-secret" onClick={generateKeys}>Generate key</button>
                          </div> */}
                      </div>
                      :
                      <div className='apikeys-table'>
                        <Table className='table-borderless'>
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
                                    {/* <th scope="col">Platform</th> */}
                                    <th scope="col">Webshop</th>
                                    <th scope="col">Secret key</th>
                                    <th scope="col">Created</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Last used</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody >
                                <Row row={tokens} editkey={editKey} deletekey={confirmDeleteKey}></Row>
                            </tbody>
                        </Table>
                        </div> 
                      }
                    </>
                    }
                  </>}
                  
                </div>
                {hasProAccess() &&
                <div>
                  <div className='ad-banner'>
                  <Image src='/images/logo_colored_full.svg' alt='1902 Software' width={143} height={40}></Image>
                  <p>If you need a developer to integrate the WriteText.ai API into your custom ecommerce site, our parent company, <b>1902 Software</b>, has a team of expert in-house ecommerce developers ready to help. Book a no-commitment meeting to learn more.</p>
                  <button className='btn btn-primary' onClick={() => window.open('https://1902software.com/contact-us/', '_blank')}>Talk to us</button>
                  </div>
                </div>
                }
              </div>
              
              
            </div>
            
          </div>
          
        </Content>
      </Body>
    </>
  )
}


const Row = (props) => {
  const {row, editkey, deletekey} = props
  return(
      <>
      {row != null && row.map((mainRow, index) => (
          <tr key={index}>
              <td><span>{mainRow.name}</span></td>
              {/* <td><span>{mainRow.platform}</span></td> */}
              <td><span>{mainRow.webshop}</span></td>
              <td><span>{mainRow.tokenDisplay}</span></td>
              <td><span>{LocaleDateString(mainRow.createdAt)}</span></td>
              <td><span>{mainRow.email}</span></td>
              <td><span></span>{mainRow.lastUsed != null && mainRow.lastUsed !== '0001-01-01T00:00:00Z' ? LocaleDateString(mainRow.lastUsed) : ''} </td>
              <td onClick={() => editkey(mainRow.id)} title='Edit' data-keyid={mainRow.id}>
                  <div>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id={`ic_edit_${mainRow.id}`}>
                      <path id={`Vector_${mainRow.id}_edit`} d="M2 11.6399V13.6666C2 13.8533 2.14667 13.9999 2.33333 13.9999H4.36C4.44667 13.9999 4.53333 13.9666 4.59333 13.8999L11.8733 6.62659L9.37333 4.12659L2.1 11.3999C2.03333 11.4666 2 11.5466 2 11.6399ZM13.8067 4.69325C13.8685 4.63158 13.9175 4.55832 13.951 4.47767C13.9844 4.39702 14.0016 4.31057 14.0016 4.22325C14.0016 4.13594 13.9844 4.04949 13.951 3.96884C13.9175 3.88819 13.8685 3.81493 13.8067 3.75325L12.2467 2.19325C12.185 2.13145 12.1117 2.08242 12.0311 2.04897C11.9504 2.01551 11.864 1.99829 11.7767 1.99829C11.6894 1.99829 11.6029 2.01551 11.5223 2.04897C11.4416 2.08242 11.3683 2.13145 11.3067 2.19325L10.0867 3.41325L12.5867 5.91325L13.8067 4.69325Z" fill="#1A1A1A"/>
                      </g>
                      </svg>
                  </div>
              </td>
              <td onClick={() => deletekey(mainRow.id)} title='Delete'>
                  <div>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <g id={`iconamoon:trash_${mainRow.id}`}>
                      <path id={`Vector_${mainRow.id}_delete`} d="M9.77778 7.22222V11.8889M6.66667 7.22222V11.8889M3.55556 4.11111V13.4444C3.55556 13.857 3.71944 14.2527 4.01117 14.5444C4.30289 14.8361 4.69855 15 5.11111 15H11.3333C11.7459 15 12.1416 14.8361 12.4333 14.5444C12.725 14.2527 12.8889 13.857 12.8889 13.4444V4.11111M2 4.11111H14.4444M4.33333 4.11111L5.88889 1H10.5556L12.1111 4.11111" stroke="#CC0000" stroke-linecap="round" stroke-linejoin="round"/>
                      </g>
                      </svg>
                  </div>
              </td>
          </tr>
      ))}
      
      </>
  )
}
