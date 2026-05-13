import React from 'react'

function formatDate(date) {
   
  const d = new Date(date)
  const userLocale = navigator.language.substring(0,2);
  const options = {
    year: 'numeric',
    month: userLocale == 'en' ? 'short' : 'long' ,
    day: 'numeric',
  };
  const formattedDate = d.toLocaleDateString(userLocale, options);
  return formattedDate

  }
  
function getMonth(date){
    
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const d = new Date(date)
    const year = d.getFullYear()
    const day = d.getDay()
    const month = months[d.getMonth()]
  
    return month
}
//create a function that will format the integer to with 2 decimal places and comma
function formatNumber(number){
    return number.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}
function Row(props) {
  const { row } = props;

  return (
    <React.Fragment>
        
        {row.map((paymentRow,index) => (
            <>
            <div key={index} className="d-flex center invoice-row mb-15">
                <div className="w-100 font-13">
                    {formatDate(paymentRow.date)}
                </div>
                <div className="w-100 font-13">
                    {paymentRow.paymentGatewayId}
                </div>
                <div className="w-100 font-13">
                {paymentRow.currencyCode} {formatNumber(paymentRow.amount)}
                </div>
                <div className="w-100 font-13">
                    {paymentRow.type == "0" ? "Subscription payment" : paymentRow.type == "1" ? "Credit payment" : "Installation service"}
                </div>
            </div>
            </>
            ))}
    </React.Fragment>
  )
}

const Payment = ({payment}) => {
  return (
    <React.Fragment>
        <div>
            <p className='font-16 mb-15 sub-p'>{getMonth(payment.date)}</p>
            <Row row={payment.payments}></Row>
        </div>
    </React.Fragment>
    
  )
}

export default Payment