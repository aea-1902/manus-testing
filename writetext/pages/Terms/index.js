import React from 'react'
import Header from '../../components/Header'
import Content from '../../components/Content'

import {PolicyEnum} from "../../enum/PolicyType"
import PolicyComponent from '../../components/Policy'
import Footer from '../../components/Footer'
import GoToTop from '../../components/GoToTop'
export default function Index() {
  let userAgent = typeof window !== 'undefined' ? navigator.userAgent.toLowerCase() : '';
  return (
    <>
    {/* <Header/> */}
            <Content backgroundclass={`${userAgent.includes('firefox') ? 'firefox' : ''} scrollable-container steps terms`}>
                    <PolicyComponent type={PolicyEnum.TermsOfService} anonymous={true}/>
                    <GoToTop />
            </Content>
    {/* <Footer/> */}
    </>
  )
}
