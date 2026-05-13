// import axios from 'axios'

// export const renewToken = () => {
    
//     const AppSettings = require('../settings/AppSetting').default
    
//     var qs = require('qs');
//     var data = qs.stringify({
//       'grant_type': 'client_credentials' 
//     });

//     axios({
//         method: 'POST',
//         url: 'https://api-m.sandbox.paypal.com/v1/oauth2/token',
//         headers: {"Content-Type": "application/x-www-form-urlencoded"},
//         auth: {
//             username: AppSettings.PAYPAL_CLIENT_ID,
//             password: AppSettings.PAYPAL_SECRET_ID
//           },
//         data : data
//     })
//      .then(res=>{
//         saveToStorage("paypal_token", res.data.access_token)
//         const dt = new Date();
//         dt.setSeconds(dt.getSeconds() + res.data.expires_in)
//         saveToStorage("expired_at", dt)
//     })
// }

// export const isTokenExpired = () => {
//     if (getFromStorage("paypal_token") == null)
//     {
//         renewToken()
//     }
//     else{
        
//         const expiration = Date.parse(getFromStorage("expired_at"));
//         const dtNow = new Date().getTime();
//         if (expiration <= dtNow)
//         {
//             renewToken()
//         }
//     }
// }

// export const saveToStorage = (key, value) => {
//     if(typeof window !== 'undefined'){
//         return window.localStorage.setItem(key,value);
//     }
// }

// export const getFromStorage = (key) => {
//     if (typeof window !== 'undefined'){
//         return window.localStorage.getItem(key);
//     }
// }