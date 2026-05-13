import React from 'react'
import Payment from './Payment'

const Payments = ({payments}) => {
  return (
    <>
        {payments.map((payment, index) =>
        (
        
        <Payment key={index} payment={payment} />
        
        ))}
    </>
  )
}

export default Payments