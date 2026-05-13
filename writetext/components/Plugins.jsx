import React from 'react'
import Image from 'next/image'
import axios from 'axios'
import { setAuthHeader } from '../utils/axiosHeader'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router' 
import InstallationServiceComponent from '../components/InstallationService'
import Link from 'next/link'
import apiService from '../services/ApiService'

import { GateWayTypeEnum, MemberTypeEnum, SubscriptionStatusEnum, SubscriptionTypeEnum } from '../enum/MemberType'
export default function Plugins({translation, onRender, userData, classList, showProTip}) {
    const router = useRouter()
    const currentRoute = router.route.toLowerCase()
    const [access_token, setAccessToken] = useState(null)
    const [addOns, setAddOns] = useState([])
    const [wooCommerceLink, setWooCommerceLink] = useState('')
    const [magentoLink, setMagentoLink] = useState('')
    const [shopifyLink, setShopifyLink] = useState('')

    const [wooCommerLinkInstalled, setWooCommerLinkInstalled] = useState(false)
    const [magentoLinkInstalled, setMagentoLinkInstalled] = useState(false)
    const [shopifyLinkInstalled, setShopifyLinkInstalled] = useState(false)

    const [selectedWooCommerce, setSelectedWooCommerce] = useState(false)
    const [selectedMagento, setSelectedMagento] = useState(false)
    const [selectedShopify, setSelectedShopify] = useState(false)
    const [selectAPI, setSelectAPI] = useState(false)

    const [fromDownload, setFromDownload] = useState(false)
    

    const AppSettings = require('../settings/AppSetting').default
    const https = require("https");
    const httpsAgent = new https.Agent({ rejectUnauthorized: false })
    useEffect(() => {
  
        async function getUser() {
          
            const AuthenticationService = require('../services/AuthenticationService').default
            await AuthenticationService.getUser().then(u => {
                if (u != null)
                {
                    setAccessToken(u.access_token)
                }
            })
        } 
        if(!router.isReady) return;
      
        getUser()
      },[router.isReady])

    useEffect(() => {
        let webshopCount = 0;
        async function getAddOns() {
            const plugins = await apiService.get(`${AppSettings.API_URL}/plugins`);
            setAddOns(plugins.data)
            if (plugins.data.filter(r=>r.platform.toLowerCase() === 'wordpress').length > 0)
                setWooCommerceLink(plugins.data.filter(r=>r.platform.toLowerCase() === 'wordpress')[0].downloadUrl)
            if (plugins.data.filter(r=>r.platform.toLowerCase() === 'magento').length > 0)
                setMagentoLink(plugins.data.filter(r=>r.platform.toLowerCase() === 'magento')[0].downloadUrl)
            if (plugins.data.filter(r=>r.platform.toLowerCase() === 'shopify').length > 0)
                setShopifyLink(plugins.data.filter(r=>r.platform.toLowerCase() === 'shopify')[0].downloadUrl)

            const siteUrl = new URL(window.location.href)
            if (plugins.data.filter(r=>r.platform.toLowerCase() === 'wordpress').length > 0) {
                const wooCommerceUrl = new URL(plugins.data.filter(r=>r.platform.toLowerCase() === 'wordpress')[0].downloadUrl)
                if (wooCommerceUrl.hostname !== siteUrl.hostname)
                    setWooCommerLinkInstalled(true)
            }

            if (plugins.data.filter(r=>r.platform.toLowerCase() === 'magento').length > 0) {
                const magentoUrl = new URL(plugins.data.filter(r=>r.platform.toLowerCase() === 'magento')[0].downloadUrl)
                if (magentoUrl.hostname !== siteUrl.hostname)
                    setMagentoLinkInstalled(true)
            }

            if (plugins.data.filter(r=>r.platform.toLowerCase() === 'shopify').length > 0) {
                const shopifyUrl = new URL(plugins.data.filter(r=>r.platform.toLowerCase() === 'shopify')[0].downloadUrl)
                if (shopifyUrl.hostname !== siteUrl.hostname)
                    setShopifyLinkInstalled(true)
            }
           
        }
        async function getURLs(){
            const webshops = await apiService.get(`${AppSettings.API_URL}/Webshop/GetWebshopURLs?includeDeleted=true`);
            webshopCount = webshops.data.length
            
        }
        getAddOns();
        getURLs();

        if (currentRoute === '/welcome')
        {
            const intervalId = setInterval(async () => {
                await axios.get(`${AppSettings.API_URL}/Webshop/GetWebshopURLs?includeDeleted=true`,{ httpsAgent }).then(u=> {
                    
                    if (u.data.length != webshopCount){
                        window.location.href = "/"
                    }
                })
            }, 5000);

            return () => clearInterval(intervalId); // Cleanup on unmount
        }

        async function getUserPlatform(){
            const company = userData.account.company;
            const platform = company.platform;
            if (platform === 'WooCommerce'){
                setSelectedWooCommerce(true);
            }
            else if (platform === 'Magento'){
                setSelectedMagento(true);
            }
            else if (platform === 'Shopify'){
                setSelectedShopify(true);
            }
        }
        if (document.referrer !== '' && !isRouted()){
            getUserPlatform();
        }
    },[])

    function showInstallation(){
        var element = document.getElementById("installation-child");
        element.classList.toggle("show");

        element = document.getElementById("installation-toggle");
        element.classList.toggle("toggled");
        
        // setTimeout(() => {
        //     // const scroll = new SmoothScroll('a[href*="#"]', {
        //     //     speed: 300,
        //     //     speedAsDuration: true
        //     // });
        //     const scroll = new SmoothScroll();
        //     const pageBody = document.getElementsByClassName('page-body')[0]; // Target the first element with 'page-body' class
        //     scroll.animateScroll(pageBody.scrollHeight, pageBody);
        // //document.getElementsByClassName("page-body")[0].scrollTop = 510
        // },300)
    }
    function expandWooCommerce(event){
        setFromDownload(true);
        if (event.target.tagName == "A") return;
        if (selectedWooCommerce)
        {
            showProTip(true);
            setSelectedWooCommerce(false);
        }
        else
        {
            showProTip(false);
            setSelectedWooCommerce(true);
            setSelectedShopify(false);
            setSelectedMagento(false);
        }
    }
    function expandMagento(event){
        setFromDownload(true);

        if (event.target.tagName == "A") return;
        if (selectedMagento)
        {
            showProTip(true);
            setSelectedMagento(false);
        }
        else
        {
            showProTip(false);
            setSelectedWooCommerce(false);
            setSelectedShopify(false);
            setSelectedMagento(true);
        }
    }
    function expandShopify(){
        setFromDownload(true);
        if (shopifyLink === '') return;
        if (selectedShopify)
        {
            showProTip(true);
            setSelectedShopify(false);
        }
        else
        {
            showProTip(false);
            setSelectedWooCommerce(false);
            setSelectedShopify(true);
            setSelectedMagento(false);
        }
    
    }
    function expandAPI(){
        if (selectAPI)
        {
            setSelectAPI(false);
        }
        else
        {
            setSelectAPI(true);
        }
    }
    function backDownload(){
        showProTip(true);
        setSelectedWooCommerce(false);
        setSelectedShopify(false);
        setSelectedMagento(false);
    }
    function handleDownloadClick(e){
        e.stopPropagation(); // Prevent the parent div's click event
        if (selectedWooCommerce)
            downloadFile(wooCommerceLink);
        if (selectedShopify)
            downloadFile(shopifyLink);
        if (selectedMagento)
            downloadFile(magentoLink);
    }
    async function downloadFile( url){
        if (url.includes('https://'))
        {
            window.open(url);
        }
        else
        {
        const slugs = url.split('/')
        const fileUrl = `${AppSettings.API_URL}/downloads/${slugs[4]}/${slugs[5]}`;
        const fileName = `${slugs[5]}`;
        const headers = new Headers();
        headers.append('Authorization', `Bearer ${access_token}`);
        
        const response = await fetch(fileUrl, {
          method: 'GET',
          headers: headers});
        const contentLength = response.headers.get('Content-Length');
        const totalLength = typeof contentLength === 'string' && parseInt(contentLength);
  
        const reader = response.body.getReader(); 
        const chunks = [];
  
        let receivedLength = 0;
        while(true) {
          const {done, value} = await reader.read();
          if (done){
            break
          }
          chunks.push(value);
          receivedLength += value.length;
        //   if (typeof totalLength === 'number')
        //   {
        //     const step = (receivedLength / totalLength).toFixed(2) * 100 
        //     setProgress(step)
        //   }
        }
        const blob = new Blob(chunks);
        const link = document.createElement('a');
        link.download = fileName;
        link.href = window.URL.createObjectURL(blob);
        document.body.appendChild(link);
        function handleOnDownload() {
          setTimeout(() => {
            URL.revokeObjectURL(link.href);
            link.removeEventListener('click', handleOnDownload);
          }, 150);
        }
        link.addEventListener('click', handleOnDownload,false);
        link.click();
        document.body.removeChild(link);
              
  
        }
        
    }
    const hasReferrer = () => {
        return document.referrer !== '';
    }
    const isRouted = () => {
        //catch if isRouted does not exist
        if (sessionStorage.getItem('isRouted') === null){
            return false;
        }
        return sessionStorage.getItem('isRouted') === 'true';
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

    if (addOns.length > 0 && userData)
  return (
    <div className={`container plugin-page ${classList}`}>
        {isFreeTrial() && isFreeTrialEnded() ?
            <div className={`header-tos free-trial-banner`}>
                <div>
                  <p className="banner-title">Your free trial has ended.</p>
                  <p className="banner-text mb-0" style={{maxWidth: "unset"}}>To continue using WriteText.ai, purchase a credit bundle under Starter for text generation features or subscribe to the Pro plan to unlock SEO and automation tools.</p>
                </div>
                <div className='ms-auto mt-auto'>
                  <button className="btn btn-primary" onClick={() => router.push('/premium')} style={{width: '190px'}}>Go to Plans & Credits</button>
                </div>
            </div>
        :
        <>
        
    <Image className='ad-image' src='https://1902internalsystems.z23.web.core.windows.net/WriteText_ad-990x100.svg?v=1' 
  unoptimized alt='WriteText' width={990} height={100} onClick={()=>window.open('https://writetext.ai/features/keyword-analysis', '_blank')}></Image>
        </>
        }
    
        <div className="header">
            {currentRoute === '/wizard'
            ? 
            <>
                <p className='mb-14'>{translation["WizardHeaderText"]}</p> <p>{translation["WizardSubHeaderText"]}</p>
            </>
            : 
            currentRoute === '/welcome' || currentRoute == "/downloads"
            ?

                !selectedWooCommerce && !selectedMagento && !selectedShopify ? 
                <>
                    <p className='mb-14 font-24'>{translation["PageHeaderText"]}</p> 
                    
                </>
                :
                <>
                    {/* <p className='back-btn mb-14' onClick={backDownload}></p>
                    <p className='mb-14 font-24'>Download</p>  */}
                    <p className='mb-14 font-24 d-flex mr-14 download' style={{height: '36px'}}><p className='back-btn' onClick={backDownload}></p>{fromDownload ? 'Back to platforms list' : hasReferrer() && !isRouted() ? 'Start with another platform' : 'Back to platforms list'}</p>
                </>
                
            :
            <p>{translation["PageHeaderText"]}</p>
            }
            
        </div>
        <div>
            {currentRoute == "/welcome" || currentRoute == "/downloads" ?
            <>
            
            <div className='d-flex '>
                <div className='mr-20 welcome-plugins'>
                    {selectedWooCommerce && 
                    <div className={`mb-20 plugin woocommerce center ${selectedWooCommerce ? 'expanded' :''}`} onClick={!selectedWooCommerce ? expandWooCommerce : null}>
                        <div className='d-flex mb-30'>
                            <div className=''>
                                <p><Image src="/images/woo 1.svg" height={40} width={40} alt='WooCommerce' priority ></Image>WooCommerce</p>
                            </div>
                            <div className={`pull-right plugin-installation ${selectedWooCommerce ? 'visible' :'hidden'}`}>
                                <button className='btn btn-primary download-btn font-14'onClick={handleDownloadClick} disabled={wooCommerceLink === ''}>{wooCommerceLink !== '' ? 'Download plugin' : 'Coming soon'} {wooCommerceLink !== '' && <Image src="/images/ic_download.svg" height={16} width={16} alt='download'></Image>}</button>
                                {/* <Link className={`btn btn-primary download-btn font-14 ${wooCommerceLink === '' && 'coming-soon'}`} href={wooCommerceLink} target={wooCommerLinkInstalled ? '_blank' : ''} download><span>{wooCommerceLink !== '' ? 'Download plugin' : 'Coming soon'} {wooCommerceLink !== '' && <Image src="/images/ic_download.svg" height={16} width={16} alt='download'></Image>}</span></Link> */}
                            </div>
                        </div>
                        <div className={`plugin-installation ${selectedWooCommerce ? 'visible' :'hidden'}`}>
                            <div className='how-to-install'>
                                How to install
                            </div>
                            <div className='how-to-install-text'>
                                <ol>
                                    <li>Download plugin from <Link href={'https://wordpress.org/plugins/writetext-ai/'} target='_blank'>https://wordpress.org/plugins/writetext-ai/</Link> or click the &quot;Download plugin&quot; button above.</li>
                                    <li>Log in to your WordPress backend.</li>
                                    <li>Click “Upload Plugin” beside Add Plugins.</li>
                                    <li>Upload the .zip file and click “Install Now”.</li>
                                    <li>Once the installation is complete, click “Activate Plugin”.</li>
                                    <li>For WordPress version 6.5.2, go to WriteText.ai in the left sidebar to start the installation wizard. For versions below 6.5.2, You&rsquo;ll be redirected to the WriteText.ai setup guide. Follow the wizard instructions to complete the setup.</li>
                                </ol>
                                <Link href={"https://writetext.ai/how-to-install-woocommerce#multisite"} target='_blank'>How to install WriteText.ai in a WordPress multisite</Link>
                                
                            </div>
                        </div>
                    </div>
                    }
                    {selectedMagento && 
                    <div className={`mb-20 plugin magento center  ${selectedMagento ? 'expanded' :''}`} onClick={!selectedMagento ? expandMagento : null}>
                        <div className='d-flex mb-30'>
                            <div className=''>
                                <p><Image src="/images/magento 1.svg" height={40} width={40} alt='Magento' priority ></Image>Magento</p>
                            </div>
                            <div className={`pull-right plugin-installation ${selectedMagento ? 'visible' :'hidden'}`}>
                            <button className='btn btn-primary download-btn font-14' onClick={handleDownloadClick} disabled={magentoLink === ''}>{magentoLink !== '' ? 'Download extension' : 'Coming soon'} {magentoLink !== '' && <Image src="/images/ic_download.svg" height={16} width={16} alt='download'></Image>}</button>
                                {/* <Link className={`btn btn-primary download-btn font-14 ${magentoLink === '' && 'coming-soon'}`} href={magentoLink} target={magentoLinkInstalled ? '_blank' : ''} download><span>{magentoLink !== '' ? 'Download plugin' : 'Coming soon'} {magentoLink !== '' && <Image src="/images/ic_download.svg" height={16} width={16} alt='download'></Image>}</span></Link> */}
                            </div>
                        </div>
                        
                        <div className={`plugin-installation ${selectedMagento ? 'visible' :'hidden'}`}>
                            <div className='how-to-install'>
                                How to install
                            </div>
                            <div className='how-to-install-text'>
                                <ol>
                                    <li>Download the extension as a compressed file (.zip format).</li>
                                    <li>In the command line interface, navigate to the <b>app/code/WriteTextAI</b> directory, then unzip the file by running the command: <b>unzip WriteTextAI.zip</b></li>
                                    <li>After unzipping the file, navigate to the root directory of the Magento installation.
                                    Run the command <b>php bin/magento module:enable WriteTextAI_WriteTextAI</b> to enable the extension.</li>
                                    <li>Run the following commands to upgrade, deploy, and clean the cache:<br/> 
                                    php bin/magento setup:upgrade --keep-generated<br/>
                                    php bin/magento setup:di:compile<br/>
                                    php bin/magento setup:static-content:deploy -f<br/>
                                    php bin/magento cache:clean</li>
                                    <li>Log in to the Magento admin panel, navigate to Writetext.ai Module and proceed to the Extension setup guide.</li>
                                </ol>
                                <Link href={"https://writetext.ai/how-to-install-magento"} target='_blank'>How to install WriteText.ai via Composer</Link>
                            </div>
                        </div>
                    </div>
                    }
                    {selectedShopify && 
                    <div className={`mb-20 plugin shopify center  ${selectedShopify ? 'expanded' :''}`} onClick={!selectedShopify ? expandShopify : null}>
                        <div className='d-flex mb-30'>
                            <div className=''>
                                <p>
                                    {shopifyLink !== '' 
                                    ? <Image src="/images/shopify 1.svg" height={40} width={40} alt='Shopify'></Image> 
                                    : <Image src="/images/shopify 2.svg" height={40} width={40} alt='Shopify'></Image>
                                    }
                                    
                                    Shopify
                                </p>
                            </div>
                            <div className={`pull-right plugin-installation ${selectedShopify ? 'visible' :'hidden'}`}>
                            <button className='btn btn-primary download-btn font-14' onClick={handleDownloadClick} disabled={shopifyLink === ''}>{shopifyLink !== '' ? 'Install app' : 'Coming soon'} {shopifyLink !== '' && <Image src="/images/ico-newtab-white.svg" height={16} width={16} alt='download'></Image>}</button>
                            </div>
                        </div>
                        
                        <div className={`plugin-installation ${selectedShopify ? 'visible' :'hidden'}`}>
                            <div className='how-to-install'>
                                How to install
                            </div>
                            <div className='how-to-install-text'>
                                <ol>
                                    <li>Log in to your Shopify backend.</li>
                                    <li>In your left sidebar, search for settings.</li>
                                    <li>After navigating to settings, search for Apps and sales channels &gt; Shopify App store.</li>
                                    <li>Search for WriteText.ai in the search bar and click “WriteText.ai”</li>
                                    <li>Click “Install”.</li>
                                    <li>You will then be taken to the access request screen. Click “Install”.</li>
                                    <li> Follow the instructions in the wizard and you will be ready to generate product text in no time.</li>
                                </ol>
                            </div>
                        </div>
                    </div>
                    }
                    

                    

                {!selectedWooCommerce && !selectedMagento && !selectedShopify  ? (
                    <>
                    <div className="plugin woocommerce center" onClick={expandWooCommerce}>
                        <div className='d-flex'>
                            <div className=''>
                                <p><Image src="/images/woo 1.svg" height={40} width={40} alt='WooCommerce'></Image>WooCommerce</p>
                            </div>
                            <div className='ms-auto plugin-installation d-flex'>
                                <Image className='m-auto' 
                                    src="/images/ic_arrow_right.svg"
                                    width={20}
                                    height={20}
                                     alt='Toggle WooCommerce'></Image>
                            </div>
                        </div>
                    </div>
                   
                    <div className="plugin magento center" onClick={expandMagento}>
                        <div className='d-flex'>
                            <div className=''>
                                <p><Image src="/images/magento 1.svg" height={40} width={40} alt='Magento'></Image>Magento</p>
                            </div>
                            
                            <div className='ms-auto plugin-installation d-flex'>
                                <Image className='m-auto' 
                                    src="/images/ic_arrow_right.svg"
                                    width={20}
                                    height={20}
                                    alt='Toggle Magento'></Image>
                            </div>
                        </div>
                    </div>
                    
                    <div className={`plugin shopify center ${shopifyLink === '' ? 'unavailable' : '' }`} onClick={expandShopify}>
                        <div className='d-flex'>
                            <div className='d-flex'>
                                <p>
                                    {shopifyLink !== '' 
                                    ? <Image src="/images/shopify 1.svg" height={40} width={40} alt='Shopify'></Image> 
                                    : <Image src="/images/shopify 2.svg" height={40} width={40} alt='Shopify'></Image>
                                    }
                                    Shopify
                                </p>
                            </div>
                            {shopifyLink == '' && 
                                <div className='soon'>
                                    <p>COMING SOON</p>
                                </div>
                            }
                            
                            <div className='ms-auto plugin-installation d-flex'>
                                <Image className='m-auto'
                                    src="/images/ic_arrow_right.svg"
                                    width={20}
                                    height={20}
                                    alt='Toggle Shopify'></Image>
                            </div>
                        </div>
                    </div>
                    <div className={`plugin api center`}  onClick={() => {
                        router.push('/api-keys');
                    }}>
                        <div className='d-flex'>
                            <div className='d-flex'>
                                <p>
                                    <Image src="/images/api_1.svg" height={40} width={40} alt='API'></Image>
                                    Other (API)
                                </p>
                            </div>
                            
                            <div className='ms-auto plugin-installation d-flex'>
                                <Image className='m-auto'  
                                    src="/images/ic_arrow_right.svg"
                                    width={20}
                                    height={20}
                                    alt='Open API'>
                                </Image>
                            </div>
                        </div>

                    </div>
                    </>
                ):
                null
            //     <>
            //     <div className={`d-block mb-14 plugin installation`}>
            //         <div className='d-flex'>
            //             <div className='d-flex'>
            //                 <Image className='installation-icon mr-20' src="/images/Installation-big.svg" height={50} width={50} alt='Installation'></Image>
            //                 <div className='installation-text'>
            //                     <p>Installation service</p>
            //                     <p>{userData.allBilling.installationPlan.currency + ' ' + userData.allBilling.installationPlan.amount} per domain</p>
            //                 </div>
            //             </div>
            //             <div className='pull-right d-flex'>
            //                 <button id='installation-toggle' className='btn installation-btn mb-auto mt-auto' onClick={()=>showInstallation()}>Learn more</button>
            //             </div>
            //         </div>
                   
                        
            //         <div id='installation-child' className={`mb-14 plugin installation-child center mt-24`}>
            //             <InstallationServiceComponent userData={userData} classList={'border-0'} />
            //         </div>
            //     </div>
            // </>
                }
                </div>
                {!selectedWooCommerce && !selectedMagento && !selectedShopify &&
                <div className=''>
                    <div className={`d-flex flex-column info`}>
                        <span className='nineteenotwologo'><Image src="/images/1902 logo.svg" height={40} width={40} alt="1902"></Image></span>
                        <span className='peter-image'><Image src="/images/img-peter-contactpage 1.svg" height={80} width={80} alt="Peter Skouhus" priority ></Image></span>
                        <span className='info-header'>We are 1902 Software.</span>
                        <span className='info-text mb-0'>Founded in 1998, we have over 26 years of experience in software development outsourcing across various fields. Our expertise led to the creation of WriteText.ai, a SaaS solution for crafting compelling product descriptions for online retailers.  </span>
                    </div>
                </div>}
                {(selectedWooCommerce || selectedMagento || selectedShopify) ?
                <div className=''>
                    <div className={`d-flex flex-column info info_green `}>
                        <span className='nineteenotwologo'><Image src="/images/1902 logo.svg" height={40} width={40} alt="1902"></Image></span>
                        <span className='peter-image'><Image src="/images/img-peter-contactpage 1.svg" height={80} width={80} alt="Peter Skouhus" priority ></Image></span>
                        <span className='info-header'>Your data and privacy are  safe with us.</span>
                        <span className='info-text'>At 1902 Software, your data and privacy are our top priority. Founded in 1998, we have extensive experience in software development outsourcing across various fields. Our expertise led to the creation of WriteText.ai, a SaaS solution for crafting compelling product descriptions for online retailers.</span>
                        <span className='info-text mb-0'><Link href={"https://1902software.com/"} target='_blank'>Learn more</Link></span>
                    </div>
                </div> : <></>}
                {/* {(userData.account.company.eligibleForFreePremiumCredits && userData.credit.membershipType != MemberTypeEnum.SUBSCRIBER) &&
                <div className=''>
                    <div className={`d-flex flex-column info info-blue `}>
                    <span className='mb-40'><Image src="/images/ico-crown.svg" height={29} width={28} alt="Premium" priority ></Image></span>
                        <p className='m-0'>
                        Get {userData.account.company.freePremiumCredits} credits for <b>FREE</b> to access <b>PREMIUM</b> features when you generate your first text within 24 hours of signing up!
                        </p>
                    </div>
                </div>}
                
                {(userData.account.company.eligibleForFreePremiumCredits && userData.credit.membershipType == MemberTypeEnum.SUBSCRIBER) &&
                <div className=''>
                    <div className={`d-flex flex-column info info-blue `}>
                    <span className='mb-40'><Image src="/images/ico-crown.svg" height={29} width={28} alt="Premium" priority ></Image></span>
                        <p className='m-0'>
                        Get additional {userData.account.company.freePremiumCredits} credits for <b>FREE</b> when you generate your first text within 24 hours of signing up!
                        </p>
                    </div>
                </div>} */}
            </div>
            </>
            : null}
            {/* {currentRoute == "/wizard" ?
            <>
                <div className={`d-block mb-14 plugin installation center`}>
                    <div className='d-flex'>
                        <div className='d-flex'>
                            <Image className='installation-icon mr-20' src="/images/Installation-big.svg" height={50} width={50} alt='Installation'></Image>
                            <div className='installation-text'>
                                <p>(Optional) Installation service</p>
                                <p>{userData.allBilling.installationPlan.currency + ' ' + userData.allBilling.installationPlan.amount} per domain</p>
                            </div>
                        </div>
                        <div className='pull-right d-flex'>
                            <button id='installation-toggle' className='btn installation-btn mb-auto mt-auto' onClick={()=>showInstallation()}>Learn more</button>
                        </div>
                    </div>
                   
                        
                    <div id='installation-child' className={`mb-14 plugin installation-child center`}>
                        <InstallationServiceComponent userData={userData} />
                    </div>
                </div>
            </>
             : null} */}
        </div>
    </div>
  )
}