// api.service.js
import axios from 'axios';
import { setAuthHeader } from '../utils/axiosHeader';
import AppSettings from '../settings/AppSetting';
import { parseJwt } from '../utils/helper';
const api = axios.create({
  baseURL: AppSettings.API_URL,
});

api.interceptors.request.use(async config => {
    
    const AuthenticationService = require('../services/AuthenticationService').default
    
    const user = await AuthenticationService.getUser();
    if (user && user.access_token) {
      config.headers.Authorization = `Bearer ${user.access_token}`;
      setAuthHeader(user.access_token);
    }
    return config;
  });
const defaultHeaders = {
'Content-Type': 'application/json',
'Accept': 'application/json'
};
const ApiService = {
  get: (endpoint, params = {}) => {
    return api.get(endpoint, { params })
      .then(response => response)
      .catch(error => {
        handleApiError(error);
        throw error;  // Re-throw to propagate error to the calling function if needed
      });
  },
  getAdmin: (endpoint, params = {}) => {
    const apiAdmin = axios.create({
      baseURL: AppSettings.API_URL,
    });

    apiAdmin.interceptors.request.use(async config => {
        
        const AuthenticationService = require('../services/AuthenticationService').default
        
        const user = await AuthenticationService.impersonated();
        if (user && user.access_token) {
          config.headers.Authorization = `Bearer ${user.access_token}`;
          setAuthHeader(user.access_token);
        }
        return config;
      });

    return apiAdmin.get(endpoint, { params })
      .then(response => response)
      .catch(error => {
        handleApiError(error);
        throw error;  // Re-throw to propagate error to the calling function if needed
      });
  },
  post: async (endpoint, data = {}) => {
    try {
      const response = await api.post(endpoint, data);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;  // Re-throw to propagate error to the calling function if needed
    }
  },

  postWithFormData: async (endpoint, data = {}, options = {}) => {
    
    const headers = { ...defaultHeaders, ...options.headers };
    try {
      const response = await api.post(endpoint, data, { headers });
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;  // Re-throw to propagate error to the calling function if needed
    }
  },
  postWithFormDataAdmin: async (endpoint, data = {}, options = {}) => {
   
    const apiAdmin = axios.create({
      baseURL: AppSettings.API_URL,
    });

    apiAdmin.interceptors.request.use(async config => {
        
        const AuthenticationService = require('../services/AuthenticationService').default
        
        const user = await AuthenticationService.impersonated();
        if (user && user.access_token) {
          config.headers.Authorization = `Bearer ${user.access_token}`;
          setAuthHeader(user.access_token);
        }
        return config;
      });

      const headers = { ...defaultHeaders, ...options.headers };
      try {
        const response = await apiAdmin.post(endpoint, data, { headers });
        return response;
      } catch (error) {
        handleApiError(error);
        //throw error;  // Re-throw to propagate error to the calling function if needed
      }
  },
  postAdmin: async (endpoint, data = {}) => {
    const apiAdminSession = axios.create({
      baseURL: AppSettings.API_URL,
    });
    apiAdminSession.interceptors.request.use(async config => {
      // Get admin user token using AuthenticationService
      const AuthenticationService = require('../services/AuthenticationService').default;
      const user = await AuthenticationService.impersonated();
      if (user && user.access_token) {
        config.headers.Authorization = `Bearer ${user.access_token}`;
        setAuthHeader(user.access_token);
      }
      return config;
    });

    try {
      const response = await apiAdminSession.post(endpoint, data);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;  // Re-throw to propagate error to the calling function if needed
    }
  },
  getAdminSession: (endpoint, params = {}) => {
    const apiAdminSession = axios.create({
      baseURL: AppSettings.API_URL,
    });

    apiAdminSession.interceptors.request.use(async config => {
      // Get admin user token using AuthenticationService
      const AuthenticationService = require('../services/AuthenticationService').default;
      const user = await AuthenticationService.impersonated();
      if (user && user.access_token) {
        config.headers.Authorization = `Bearer ${user.access_token}`;
        setAuthHeader(user.access_token);
      }
      return config;
    });

    return apiAdminSession.get(endpoint, { params })
      .then(response => response)
      .catch(error => {
        handleApiError(error);
        throw error;  // Re-throw to propagate error to the calling function if needed
      });
  },
  delete: async (endpoint, params = {}) => {
    try {
      const response = await api.delete(endpoint, { params });
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;  // Re-throw to propagate error to the calling function if needed
    }
  },

  put: async (endpoint, data = {}) => {
    try {
      const response = await api.put(endpoint, data);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;  // Re-throw to propagate error to the calling function if needed
    }
  },

  patch: async (endpoint, data = {}) => {
    try {
      const response = await api.patch(endpoint, data);
      return response;
    } catch (error) {
      handleApiError(error);
      throw error;  // Re-throw to propagate error to the calling function if needed
    }
  },


};

// Helper function to handle API errors
const handleApiError = (error) => {
  if (error.response) {
    // The server responded with a status code outside the 2xx range
    const status = error.response.status;
    const message = error.response.data?.message || 'An error occurred';

    if (status === 400) {
      console.error(`Bad Request: ${message}`);
      // Handle 400 Bad Request specifically here
      // You can display a specific error message or log additional details
    } else if (status === 401) {
      console.error(`Unauthorized: ${message}`);
      // Handle 401 Unauthorized here (e.g., redirect to login)
    } else if (status === 403) {
      console.error(`Forbidden: ${message}`);
      // Handle 403 Forbidden here
    } else if (status === 500) {
      console.error(`Server Error: ${message}`);
      // Handle 500 Internal Server Error here
    } else {
      console.error(`Error ${status}: ${message}`);
      // Handle other HTTP errors (e.g., 404 Not Found)
    }
  } else if (error.request) {
    // The request was made but no response was received
    console.error('No response received from server');
  } else {
    // Something happened in setting up the request
    console.error('Request setup error:', error.message);
  }
};


export default ApiService;