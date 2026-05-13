
import { useRouter } from 'next/router'
import { setAuthHeader } from '../utils/axiosHeader'
import { useEffect, useState } from 'react'
import LoadingScreen from '../components/LoadingScreen'
export default function Home({userData}) {
  const [user, setUser] = useState(null)
  const [successfulLogin, setSuccessfulLogin] = useState(false)
  const router = useRouter()
  useEffect(() => {
    require("bootstrap/dist/js/bootstrap.bundle.min.js");
    require("bootstrap/dist/css/bootstrap.min.css");

    async function initUser(u){
      if (userData !== null)
      {
        if (userData.account.role.name == "Administrator")
        {
          router.push('/Admin/LoginAs')
        }else
        {
          if (userData.account.address === "00000000-0000-0000-0000-000000000000")
          {router.push('/wizard')
            
          }
          

          router.push('/home')
        }
      }
    
    }
    
    async function getUser() {
      const AuthenticationService = require('../services/AuthenticationService').default
      AuthenticationService.getUser().then(u => {
        if (u != null)
        {
          if (u.profile.role == "Administrator") router.push('/Admin/LoginAs')
          setAuthHeader(u.access_token)
          initUser()   
          setSuccessfulLogin(true)
        }
        // else
        // {
        //   AuthenticationService.login()
        // }
        
      })
    }
    getUser()
   // initUser()
  }, [])// eslint-disable-line react-hooks/exhaustive-deps
  
      return (
       <>
        <LoadingScreen/>
       </>
      )
  
}
