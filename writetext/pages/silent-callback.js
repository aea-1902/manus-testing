import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

function SilentSigninOidc() {
  const router = useRouter()
  // const [loading, setLoading] = useState(true)
  useEffect(() => {
    
    const AuthenticationService = require('../services/AuthenticationService').default
    async function silentSigninAsync() {
      localStorage.setItem('currentRoute', "/home")
        await AuthenticationService.renewToken()
        
        //console.log(u)
   
    }
    
    silentSigninAsync()

  }, [])
  
    return (
      <></>
    )
}

export default SilentSigninOidc
