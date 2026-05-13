import React, { useEffect } from 'react'

function SignoutOidc() {
  useEffect(() => {
    async function signoutAsync() {
      const AuthenticationService = require('../services/AuthenticationService').default
       await AuthenticationService.logout().then(e => {
        
       })
    }
    signoutAsync()
  }, [])

  return (
    <div>
      Redirecting...
    </div>
  )
}

export default SignoutOidc
