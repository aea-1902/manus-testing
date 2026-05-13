import React, { useEffect , useState} from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router';
function currentYear() {
  return new Date().getFullYear();
}

const Footer = () => {
  const [successfulLogin, setSuccessfulLogin] = useState(false)
  const router = useRouter();
  let anonymous = false;
  switch (router.asPath.toLocaleLowerCase())
  {
    case '/privacy':
      anonymous = true;
      break;
    case '/cookie':
      anonymous = true;
      break;
    case '/terms':
      anonymous = true;
      break;
    case '/suppliers':
      anonymous = true;
      break;
    case '/privacy/policy':
      anonymous = false;
      break;
    case '/cookie/policy':
      anonymous = false;
      break;
    case '/terms/policy':
      anonymous = false;
      break;
    default:
      anonymous = false;
      break;
  }

  useEffect(() => {
    async function getUser() {
      const AuthenticationService = require('../services/AuthenticationService').default
      AuthenticationService.getUser().then(u => {
        if (u != null)
        {
          setSuccessfulLogin(true)
        }
        
      })
    }
    getUser()
  },[])
  if (anonymous || successfulLogin)
  return (
    <footer>
      <div className='d-flex w-100'>
          <p className='privacy-links'>
            <Link href={"/terms"} target='_blank' rel='noreferrer'>Terms of Service</Link> | <Link href={"/privacy"} target='_blank' rel='noreferrer'>Privacy Notice</Link> | <Link href={"/refund"} target='_blank' rel='noreferrer'>Refund Policy</Link> | <Link href={"/cookie"} target='_blank' rel='noreferrer'>Cookie Policy</Link>
          </p>
        <p className='pull-right'>&copy; {currentYear()} WriteText.ai. All rights reserved. A service by <Link target='_blank' href='https://1902software.com/' rel='noreferrer'>1902 Software.</Link></p>
        
      </div>
    </footer>
  )
}

export default Footer