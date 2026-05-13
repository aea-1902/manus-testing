import React from 'react'
import Login from '../../components/Login'
import LoginNav from './LoginNav'
import Footer from '../../components/Footer'

import Link from 'next/link'
import Image from 'next/image'
export default function Signup() {
  return (
    <>
    <Login>
    <LoginNav />
    <div className='signup'>
      <div  className="header text-center"><p>{"Let's get started."}</p></div>
      <div className='form-group'>
        <div className='form-floating'>
          <input id='firstName' type='text' className='form-control' placeholder='First name'></input>
          <label htmlFor="firstName">First name<span className="required">*</span></label>
        </div>
      </div>
      <div className='form-group'>
        <div className='form-floating'>
          <input id='lastName' type='text' className='form-control' placeholder='Last name'></input>
          <label htmlFor="lastName">Last name<span className="required">*</span></label>
        </div>
      </div>
      <div className='form-group'>
        <div className='form-floating'>
          <input id='email' type='text' className='form-control' placeholder='Email'></input>
          <label htmlFor="email">Email<span className="required">*</span></label>
        </div>
      </div>
      <div className='form-group'>
        <div className='form-floating'>
          <input id="password" className="form-control eyecon" type="password" placeholder="Password"/>
          <label htmlFor="password">Password</label>
        </div>
      </div>
      <div className='password-note mb-36'>
        <label>Must be at least 8 characters, include a number, an uppercase and a lowercase letter.</label>
      </div>

      <div className='mb-14'>
        <input type='button' className='btn btn-primary w-100 h-45' value='Create account' />
      </div>
      <div className='mb-14'>
        <div className='d-flex'>
          <Link className='btn w-100 h-45 google-btn' href="/Login"><Image src="/images/ic_google.svg" width={18} height={18} alt='google login'></Image><label className='f-14'>Sign up with google</label></Link>
        </div>
      </div>
      <div >
        <p className='text-center'>Already have an account? <Link href="/Login/Index">Log in</Link></p>
      </div>
    </div>
    </Login>
    <Footer display={`d-flex mb-40 p-0`} />
    </>
  )
}

