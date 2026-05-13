import React, { useState, useEffect } from 'react'
import Body from '../../components/Body'
import Content from '../../components/Content'
import PluginsComponent from '../../components/Plugins'
import AsyncIframe from '../../components/AsyncIframe'
import t from '../../public/translation/locale'

function Downloads({userData}) {
   
    const [translation, setTranslation] = useState(null)
    const [showProTip, setShowProTip] = useState(true)
    
    useEffect(() => {
      
      const locale = navigator.language.substring(0,2);
      setTranslation(t[locale] != undefined ? t[locale].Content["Plugins"] : t["en"].Content["Plugins"])  
      
    },[])// eslint-disable-line react-hooks/exhaustive-deps

    if (translation && userData)
    return (
        <>
            <div className='welcome-container'>
                <Body classList={'scrollable-body'}>
                    <Content>
                      
                      <div className='d-flex flex-column welcome-content downloads'>
                        
                        <PluginsComponent translation={translation} userData={userData} showProTip={setShowProTip}/>
                      </div>
                    </Content>  
                </Body>
            </div>
        </>
    )
}

export default Downloads