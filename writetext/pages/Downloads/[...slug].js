import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import axios from 'axios'
import Body from '../../components/Body'
import Content from '../../components/Content'  
import Link from 'next/link'
import Image from 'next/image'
import { setAuthHeader } from '../../utils/axiosHeader'
import AppSettings from '../../settings/AppSetting'

import t from '../../public/translation/locale'
function Download({userData}) {
    const router = useRouter();
    const [slugs, setSlugs] = useState(null)
    const [downloading, setDownloading] = useState(false)
    const [access_token, setAccessToken] = useState(null)
    const [progress, setProgress] = useState(0)
    const [downloadMessage, setDownloadMessage] = useState('')
    const [downloadingMessage, setDownloadingMessage] = useState('')
    const [translation, setTranslation] = useState(null)
    useEffect(() => {
  
        async function getUser() {
          
            const locale = navigator.language.substring(0,2);
            setTranslation(t[locale] != undefined ? t[locale].Content["Plugins"] : t["en"].Content["Plugins"])
            const AuthenticationService = require('../../services/AuthenticationService').default
            await AuthenticationService.getUser().then(u => {
                if (u != null)
                {
                    setAccessToken(u.access_token)
                    setSlugs(router.query.slug)
                    //getEmailTransactions()
                }
            })
        } 
        if(!router.isReady) return;
      
        getUser()
      },[router.isReady])

    useEffect(() => {
        async function downloadFile(){
            const fileUrl = `${AppSettings.API_URL}/Downloads/${router.query.slug[0]}/${router.query.slug[1]}`;
            const fileName = `${router.query.slug[1]}`;
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
              if (typeof totalLength === 'number')
              {
                const step = (receivedLength / totalLength).toFixed(2) * 100 
                setProgress(step)
              }
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
        if (slugs != null)
        {
          
        switch (router.query.slug[0])
        {
          case 'magento':
            setDownloadingMessage('Magento')
            break;
          case 'wordpress':
            setDownloadingMessage('WordPress / WooCommerce')
            break;
          case 'woocommerce':
            setDownloadingMessage('WordPress / WooCommerce')
            break;
          case 'shopify':
            setDownloadingMessage('Shopify')
            break;
          default:
            break;
        }
            if (!downloading)
            {
                setDownloading(true)
                downloadFile()
            }
        }
    },[slugs])
    useEffect(() => {
        if (progress == 100)
        {
          switch (router.query.slug[0])
          {
            case 'magento':
              setDownloadMessage('Your Magento extension is ready. Please check your Downloads folder.')
              break;
            case 'wordpress':
              setDownloadMessage('Your WordPress / WooCommerce plugin is ready. Please check your Downloads folder.')
              break;
            case 'woocommerce':
              setDownloadMessage('Your WordPress / WooCommerce plugin is ready. Please check your Downloads folder.')
              break;
            case 'shopify':
              setDownloadMessage('Your Shopify app is ready. Please check your Downloads folder.')
              break;
            default:
              break;
          } 
        }
    },[progress])
if (userData && slugs && downloading && translation)
  return (
    <>
    <Body>
        {/* {progress < 100 && <Content>Downloading {downloadingMessage} {`(${progress}%)`} </Content>}
        {progress == 100 && <Content>{downloadMessage}</Content>} */}
        {/* <Content>{progress < 100 ? `Downloading ${router.query.slug[0]} (${progress} %)` : ''}</Content> */}
        {/* <Content>Progress {progress}%</Content> */}
        <Content>
          
        <div className='container plugin-page'>
          <div className='container'>
            <div className="header">
              <p>{translation["PageHeaderText"]}</p>
              <div className='empty-addons'>
                <span>
                <svg width="188" height="149" viewBox="0 0 188 149" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g id="undraw_folder_re_apfp 1" clip-path="url(#clip0_2264_2335)">
                <path id="Vector" d="M53.3112 0.227905C51.4197 0.230071 49.8868 1.76712 49.8848 3.66379V63.8726C49.8868 65.7692 51.4197 67.3063 53.3112 67.3084H138.245C140.137 67.3063 141.669 65.7692 141.672 63.8726V3.66379C141.669 1.76712 140.137 0.230065 138.245 0.227905H53.3112Z" fill="#E6E6E6"/>
                <path id="Vector_2" d="M107.7 64.3783H55.7113C53.6755 64.376 52.0257 62.7217 52.0234 60.6803V6.07151C52.0257 4.03016 53.6755 2.37583 55.7113 2.37354H135.846C137.882 2.37582 139.531 4.03013 139.534 6.07151V32.458C139.514 50.0788 125.273 64.3584 107.7 64.3783Z" fill="white"/>
                <path id="Vector_3" d="M87.3348 17.486H74.9806C74.329 17.486 73.8008 16.9564 73.8008 16.3031C73.8008 15.6497 74.329 15.1201 74.9806 15.1201H87.3347C87.9863 15.1201 88.5145 15.6497 88.5145 16.3031C88.5145 16.9564 87.9863 17.486 87.3348 17.486Z" fill="#AEAEAE"/>
                <path id="Vector_4" d="M115.029 22.3244H74.9806C74.329 22.3244 73.8008 21.7948 73.8008 21.1415C73.8008 20.4881 74.329 19.9585 74.9806 19.9585H115.029C115.68 19.9585 116.208 20.4881 116.208 21.1415C116.208 21.7948 115.68 22.3244 115.029 22.3244Z" fill="#E6E6E6"/>
                <path id="Vector_5" d="M115.029 27.8783H74.9806C74.329 27.8783 73.8008 27.3486 73.8008 26.6953C73.8008 26.042 74.329 25.5123 74.9806 25.5123H115.029C115.68 25.5123 116.208 26.042 116.208 26.6953C116.208 27.3486 115.68 27.8783 115.029 27.8783Z" fill="#E6E6E6"/>
                <path id="Vector_6" d="M115.029 33.432H74.9806C74.329 33.432 73.8008 32.9023 73.8008 32.249C73.8008 31.5957 74.329 31.066 74.9806 31.066H115.029C115.68 31.066 116.208 31.5957 116.208 32.249C116.208 32.9023 115.68 33.432 115.029 33.432Z" fill="#E6E6E6"/>
                <path id="Vector_7" d="M115.029 38.9858H74.9806C74.329 38.9858 73.8008 38.4562 73.8008 37.8028C73.8008 37.1495 74.329 36.6199 74.9806 36.6199H115.029C115.68 36.6199 116.208 37.1495 116.208 37.8028C116.208 38.4562 115.68 38.9858 115.029 38.9858Z" fill="#E6E6E6"/>
                <path id="Vector_8" d="M147.139 42.2643H130.374C127.039 42.2643 124.337 44.9745 124.337 48.3176C124.337 51.6608 121.634 54.3709 118.3 54.3709H62.4057C59.0716 54.3709 56.3688 51.6608 56.3688 48.3176L55.2636 42.1812L45.132 29.2296C44.4593 28.3558 43.4174 27.8483 42.3166 27.8583H23.316C21.3409 27.8607 19.7403 29.4655 19.738 31.446L19.3457 42.1812H12.1624C5.81745 42.1812 0.673828 47.3387 0.673828 53.7009V128.728C0.673828 134.374 5.23836 138.951 10.869 138.951H147.139C152.766 138.944 157.326 134.371 157.331 128.728V52.4843C157.331 46.84 152.768 42.2643 147.139 42.2643Z" fill="#E6E6E6"/>
                <path id="Vector_9" d="M55.2694 41.9042H19.7383V31.169C19.7406 29.1885 21.3412 27.5837 23.3163 27.5813H42.3169C43.4177 27.5713 44.4596 28.0788 45.1323 28.9527L55.2694 41.9042Z" fill="#CCCCCC"/>
                <path id="Vector_10" d="M73.462 130.695H14.1343C10.224 130.691 7.0552 127.513 7.05078 123.593V107.324C7.05519 103.403 10.224 100.225 14.1343 100.221H85.3415C89.2518 100.225 92.4206 103.403 92.425 107.324V111.681C92.4131 122.177 83.9301 130.683 73.462 130.695Z" fill="white"/>
                <path id="Vector_11" d="M31.2128 112.493H16.5693C14.5856 112.493 12.9775 110.88 12.9775 108.891C12.9775 106.902 14.5856 105.29 16.5693 105.29H31.2128C33.1965 105.287 34.8067 106.898 34.8092 108.887C34.8118 110.876 33.2058 112.49 31.2221 112.493H31.2128Z" fill="#AEAEAE"/>
                <path id="Vector_12" d="M80.9454 123.851H16.5693C14.5856 123.851 12.9775 122.239 12.9775 120.25C12.9775 118.261 14.5856 116.648 16.5693 116.648H80.9454C82.929 116.646 84.5392 118.256 84.5418 120.245C84.5443 122.234 82.9383 123.849 80.9546 123.851L80.9454 123.851Z" fill="#AEAEAE"/>
                <path id="Vector_13" d="M161.899 149C147.76 149 136.298 137.507 136.298 123.33C136.298 109.152 147.76 97.6592 161.899 97.6592C176.038 97.6592 187.5 109.152 187.5 123.33C187.5 137.507 176.038 149 161.899 149Z" fill="#AEAEAE"/>
                <path id="Vector_14" d="M151.139 129.515V132.212C151.139 132.927 151.422 133.613 151.927 134.119C152.431 134.625 153.115 134.909 153.829 134.909H169.969C170.682 134.909 171.366 134.625 171.871 134.119C172.375 133.613 172.659 132.927 172.659 132.212V129.515M155.174 121.423L161.899 128.166M161.899 128.166L168.624 121.423M161.899 128.166V111.983" stroke="white" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <defs>
                <clipPath id="clip0_2264_2335">
                <rect width="187" height="149" fill="white" transform="translate(0.5)"/>
                </clipPath>
                </defs>
                </svg>

                </span>
              </div>
              
              {/* <span className='addon-download-text mb-42'><span className='m-auto'>Your WordPress / WooCommerce plugin is ready. Please check your <span className='fw-600'>Downloads folder.</span></span></span>  */}
              <span className='addon-download-text'>
              Your WordPress / WooCommerce is currently being downloaded.</span>
              <span className='addon-download-text mb-36'>
              Please check your Downloads folder. Once the download is complete, please proceed to install it the way you normally would install a plugin in WordPress.
              </span>
              <span className='addon-download-text mb-42'>  
              You can follow the installation guide by clicking the button below.
              </span>
              <div className='d-flex mb-20'>
                <Link className='btn btn-primary font-14 goto' href="https://writetext.ai/how-to-install" target="_blank"><span>Go to installation guide<Image src="/images/iconoir_arrow-tr.svg" height={16} width={16} alt='download'></Image></span></Link>
              </div>
              <div className='d-flex'>
                <Link className='mr-auto ml-auto back-btn' href="/plugins">Back to add ons</Link>
              </div>
            </div>
          </div>
        </div>
        </Content>
    </Body>
    </>
  )
}

export default Download