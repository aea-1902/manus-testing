import React from 'react'
import Content from '../../components/Content'

import {PolicyEnum} from "../../enum/PolicyType"
import PolicyComponent from '../../components/Policy'
export default function Index() {
    
  return (
    <>
    {/* <Header/> */}
            <Content backgroundclass={"scrollable-container steps terms"}>
                    <PolicyComponent type={PolicyEnum.Suppliers} anonymous={true}/>
            </Content>
    {/* <Footer/> */}
    </>
  )
}
