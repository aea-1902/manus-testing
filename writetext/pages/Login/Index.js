import React from "react"
import LoginNav from "./LoginNav"
import Footer from "../../components/Footer"
import Login from "../../components/Login"

import Link from "next/link"
import Image from "next/image"

import { useEffect } from "react"

export default function Index() {
  return (
    <>
    <Login>
    <LoginNav />
    <div className="signup">
      
    <div  className="header text-center"><p>Welcome back!</p></div>
      <div className="form-group">
        <div className="form-floating">
          <input id="email" type="text" className="form-control" placeholder="Email"></input>
          <label htmlFor="email">Email<span className="required">*</span></label>
        </div>
      </div>
      <div className="form-group mb-24">
        <div className="form-floating">
          <input id="password" className="form-control eyecon" type="password" placeholder="Password"/>
          <label htmlFor="password">Password</label>
        </div>
      </div>
      <div className="d-flex mb-36">
        <div className="form-check">
          <input className="form-check-input" type="checkbox" value="" id="flexCheckDefault" />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            Remember me
          </label>
        </div>
        
        <div className="ml-auto">
          <Link className="text-decoration-none" href="/Login/ForgotPassword">Forget password</Link>
        </div>
      </div>
      <div className="mb-14">
        <input type="button" className="btn btn-primary w-100 h-45" value="Log in" />
      </div>
      <div className="mb-14">
        <div className="d-flex">
          <Link className="btn w-100 h-45 google-btn" href="/Login"><Image src="/images/ic_google.svg" width={18} height={18} alt="google login"></Image><label className="f-14">Sign in with google</label></Link>
        </div>
      </div>
      <div >
        <p className="text-center">{"Don't have an account?"}<Link className="text-decoration-none" href="/Login/Signup">Sign up</Link></p>
      </div>
    </div>
    </Login>
    <Footer display={`d-flex mb-40 p-0`} />
    </>
  )
}
