import { NextResponse } from 'next/server'

// Map of lowercase paths to their proper case-sensitive paths
const pathMap = {
  'home': '/Home',
  'account': '/Account',
  'billing': '/Billing',
  'premium': '/Premium',
  'payments': '/Payments',
  'webshops': '/Webshops',
  'reports': '/Reports',
  'reports/historylogs': '/Reports/HistoryLogs',
  'audit': '/Audit',
  'plugins': '/Plugins',
  'downloads': '/Downloads',
  'wizard': '/Wizard',
  'welcome': '/Welcome',
  'privacy': '/Privacy',
  'terms': '/Terms',
  'cookie': '/Cookie',
  'suppliers': '/Suppliers',
  'privacy/policy': '/Privacy/Policy',
  'terms/policy': '/Terms/Policy',
  'cookie/policy': '/Cookie/Policy',
  'refund': '/Refund',
  'installationservice': '/InstallationService',
  'cancellationsurvey': '/CancellationSurvey',
  'admin/loginas': '/Admin/LoginAs',
  'admin/promptsetting': '/Admin/PromptSetting',
  'admin/textservers': '/Admin/TextServers',
  'extensions': '/Extensions',
  'api-keys': '/Api-Keys',
  'email-notifications': '/Email-Notifications',
  'unsubscribe': '/Unsubscribe',
  'templates': '/Templates',
  'keyword': '/Keyword',
  'keyword/settings': '/Keyword/Settings',
  'keyword/report': '/Keyword/Report',
  'robots.txt': '/api/robots'
}

export function middleware(request) {
  const { pathname, search } = request.nextUrl
  const cleanPath = pathname.replace(/^\/+/, '').toLowerCase()


  if (pathMap[cleanPath]) {
    const newUrl = new URL(request.url)
    newUrl.pathname = pathMap[cleanPath]
    return NextResponse.rewrite(newUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths except static files and API routes
    '/((?!api|_next|images|silent-callback|favicon|.*\\..*).*)',
  ],
}