import React from 'react'
import Link from 'next/link'
import Image from 'next/image'

export default function SideMenuWizard ({activeStep, shortcut}){
  return (
    <div className='sidebar-wizard-welcome'>
      <div>
        <p className='welcome'>Welcome!</p>
        <p>Let&apos;s get your account set up.</p>
      </div>
      <div className='setup-guide-container'>
          <div className='sidebar-wizard-item sidebar-wizard-bottom-border'>
              <div id='account' className={`d-flex align-center ${activeStep > 1 ? `finished` : ``}`}>
                <p className={`sidebar-wizard-number ${activeStep == 1 ? `step-active`:``}`}>1</p>
                <p className={`sidebar-wizard-item-text ${activeStep == 1 ? `step-active` : ``}`}>Account</p>
              </div>
          </div>
          {/* <div className='sidebar-wizard-item sidebar-wizard-bottom-border'>
              <div id='billing' className={`d-flex align-center ${activeStep > 2 ? `finished` : ``}`}>
                <p className={`sidebar-wizard-number ${activeStep == 2 ? `step-active`:``}`}>2</p>
                <p className={`sidebar-wizard-item-text ${activeStep == 2 ? `step-active` : ``}`}>Subscription</p>
              </div>
          </div> */}
          <div className='sidebar-wizard-item'>
              <div id='plugins' className='d-flex align-center'>
                <p className={`sidebar-wizard-number ${activeStep == 2 ? `step-active`:``}`}>2</p>
                <p className={`sidebar-wizard-item-text ${activeStep == 2 ? `step-active` : ``}`}>Add-ons</p>
              </div>
          </div>
      </div>
    </div>
  )
}

