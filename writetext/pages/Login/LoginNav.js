import React from 'react'
import Image from 'next/image'

export default function LoginNav(){
  return (
    <>
    
    <nav className="navbar">
        <a className="navbar-brand" href="#">
            <Image src="/images/logo_writetext.png" className="d-inline-block align-top"  width="200" height="38" alt='writetext logo' />
        </a>
    </nav>
    </>
  )
}

