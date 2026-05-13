import React, { useState, useEffect } from 'react';
import Image from 'next/image';
export default function AsyncIframe({ src }) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.width = '100%';
    iframe.height = '240px';
    iframe.frameBorder = '0';
    iframe.scrolling = 'no';
    iframe.className = 'm-auto d-none'

    iframe.style.zIndex = '999';

    iframe.onload = () => {
        setLoaded(true);
        const image = document.getElementById('iframeLoader');
        image.className = 'd-none'
        setTimeout(() => {
            iframe.className = 'm-auto d-block'
        }, 100);
    };

    const iframeContainer = document.querySelector('.iframe-container');
    iframeContainer.appendChild(iframe);


  }, [src]);
  return (
    
    <div className='d-flex iframe-container w-100'>
        {!loaded && <Image id='iframeLoader' className='mx-auto' src="https://writetextaistorage.z6.web.core.windows.net/ic_loader_writetext_backend.gif" width={60} height={60} alt="loader"></Image>}

    </div>
  );
}