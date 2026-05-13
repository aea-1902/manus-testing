import React, { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/router'
import Image from 'next/image'
import Body from '../../components/Body'
import Content from '../../components/Content'
import axios from 'axios'
import { setAuthHeader } from '../../utils/axiosHeader'
import t from '../../public/translation/locale'
import { Table } from "react-bootstrap";
import ModalKeys from '../../components/ModalKeys'
import ModalDelete from '../../components/ModalDelete'
import {LocaleDateString} from '../../helpers/DateHelper'
import apiService from '../../services/ApiService'
import { MemberTypeEnum } from '../../enum/MemberType'
function Row(props){
    const {row, editkey, deletekey} = props
    return(
        <>
        {row != null && row.map((mainRow, index) => (
            <tr key={index}>
                <td><span>{mainRow.firstName} {mainRow.lastName}</span></td>
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
export default function Api({userData}) {
    const AppSettings = require('../../settings/AppSetting').default

    const [translation, setTranslation] = useState(null)
    const modalRef = useRef()
    const https = require("https")
    const httpsAgent = new https.Agent({ rejectUnauthorized: false })
    const [tokens, setTokens] = useState([])
    const [keyId, setKeyId] = useState('')
    const [keyData, setKeyData] = useState(null)
    const [keyIdToDelete, setKeyIdToDelete] = useState(null)
    const [reload, setReload] = useState(false)
    const [loadingTokens, setLoadingTokens] = useState(true)
    const router = useRouter()

  

    async function getKeys() {
        const apiUrl = `${AppSettings.API_URL}/ApiToken`
        await apiService.get(apiUrl).then(res => {
            if (res.data.length > 0) {
                const filteredData = res.data.filter(r=>r.urls != null);
                const sortedData = filteredData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                
                setTokens(sortedData);
                setLoadingTokens(false);
            } else {
                setTokens([]);
                setLoadingTokens(false);
            }
        })
    } 
    useEffect(() => {
        if (reload){
            getKeys()
            setKeyId('')
            setKeyData(null)
            setReload(false)
        }
    },[reload])
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
                
                    const locale = navigator.language.substring(0,2); 
                    setTranslation(t[locale] != undefined ? t[locale].Content["Keys"] : t["en"].Content["Keys"])}
                    getKeys()
            })
        }
        getUser()
  },[])
  function generateKeys(){
    setKeyId('')
    setKeyData(null)
    const { Modal } = require("bootstrap")
    const myModals = new Modal("#create-key");
    myModals.show()
  }
  function editKey(value){
    setKeyId(value)
    setKeyData(tokens.filter(token => token.id == value)[0])
    const { Modal } = require("bootstrap")
    const myModals = new Modal("#create-key");
    myModals.show()
  }

  function confirmDeleteKey(value)
  {
    setKeyIdToDelete(value)
    const { Modal } = require("bootstrap")
    const myModals = new Modal("#delete-key");
    myModals.show()
  }

  function deleteKey(){
    apiService.post(`${AppSettings.API_URL}/ApiToken/${keyIdToDelete}/delete`).then(res => {
        setReload(true)
    })
  }
  const hasProAccess = () => {
    return userData.credit.hasProAccess;
  }
  const isFreeTrial = () => {
    return userData.credit.membershipType == MemberTypeEnum.FREETRIAL;
  }

  const isFreeTrialEnded = () => {
    
    const freeTrialExpiration = new Date(userData.credit.subscriptionExpiration);
    const today = new Date();
    return userData.credit.membershipType == MemberTypeEnum.FREETRIAL && freeTrialExpiration <= today;
  }
  if  (translation && userData)
  return (
    <>
    
    <Body>
        <Content>
            <ModalKeys target="create-key" modalref={modalRef} keyId={keyId} keyData={keyData} setReload={setReload} setKeyId={setKeyId}></ModalKeys>
            <ModalDelete target="delete-key" modalref={modalRef}  prompt="" onDelete={deleteKey}></ModalDelete>
            <div> 
                <div>
                    <div className="header d-flex">
                        <p>{translation["PageHeaderText"]}</p>
                        
                        
                        <div className='ms-auto'>
                            <button className="btn btn-primary btn-secret mb-15" onClick={generateKeys} disabled={(isFreeTrial() && isFreeTrialEnded())}>Generate key</button>
                        </div>
                        
                    </div>
                    <div className="header">
                        <p className='installation-info mb-10'>The <a href='https://chromewebstore.google.com/detail/writetextai/dgjonbjbmfipklfhpmpfdofephhfmhdi' target='_blank'>Chrome extensions</a> lets you review and comment directly on the product page of your ecommerce site. Comments made through the extension sync automatically with your WriteText.ai workspace, making it ideal for collaborative team workflows.</p>
                        <p className='installation-info mb-10'>In order to link this WriteText.ai account with the Chrome extension, please create a key by entering the name of the person you want to assign the key to. Enter the key in the extension login screen</p>
                        <p className='installation-info mb-30'>To remove access, simply delete the key. For security reasons, we do not store the secret key. If you lose it or need to reinstall your Chrome extension, please generate a new key.</p>
                    </div>
                </div>
                {isFreeTrial() && isFreeTrialEnded() &&
                <div className={`header-tos free-trial-banner`}>
                    <div>
                      <p className="banner-title">Your free trial has ended.</p>
                      <p className="banner-text mb-0" style={{maxWidth: "740px"}}>You may continue to access the Chrome extension but in order to use it with WriteText.ai, you have to purchase a credit bundle under Starter or subscribe to the Pro plan.</p>
                    </div>
                    <div className='ms-auto mt-auto'>
                      <button className="btn btn-primary" onClick={() => router.push('/premium')} style={{width: '190px'}}>Go to Plans & Credits</button>
                    </div>
                </div>
                }
                {(!isFreeTrial() || !isFreeTrialEnded()) &&
                <>
                    
                {loadingTokens ?
                <div className='d-flex'>
                <Image className='mx-auto' src="https://writetextaistorage.z6.web.core.windows.net/ic_loader_writetext_backend.gif" width={100} height={100} alt="loader"></Image>
                </div>
                : 
                <>
                { tokens.length == 0 
                    ?
                    <div className='no-keys d-flex mb-42'> 
                        <div className='mx-auto'>
                            <p>You don&apos;t have any API keys right now. Click the button above to make one and get started.</p>   
                        </div>
                    </div>
                    :
                    <div className='keys-table mb-42'>
                        <Table className='table-borderless'>
                            <thead>
                                <tr>
                                    <th scope="col">Name</th>
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
                </>
                }
                
            </div>
        </Content>
    </Body>
    </>
  )
}
