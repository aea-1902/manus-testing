import React from 'react'
import LoginNav from './LoginNav'
import Footer from '../../components/Footer'
import Login from '../../components/Login'

import Link from 'next/link'
import Image from 'next/image'


export default function ResetPassword() {
  return (
    <>
    <Login>
    <LoginNav />
    <div className='signup'>
      <div  className="header mb-36"><p className='mb-14 font-24'>Reset password</p></div>
      
      <div className='form-group'>
          <div className='form-floating'>
            <input id="password" className="form-control eyecon font-13" type="password" placeholder="Password"/>
            <label className='faded' htmlFor="password">New password<span className="required">*</span></label>
          </div>
      </div>
      
      <div className='form-group'>
        <div className='form-floating'>
          <input id="password" className="form-control eyecon font-13" type="password" placeholder="Password"/>
          <label className='faded' htmlFor="password">Re-enter new password<span className="required">*</span></label>
        </div>
      </div>
        
      <div className='password-note mb-36'>
          <label>Must be at least 8 characters, include a number, an uppercase and a lowercase letter.</label>
      </div>

      <div className='right'>
        <input type='button' className='btn btn-primary h-45 w-86' value='Reset' />
      </div>
    </div>
    </Login>
    <Footer display={`d-flex mb-40 p-0`} />
    </>
  )
}
