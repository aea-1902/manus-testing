import React from 'react'
import Content from '../../components/Content'

import {PolicyEnum} from "../../enum/PolicyType"
import PolicyComponent from '../../components/Policy'
import GoToTop from '../../components/GoToTop'
export default function Index() {
  let userAgent = typeof window !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
  return (
    <>
        <Content backgroundclass={`${userAgent.includes('firefox') ? 'firefox' : ''} scrollable-container steps terms`}>
                <PolicyComponent type={PolicyEnum.PrivacyPolicy} anonymous={true}/>
                
                <GoToTop />
        </Content>
    </>
  )
}
