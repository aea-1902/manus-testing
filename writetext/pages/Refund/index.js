import React from 'react'
import Header from '../../components/Header'
import Content from '../../components/Content'

import {PolicyEnum} from "../../enum/PolicyType"
import PolicyComponent from '../../components/Policy'
import Footer from '../../components/Footer'
export default function Index() {
    
  return (
    <>
    {/* <Header/> */}
            <Content backgroundclass={"scrollable-container steps terms"}>
                    <PolicyComponent type={PolicyEnum.RefundPolicy} anonymous={true}/>
            </Content>
    {/* <Footer/> */}
    </>
  )
}
