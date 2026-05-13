/** @type {import('next').NextConfig} */
const {
  PHASE_DEVELOPMENT_SERVER,
  PHASE_PRODUCTION_BUILD
} = require('next/constants')

module.exports = (phase) => {
  const isDev = phase === PHASE_DEVELOPMENT_SERVER
  
  const isProd = phase === PHASE_PRODUCTION_BUILD

  const env = {
    REACT_APP_API_URL: process.env.REACT_APP_API_URL,
    REACT_APP_CLIENT_URL: process.env.REACT_APP_CLIENT_URL,
    REACT_APP_AUTH_URL: process.env.REACT_APP_AUTH_URL,
    REACT_APP_AUTH_CHANGEPW: process.env.REACT_APP_AUTH_CHANGEPW,
    REACT_APP_AUTH_CHANGEEMAIL: process.env.REACT_APP_AUTH_CHANGEEMAIL,
    REACT_APP_CLIENT_ID: 'WriteTextAI.Backend',
    DISABLE_PAYPAL: process.env.DISABLE_PAYPAL,
    FACEBOOK_PIXEL: process.env.FACEBOOK_PIXEL,
    ENABLE_GA: process.env.ENABLE_GA,
    GOOGLE_ANALYTICS: process.env.GOOGLE_ANALYTICS,

  }
  const { i18n } = require('./next-i18next.config')
  return {
    env,
    reactStrictMode: false,
    i18n,
    images: {
      domains: ['writetextaistorage.z6.web.core.windows.net']
    },
    rewrites: async () => {
      return [
        {
          source: '/home',
          destination: '/Home',
        },
        {
          source: '/account',
          destination: '/Account',
        },
        {
          source: '/billing',
          destination: '/Billing',
        },
        {
          source: '/premium',
          destination: '/Premium',
        },
        {
          source: '/payments',
          destination: '/Payments',
        },
        {
          source: '/webshops',
          destination: '/Webshops',
        },
        {
          source: '/reports',
          destination: '/Reports',
        },
        {
          source: '/reports/historylogs/:path*',
          destination: '/Reports/HistoryLogs/:path*',
        },
        {
          source: '/audit',
          destination: '/Audit',
        },
        {
          source: '/plugins',
          destination: '/Plugins',
        },
        {
          source: '/downloads',
          destination: '/Downloads',
        },
        {
          source: '/wizard',
          destination: '/Wizard',
        },
        {
          source: '/welcome',
          destination: '/Welcome',
        },
        {
          source: '/privacy',
          destination: '/Privacy',
        },
        {
          source: '/terms',
          destination: '/Terms',
        },
        {
          source: '/cookie',
          destination: '/Cookie',
        },
        {
          source: '/suppliers',
          destination: '/Suppliers',
        },
        {
          source: '/privacy/policy',
          destination: '/Privacy/Policy',
        },
        {
          source: '/terms/policy',
          destination: '/Terms/Policy',
        },
        {
          source: '/cookie/policy',
          destination: '/Cookie/Policy',
        },
        {
          source: '/refund',
          destination: '/Refund',
        },
        {
          source: '/installationservice',
          destination: '/InstallationService',
        },
        {
          source: '/cancellationsurvey',
          destination: '/CancellationSurvey',
        },
        {
          source: '/admin/loginas',
          destination: '/Admin/LoginAs',
        },
        {
          source: '/admin/promptsetting',
          destination: '/Admin/PromptSetting',
        },
        {
          source: '/admin/textservers',
          destination: '/Admin/TextServers',
        },
        {
          source: '/admin/email/:slug*',
          destination: '/Admin/Email/:slug*',
        },
        {
          source: '/downloads/:slug*',
          destination: '/Downloads/:slug*',
        },
        {
          source: '/extensions',
          destination: '/Extensions',
        },
        {
          source: '/robots.txt',
          destination: '/api/robots'
        },
        {
          source: '/api-keys',
          destination: '/Api-Keys',
        },
        {
          source: '/email-notifications',
          destination: '/Email-Notifications',
        },
        {
          source: '/unsubscribe',
          destination: '/Unsubscribe',
        },
        {
          source: '/templates', 
          destination: '/Templates',
        },
        {
          source: '/keyword',
          destination: '/Keyword',
        },
        {
          source: '/keyword/settings',
          destination: '/Keyword/Settings',
        },
        {
          source: '/Keyword/Report/:path*',
          destination: '/Keyword/Report/:path*',
        },

        {
          source: '/templates/add',
          destination: '/Templates/add',
        },
        {
          source: '/templates/edit/:path*',
          destination: '/Templates/edit/:path*',
        },
        {
          source: '/templates/master/:path*',
          destination: '/Templates/master/:path*',
        },
      ]
    }
  }
}
// const nextConfig = {
// }

// module.exports = nextConfig

// module.exports = {
//   async rewrites() {
//     return [
//       {
//         source: '/api/:path*',
//         destination: 'http://localhost:4000/:path*'
//       }
//     ]
//   }
// }
