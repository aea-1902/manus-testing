import React from 'react'
import { useRouter } from 'next/router'

const Content = ({children, backgroundclass}) => {
  const router = useRouter();
  let route = null;
  switch (router.route)
  {
    case '/Account':
      route = "account";
      break;
    case '/Premium':
      route = "premium";
      break;
    case '/Home':
      route = "home";
      break;
    case '/Billing':
      route = "billing";
      break;
    case '/Invoices':
      route = "invoices";
      break;
    case '/Webshops':
      route = "webshops";
      break;
    case '/Reports':
      route = "reporting";
      break;
    case '/Reports/HistoryLogs':
      route = "history-logs"
      break;
    case '/Audit':
      route = "audit-logs"
      break;
    case '/Plugins':
      route = "plugins"
      break;
    case '/Extensions':
      route = "extensions"
      break;
    case '/Wizard':
      route = "wizard"
      break;
    case '/Welcome':
      route = "welcome"
      break;
      case '/Downloads':
        route = "downloads"
        break;
    case '/Admin/TextServers':
      route = "textservers"
      break;
    case '/Admin/LoginAs':
      route = "loginas"
      break;
    case '/Admin/PromptSetting':
      route = "promptsetting"
      break;
    case '/Api-Keys':
      route = "api-keys"
      break;
    case '/Templates':
      route = "templates"
      break;
    case '/Templates/add':
      route = "templates"
      break;
    case '/Templates/edit/[templateType]/[id]':
          route = "templates"
          break;
    case '/Templates/master/[templateType]/[id]':
      route = "templates"
      break;
    case '/Templates/master/[templateType]/preview/[id]':
      route = "templates"
      break;
    case '/Keyword':
      route = "keyword"
      break;
    case '/Keyword/Settings':
      route = "keyword"
      break;
    case '/Keyword/Report':
      route = "keyword"
      break;
    case '/Payments':
      route = "payments"
      break;
    case '/InstallationService':
      route = "installation"
      break;
    case '/Email-Notifications':
      route = "email-notifications"
      break;
    case '/CancellationSurvey':
      route = "cancellationsurvey"
      break;
  }
  return (
      <div id='main-container' className={`main-container ${backgroundclass != undefined ? backgroundclass : ''}  ${route} ${route == "welcome" ? 'w-100 mw-100 m-0' : ''}  ${route == "wizard" ? `scrollable-container` : ''}`}>
          {children}
      </div>
  )
}

export default Content
