// utils/axiosInstance.js

import axios from 'axios';

const AppSettings = require('../settings/AppSetting').default
const AuthenticationService = require('../services/AuthenticationService').default

const axiosInstance = axios.create({
  baseURL:`${AppSettings.API_URL}`, // Replace with your API base URL
  headers: {
    'Content-Type': 'application/json',
    // You can add other default headers here
  },
});

axiosInstance.interceptors.request.use(async config => {
    // Add your Bearer token here
    await AuthenticationService.getUser().then(async u => {
      if (u != null)
      {
        config.headers.Authorization = `Bearer ${u.access_token}`;
        return config;
      }
    })
    // const token = localStorage.getItem('jwtToken');
    
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
  
    return config;
  });
export default axiosInstance;
