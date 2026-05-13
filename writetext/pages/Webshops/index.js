import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Webshops from '../../components/Webshops'

import Body from '../../components/Body'
import Content from '../../components/Content'
import Modal from '../../components/Modal'
import ModalDialog from '../../components/Modal'
import { setAuthHeader } from '../../utils/axiosHeader'
import { useRouter } from 'next/router'
import Link from 'next/link'
import t from '../../public/translation/locale'
import { Translate } from '@mui/icons-material'
import Image from 'next/image'
import ApiService from '../../services/ApiService'
import { parseJwt } from '../../utils/helper';
import { Dropdown } from 'react-bootstrap';
import { TemplateTypeEnum } from '../../enum/TemplateType';
import styles from '../../styles/Webshops.module.css'

export default function Webshop({userData}) {
  
    const router = useRouter()
    const SSR = typeof window === 'undefined'
    const https = require("https");
    const httpsAgent = new https.Agent({ rejectUnauthorized: false });

    const [userURLs, setUserURLs] = useState(null)
    const [newUrl, setNewUrl] = useState(null)
    const [isAdding, setIsAdding] = useState(false)
    const [selectedUrl, setSelectedUrl] = useState(null)
    const AppSettings = require('../../settings/AppSetting').default
    const [translation, setTranslation] = useState(null)
    const [shopifyUrls, setShopifyUrls] = useState(null)
    const [magentoUrls, setMagentoUrls] = useState(null)
    const [wordPressUrls, setWordPressUrls] = useState(null)
    const [noPlateformUrls, setNoPlateformUrls] = useState(null)
    const [loading, setLoading] = useState(true)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isAnyExpanded, setIsAnyExpanded] = useState(false)
    const [collapsedBlocks, setCollapsedBlocks] = useState({
      'platform-magento': false,
      'platform-shopify': false,
      'platform-woocommerce': false
    })

    const [adminUrls, setAdminUrls] = useState(null)
    
    const [adminShopifyUrls, setAdminShopifyUrls] = useState(null)
    const [adminMagentoUrls, setAdminMagentoUrls] = useState(null)
    const [adminWordPressUrls, setAdminWordPressUrls] = useState(null)
    const [adminNoPlatformUrls, setAdminNoPlatformUrls] = useState(null)
    const [adminDeletedUrls, setAdminDeletedUrls] = useState(null)
    const [adminDeletedShopifyUrls, setDeletedAdminShopifyUrls] = useState(null)
    const [adminDeletedMagentoUrls, setDeletedAdminMagentoUrls] = useState(null)
    const [adminDeletedWordPressUrls, setDeletedAdminWordPressUrls] = useState(null)
    const [adminDeletedNoPlatformUrls, setDeletedAdminNoPlatformUrls] = useState(null)

    const [selectedDomain, setSelectedDomain] = useState(null)

    const [webshopTemplates, setWebshopTemplates] = useState(null)
    const [webshopTemplatesOptions, setWebshopTemplatesOptions] = useState(null)

    async function setPlatformUrls(webshops){
      const platforms = {
        woocommerce: [],
        wordpress: [],
        magento: [],
        shopify: [],
        noPlatform: [],
      }
      webshops.forEach((webshop) => {
        if (webshop.platform !== null)
        {
          webshop.platform = webshop.platform?.toLowerCase() || 'no platform';
        if (platforms[webshop.platform] != undefined) {
          platforms[webshop.platform].push(webshop);
        }
        }
      })
      setUserURLs(webshops);
      setWordPressUrls(platforms.wordpress);
      setMagentoUrls(platforms.magento);
      setShopifyUrls(platforms.shopify);
      setNoPlateformUrls(platforms.noPlatform);
      setLoading(false);
    }
    async function setAdminPlatformUrls(webshops){
      const platforms = {
        wordpress: [],
        magento: [],
        shopify: [],
        noPlatform: [],
        wordpressDeleted : [],
        magentoDeleted : [],
        shopifyDeleted : [],
        noPlatformDeleted : []
      
      }
      const deletedWebshops = webshops.filter((webshop) => webshop.deletedAt != null)

      webshops.forEach((webshop) => {
        if (webshop.platform !== null)
        {
          if (webshop.deletedAt != null)
          {
            webshop.platform = webshop.platform?.toLowerCase() || 'no platform';
            if (platforms[webshop.platform + 'Deleted'] != undefined) {
              platforms[webshop.platform + 'Deleted'].push(webshop);
            }
          }
          else
          {
            webshop.platform = webshop.platform?.toLowerCase() || 'no platform';
            if (platforms[webshop.platform] != undefined) {
              platforms[webshop.platform].push(webshop);
            }
          }
        }
      })

      setAdminUrls(webshops)
      setAdminWordPressUrls(platforms.wordpress)
      setAdminMagentoUrls(platforms.magento)
      setAdminShopifyUrls(platforms.shopify)
      setAdminNoPlatformUrls(platforms.noPlatform)
      
      setAdminDeletedUrls(deletedWebshops)
      setDeletedAdminMagentoUrls(platforms.magentoDeleted)
      setDeletedAdminWordPressUrls(platforms.wordpressDeleted)
      setDeletedAdminShopifyUrls(platforms.shopifyDeleted)
      setDeletedAdminNoPlatformUrls(platforms.noPlatformDeleted)

      setLoading(false)
    }
    async function getURLs() {
      const response = await ApiService.get(`${AppSettings.API_URL}/Webshop/GetWebshopURLs`);
      const webShops = response.data.filter(w => w.platform != null && w.platform.toLowerCase() != 'api')
    
      if (webShops.length === 0)
        {
          setUserURLs(webShops);
          setLoading(false);
        }
      
      else
      {

        setPlatformUrls(webShops)

      }
    
    }

    async function adminGetURLs() {
      const response = await ApiService.get(`${AppSettings.API_URL}/Webshop/GetWebshopURLsAdmin`);
      const webShops = response.data;
    
      if (webShops.length === 0)
      {
        setAdminUrls(webShops);
        setLoading(false);
      }
      else
        setAdminPlatformUrls(webShops)
    }
    async function Init(){
      const locale = navigator.language.substring(0,2);
      setTranslation(t[locale] != undefined ? t[locale].Content["Webshop"] : t["en"].Content["Webshop"])
    } 
    
    async function CheckImpersionation(){

      const AuthenticationService = require('../../services/AuthenticationService').default
      await AuthenticationService.impersonated().then(u => {
       const adminUser = parseJwt(u.access_token)
       if (adminUser.role === "Administrator"){
          setIsAdmin(true)
          adminGetURLs()
       }
      })
    }
    useEffect(() => {
      getURLs()  
      Init() 
      CheckImpersionation()
      initTemplatesSettings()
      initTemplates()
      
      // Initialize Bootstrap collapse
      const { Collapse } = require('bootstrap');
      const collapseElements = document.querySelectorAll('.accordion-collapse');
      collapseElements.forEach(element => {
        new Collapse(element, {
          toggle: false
        });
      });
      
    }, [])// eslint-disable-line react-hooks/exhaustive-deps
    useEffect(() => {}, [adminUrls,userURLs])
    function handleAddMore (e){
       setUserURLs([...userURLs, {"id": userURLs.length+1, "urlId": "","domain": "", "companyId": ""}])
       setIsAdding(true)
    }
      
    function handleTextChange (e) {
      if(e.target.value != null)
      {
        setNewUrl(e.target.value)
      }
    }

    const handleUrlVerify = (e) => {
      
      e.preventDefault();
      const newList = userURLs.map((item) => {
        if (item.id == e.target.id)
        {
          item.domain = newUrl
          const updatedItem = {
            ...item, domain: newUrl
          }
          return updatedItem
        }
        return item;
      })
      setUserURLs(newList)
      
      const formData = new FormData()
      formData.append('VerificationUrl', newUrl)
      formData.append('Verify', true)


      axios({
        method: 'POST',
        url: `${AppSettings.API_URL}/Webshop/AddWebshopUrl`,
        data: formData,
        headers: {"Content-Type": "application/json"}
      })
        .then(res=>{
          setIsAdding(false)
      })
    }

    const handleSelectedUrl = (e) => {
      setSelectedUrl(e.target.id)
      setSelectedDomain(e.target.dataset.domain)
      
      // const { Modal } = require("bootstrap");
      // const deleteModal = new Modal("#deleteWebshop");
      // deleteModal.show();
    }
    const handleDelete = async () => {
      
       const formData = new FormData()
       formData.append('UrlId', selectedUrl)
       
      const checkUrls = async () => {
        var urlElement = document.getElementById('parent_' + selectedUrl)
          if (urlElement)
            urlElement.remove()
          
          var templateElement = document.getElementById('parent_templates_' + selectedUrl)
          if (templateElement)
            templateElement.remove()


          await new Promise(resolve => setTimeout(resolve, 0));

          var magentoContainer = document.getElementsByClassName('magento')[0]
          var shopifyContainer = document.getElementsByClassName('shopify')[0]
          var woocommerceContainer = document.getElementsByClassName('woocommerce')[0]

          const removeContainerAndHeader = async (container, headerClass) => {
            if (container && !container.hasChildNodes()) {
              container.remove()
              const header = document.getElementsByClassName(headerClass)[0]
              if (header) {
                header.remove()
              }
              // Wait for DOM update after removal
              await new Promise(resolve => setTimeout(resolve, 0));
            }
          }
          
          
          await removeContainerAndHeader(magentoContainer, 'magento-header')
          await removeContainerAndHeader(shopifyContainer, 'shopify-header')
          await removeContainerAndHeader(woocommerceContainer, 'woocommerce-header')
          
          if (!magentoContainer && 
              !shopifyContainer && 
              !woocommerceContainer) {
              setUserURLs(null)
          }
          magentoContainer = document.getElementsByClassName('magento')[0]
          shopifyContainer = document.getElementsByClassName('shopify')[0]
          woocommerceContainer = document.getElementsByClassName('woocommerce')[0]

          if (!magentoContainer && !shopifyContainer && !woocommerceContainer) {
            router.reload()
          }

          adminGetURLs()
      }

       await ApiService.postWithFormData(`${AppSettings.API_URL}/Webshop/DeleteWebshopUrl`, formData).then(res => {
        checkUrls()
          
          
       })
    }
    const handleDeleteAdmin = async () => {
      
      const formData = new FormData()
      formData.append('Domain', selectedDomain)
      await ApiService.postWithFormDataAdmin(`${AppSettings.API_URL}/Webshop/DeregisterWebshop`, formData).then(res => {
          
          var urlElement = document.getElementById('parent_' + selectedUrl)
          urlElement.remove()

          var magentoContainer = document.getElementsByClassName('admin-magento')[0]
          var shopifyContainer = document.getElementsByClassName('admin-shopify')[0]
          var woocommerceContainer = document.getElementsByClassName('admin-woocommerce')[0]
          if (magentoContainer && !magentoContainer.hasChildNodes())
          {
            magentoContainer.remove()
            var magentoHeader = document.getElementsByClassName('admin-magento-header')[0]
            if (magentoHeader)
            {
              magentoHeader.remove()
            }
          }
          if (shopifyContainer && !shopifyContainer.hasChildNodes())
          {
            shopifyContainer.remove()
            var shopifyHeader = document.getElementsByClassName('admin-shopify-header')[0]
            if (shopifyHeader)
            {
              shopifyHeader.remove()
            }
          }
          if (woocommerceContainer && !woocommerceContainer.hasChildNodes())
          {
            woocommerceContainer.remove()
            var woocommerceHeader = document.getElementsByClassName('admin-woocommerce-header')[0]
            if (woocommerceHeader)
            {
              woocommerceHeader.remove()
            }
          }


          
      })
    }

    const handleTemplateChange = async (webshopid, type, name) => {
      try
      {
        const templates = [...webshopTemplatesOptions];
        var foundTemplate = templates.find(t => t.templateType === type);
        // debugger;
        // var templateId = foundTemplate.templates.find(t => t.name === name).id;
        const body = {
          UrlId: webshopid,
          ContentType: type,
          TemplateIds: name.join(',')
        }
        await ApiService.post(`/TemplateSettings/set`, body).then(res => {
          //console.log(res);
        })

      }
      catch{
        const body = {
          UrlId: webshopid,
          ContentType: type,
          TemplateId: "00000000-0000-0000-0000-000000000000"
        }
        await ApiService.post(`/TemplateSettings/set`, body).then(res => {
          //console.log(res);
        })
      }
    }
    const initTemplatesSettings = async () => {
      const templates = await ApiService.get('/TemplateSettings');
      setWebshopTemplates(templates.data)
    }
    
    const initTemplates = async () => {
      const templates = await ApiService.get('/Templates/company/templates');
      setWebshopTemplatesOptions(templates.data)
    }

    const expandCollapseAll = () => {
      const newState = !isAnyExpanded;
      const blocks = {
        'platform-magento': newState,
        'platform-shopify': newState,
        'platform-woocommerce': newState
      };
      setCollapsedBlocks(blocks);
      setIsAnyExpanded(newState);
    }
    
    const handleToggleCollapse = (blockId) => {
      const updatedCollapsedBlocks = { ...collapsedBlocks };
      updatedCollapsedBlocks[blockId] = !updatedCollapsedBlocks[blockId];
      setCollapsedBlocks(updatedCollapsedBlocks);

      const allValues = Object.values(updatedCollapsedBlocks);
      const allTrue = allValues.every(value => value === true);
      const allFalse = allValues.every(value => value === false);
      
      if (allTrue) {
        setIsAnyExpanded(true);
      } else if (allFalse) {
        setIsAnyExpanded(false);
      }
    };

    if (userData && userURLs !== null && webshopTemplatesOptions !== null && webshopTemplates !== null)
    return (
        
        <>
            <Body>
                <Content>
                  <Modal target="deleteWebshop" type="delete" click={handleDelete}/>
                  <Modal target="deregisterWebshop" type="deregister" click={handleDeleteAdmin}/>
                  <div >
                    
                  <div className="header">
                      <p className='mb-15'>Linked webshops</p>
                      {userURLs.length > 0 &&
                      <p className='installation-info mb-30'> Here is where you can see all webshops connected to your account. For each webshop, you can assign specific templates to different content types — including meta titles, product descriptions, product short descriptions, and category descriptions. These templates will be used when generating content automatically for the respective webshop. If no template is selected, the default text generation settings will be used.</p>
                      }
                  </div>
                  {isAdmin &&
                  <>
                  <ul className="nav nav-tabs mb-14" id="myTab" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button className="nav-link active" id="active-tab" data-bs-toggle="tab" data-bs-target="#active" type="button" role="tab" aria-controls="active" aria-selected="true">Active webshops</button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button className="nav-link" id="deleted-tab" data-bs-toggle="tab" data-bs-target="#deleted" type="button" role="tab" aria-controls="deleted" aria-selected="false">Deleted within 30 days</button>
                    </li>
                  </ul>
                  <div className="tab-content" id="myTabContent">
                    <div className="tab-pane fade show active" id="active" role="tabpanel" aria-labelledby="active-tab">
                    {loading ? <div className='d-flex'><Image src="https://writetextaistorage.z6.web.core.windows.net/ic_loader_writetext_backend.gif" width={100} height={100} alt="loader" className='mx-auto'></Image></div> : null}
                    {userURLs.length > 0 ?
                    <>
                    {/* <div className="d-flex justify-content-end" style={{marginBottom: '15px', marginTop: '15px'}}>
                      <button 
                        className={styles.collapseExpandLinkBtn}
                        onClick={expandCollapseAll}
                      >
                        {isAnyExpanded ? 'Collapse all' : 'Expand all'}
                      </button>
                    </div> */}
                    
                    <div className="accordion" id="collapsibleList">
                    {magentoUrls.length > 0 && 
                      <div id="platform-magento" className='mb-36 magento-header'>
                        <div className={`accordion-item ${styles.templatesRow}`}>
                          <h2 className="accordion-header" style={{borderBottom: 'none'}}>
                            <button
                              className={`accordion-button ${styles.accordionButtonWebshopPlatforms} ${collapsedBlocks['platform-magento'] ? 'collapsed' : ''}`}
                              type="button"
                              onClick={() => handleToggleCollapse('platform-magento')}
                            >
                              <div className={`${styles.templatesRowTitle}`}>Magento</div>
                            </button>
                          </h2>
                          <div className={`accordion-collapse collapse${collapsedBlocks['platform-magento'] ? '' : ' show'}`}>
                            <div className="accordion-body" style={{backgroundColor: '#F6F6F6', marginBottom: '14px', padding: '20px'}}>
                              <div className='magento webshop-container'>
                                <Webshops platform={"Magento"} webshops={magentoUrls} verify={handleUrlVerify} ondelete={handleSelectedUrl} onchange={handleTextChange} isadmin={isAdmin} onTemplateChange={handleTemplateChange} templates={webshopTemplatesOptions} selectedTemplate={webshopTemplates}/> 
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      }
                      {shopifyUrls.length > 0 &&
                      <div id="platform-shopify" className='mb-36 shopify-header'>
                        <div className={`accordion-item ${styles.templatesRow}`}>
                          <h2 className="accordion-header" style={{borderBottom: 'none'}}>
                            <button
                              className={`accordion-button ${styles.accordionButtonWebshopPlatforms} ${collapsedBlocks['platform-shopify'] ? 'collapsed' : ''}`}
                              type="button"
                              onClick={() => handleToggleCollapse('platform-shopify')}
                            >
                              <div className={`${styles.templatesRowTitle}`}>Shopify</div>
                            </button>
                          </h2>
                          <div className={`accordion-collapse collapse${collapsedBlocks['platform-shopify'] ? '' : ' show'}`}>
                            <div className="accordion-body" style={{backgroundColor: '#F6F6F6', marginBottom: '14px', padding: '20px'}}>
                              <div className='shopify webshop-container'>
                                <Webshops platform={"Shopify"} webshops={shopifyUrls} verify={handleUrlVerify} ondelete={handleSelectedUrl} onchange={handleTextChange} isadmin={isAdmin} onTemplateChange={handleTemplateChange} templates={webshopTemplatesOptions} selectedTemplate={webshopTemplates}/> 
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      }
                    {wordPressUrls.length > 0 && 
                      <div id="platform-woocommerce" className='woocommerce-header'>
                        <div className={`accordion-item ${styles.templatesRow}`}>
                          <h2 className="accordion-header" style={{borderBottom: 'none'}}>
                            <button
                              className={`accordion-button ${styles.accordionButtonWebshopPlatforms} ${collapsedBlocks['platform-woocommerce'] ? 'collapsed' : ''}`}
                              type="button"
                              onClick={() => handleToggleCollapse('platform-woocommerce')}
                            >
                              <div className={`${styles.templatesRowTitle}`}>WooCommerce</div>
                            </button>
                          </h2>
                          <div className={`accordion-collapse collapse${collapsedBlocks['platform-woocommerce'] ? '' : ' show'}`}>
                            <div className="accordion-body" style={{backgroundColor: '#F6F6F6', marginBottom: '14px', padding: '20px'}}>
                              <div className='woocommerce webshop-container'>
                                <Webshops platform={"WooCommerce"} webshops={wordPressUrls} verify={handleUrlVerify} ondelete={handleSelectedUrl} onchange={handleTextChange} isadmin={isAdmin} onTemplateChange={handleTemplateChange} templates={webshopTemplatesOptions} selectedTemplate={webshopTemplates}/> 
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      }
                    </div>
                    </>
                    :
                    <>
                      <div className='empty-webshop'></div>
                      <p className='empty-webshop-text'>In order to link your webshops here, download and install the corresponding add-on for your ecommerce platform. Upon successful installation, an interactive wizard will facilitate the process of linking your webshop to your account. You can download the WriteText.ai add-ons for WooCommerce, Magento, and Shopify in the Downloads tab.</p> 
                      
                      <div className='d-flex'>
                            <input type="button" className="btn btn-primary center plugin" value="Go to Downloads" onClick={() => router.push("/downloads")}/>
                      </div>
                    </>
                    }
                    </div>
                    <div className="tab-pane fade" id="deleted" role="tabpanel" aria-labelledby="deleted-tab">
                    {loading ? <div className='d-flex'><Image src="https://writetextaistorage.z6.web.core.windows.net/ic_loader_writetext_backend.gif" width={100} height={100} alt="loader" className='mx-auto'></Image></div> : null}
                    {adminDeletedUrls && adminDeletedUrls.length > 0 &&
                    <>
                    {adminDeletedMagentoUrls.length > 0 && 
                      <div id="platform-magento" className='mb-36 admin-magento-header'>
                        <div>
                            <p className='font-16 mb-14 sub-p'>Magento</p>
                        </div>

                        <div className='admin-magento webshop-container' style={{padding: '20px'}}>
                          <Webshops platform={"Magento"} webshops={adminDeletedMagentoUrls} verify={handleUrlVerify} ondelete={handleSelectedUrl} onchange={handleTextChange} isadmin={isAdmin} onTemplateChange={handleTemplateChange} templates={webshopTemplatesOptions} selectedTemplate={webshopTemplates}/> 
                        </div>
                      </div>
                      }
                      {adminDeletedShopifyUrls.length > 0 &&
                      <div id="platform-shopify" className='mb-36 admin-shopify-header'>
                        <div>
                            <p className='font-16 mb-14 sub-p'>Shopify</p>
                        </div>

                        <div className='admin-shopify webshop-container' style={{padding: '20px'}}>
                          <Webshops platform={"Shopify"} webshops={adminDeletedShopifyUrls} verify={handleUrlVerify} ondelete={handleSelectedUrl} onchange={handleTextChange} isadmin={isAdmin} onTemplateChange={handleTemplateChange} templates={webshopTemplatesOptions} selectedTemplate={webshopTemplates}/> 
                        </div>
                      </div>
                      }
                    {adminDeletedWordPressUrls.length > 0 && 
                      <div id="platform-woocommerce">
                        <div className='admin-woocommerce-header'>
                            <p className='font-16 mb-14 sub-p'>WooCommerce</p>
                        </div>

                        <div className='admin-woocommerce webshop-container' style={{padding: '20px'}}>
                          <Webshops platform={"WooCommerce"} webshops={adminDeletedWordPressUrls} verify={handleUrlVerify} ondelete={handleSelectedUrl} onchange={handleTextChange} isadmin={isAdmin} onTemplateChange={handleTemplateChange} templates={webshopTemplatesOptions} selectedTemplate={webshopTemplates}/> 
                        </div>
                      </div>
                      }
                      
                    </>
                    }
                    </div>
                  </div>
                  </>
                  
                  }
                  {!isAdmin &&
                  <>
                  {loading ? <div className='d-flex'><Image src="https://writetextaistorage.z6.web.core.windows.net/ic_loader_writetext_backend.gif" width={100} height={100} alt="loader" className='mx-auto'></Image></div> : null}
                    {userURLs.length > 0 ?
                    <>
                    {/* <div className="d-flex justify-content-end" style={{marginBottom: '15px', marginTop: '15px'}}>
                      <button 
                        className={styles.collapseExpandLinkBtn}
                        onClick={expandCollapseAll}
                      >
                        {isAnyExpanded ? 'Collapse all' : 'Expand all'}
                      </button>
                    </div> */}
                    
                    <div className="accordion" id="collapsibleList">
                    {magentoUrls.length > 0 && 
                      <div id="platform-magento" className='mb-36 magento-header'>
                        <div className={`accordion-item ${styles.templatesRow}`}>
                          <h2 className="accordion-header" style={{borderBottom: 'none'}}>
                            <button
                              className={`accordion-button ${styles.accordionButtonWebshopPlatforms} ${collapsedBlocks['platform-magento'] ? 'collapsed' : ''}`}
                              type="button"
                              onClick={() => handleToggleCollapse('platform-magento')}
                            >
                              <div className={`${styles.templatesRowTitle}`}>Magento</div>
                            </button>
                          </h2>
                          <div className={`accordion-collapse collapse${collapsedBlocks['platform-magento'] ? '' : ' show'}`}>
                            <div className="accordion-body" style={{backgroundColor: '#F6F6F6', marginBottom: '14px', padding: '20px'}}>
                              <div className='magento webshop-container'>
                                <Webshops platform={"Magento"} webshops={magentoUrls} verify={handleUrlVerify} ondelete={handleSelectedUrl} onchange={handleTextChange} isadmin={isAdmin} onTemplateChange={handleTemplateChange} templates={webshopTemplatesOptions} selectedTemplate={webshopTemplates}/> 
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      }
                      {shopifyUrls.length > 0 &&
                      <div id="platform-shopify" className='mb-36 shopify-header'>
                        <div className={`accordion-item ${styles.templatesRow}`}>
                          <h2 className="accordion-header" style={{borderBottom: 'none'}}>
                            <button
                              className={`accordion-button ${styles.accordionButtonWebshopPlatforms} ${collapsedBlocks['platform-shopify'] ? 'collapsed' : ''}`}
                              type="button"
                              onClick={() => handleToggleCollapse('platform-shopify')}
                            >
                              <div className={`${styles.templatesRowTitle}`}>Shopify</div>
                            </button>
                          </h2>
                          <div className={`accordion-collapse collapse${collapsedBlocks['platform-shopify'] ? '' : ' show'}`}>
                            <div className="accordion-body" style={{backgroundColor: '#F6F6F6', marginBottom: '14px', padding: '20px'}}>
                              <div className='shopify webshop-container'>
                                <Webshops platform={"Shopify"} webshops={shopifyUrls} verify={handleUrlVerify} ondelete={handleSelectedUrl} onchange={handleTextChange} isadmin={isAdmin} onTemplateChange={handleTemplateChange} templates={webshopTemplatesOptions} selectedTemplate={webshopTemplates}/> 
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      }
                    {wordPressUrls.length > 0 && 
                      <div id="platform-woocommerce" className='woocommerce-header'>
                        <div className={`accordion-item ${styles.templatesRow}`}>
                          <h2 className="accordion-header" style={{borderBottom: 'none'}}>
                            <button
                              className={`accordion-button ${styles.accordionButtonWebshopPlatforms} ${collapsedBlocks['platform-woocommerce'] ? 'collapsed' : ''}`}
                              type="button"
                              onClick={() => handleToggleCollapse('platform-woocommerce')}
                            >
                              <div className={`${styles.templatesRowTitle}`}>WooCommerce</div>
                            </button>
                          </h2>
                          <div className={`accordion-collapse collapse${collapsedBlocks['platform-woocommerce'] ? '' : ' show'}`}>
                            <div className="accordion-body" style={{backgroundColor: '#F6F6F6', marginBottom: '14px', padding: '20px'}}>
                              <div className='woocommerce webshop-container'>
                                <Webshops platform={"WooCommerce"} webshops={wordPressUrls} verify={handleUrlVerify} ondelete={handleSelectedUrl} onchange={handleTextChange} isadmin={isAdmin} onTemplateChange={handleTemplateChange} templates={webshopTemplatesOptions} selectedTemplate={webshopTemplates}/> 
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      }
                    </div>
                    </>
                    :
                    <>
                      <div className='empty-webshop'></div>
                      <p className='empty-webshop-text'>In order to link your webshops here, download and install the corresponding add-on for your ecommerce platform. Upon successful installation, an interactive wizard will facilitate the process of linking your webshop to your account. You can download the WriteText.ai add-ons for WooCommerce, Magento, and Shopify in the Downloads tab.</p> 
                      
                      <div className='d-flex'>
                            <input type="button" className="btn btn-primary center plugin" value="Go to Downloads" onClick={() => router.push("/downloads")}/>
                      </div>
                    </>
                    }
                    </> }
                  
                   
                  </div>
               
            </Content>
            </Body>
        </>
      )
    }
    
  

