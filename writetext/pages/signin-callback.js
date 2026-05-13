import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import settings from '../settings/AppSetting'
import LoggingInScreen from '../components/LoggingInScreen'

function SigninOidc() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const AuthenticationService = require('../services/AuthenticationService').default
    async function signinAsync() {
        await AuthenticationService.loginCallback().then(e => {
          setLoading(false)
          let routeFromStorage = localStorage.getItem('currentRoute')
          let currentRoute = routeFromStorage ? routeFromStorage : "/"//localStorage.getItem('currentRoute')
          AuthenticationService.getUser().then(u => {
            if (u.profile.role == settings.WAI_ADMIN)
            {
              if (!currentRoute.includes('/admin/email'))
              {
                window.location.href = `/admin/loginas`
              }else
              {
                window.location.href = currentRoute
              }
            }
            else
            {
              if (currentRoute == null) {
                currentRoute = "/"
              }
              if (currentRoute === "/signin-callback") {
                window.location.href = "/"
              }
              window.location.href = "/"
            }
          })
        })
    }
    if (router.asPath.toLocaleLowerCase() !== '/terms')
    {
      signinAsync()
    }
  }, [])// eslint-disable-line react-hooks/exhaustive-deps
    return (
      <><LoggingInScreen /></>
    )
}

export default SigninOidc
