import React from 'react'

const Login = ({children}) => {
  return (
    <>
    <div className='d-flex h-100'>

      <div className='w-50'>
        {children}
      </div>
      <div className='w-50 bg-login'>

      </div>
    </div>
    </>
  )
}

export default Login