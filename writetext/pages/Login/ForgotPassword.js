import React from 'react'
import LoginNav from './LoginNav'
import Login from '../../components/Login'
import Footer from '../../components/Footer'

import Link from 'next/link'
import Image from 'next/image'


export default function ForgotPassword() {
  return (
    <>
    <Login>
    <LoginNav />
    <div className='signup'>
    <div className='reset-password-notif mb-40'>
      <p className='font-13'>Please check your email to reset your password. If it doesn’t appear within a few minutes, check your spam folder.</p>
    </div>
    <div  className="header"><p className='mb-14'>Forgot password</p></div>
    <div className='mb-36'><p className='font-13 mb-14 sub-p'>A link to reset your password will be sent to your email address.</p></div>
    <div className='form-group mb-14'>
      <div className='form-floating'>
        <input id='email' type='text' className='form-control' placeholder='Email'></input>
        <label htmlFor="email">Email<span className="required">*</span></label>
      </div>
    </div>
    
    <div className='mb-14'>
      <input type='button' className='btn btn-primary w-100 h-45' value='Log in' />
    </div>
    <div className='text-center'>
        <Link className='text-center text-decoration-none' href="/Login/Index">Back to login</Link>
      </div>
    </div>
    </Login>
    <Footer display={`d-flex mb-40 p-0`} />
    </>
  )
}
