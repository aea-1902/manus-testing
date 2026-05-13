export default function handler(req, res) {
    // Define your logic to generate the robots.txt content dynamically
    
    const AppSettings = require('../../settings/AppSetting').default

    let robotsTxt = `User-agent: *
Disallow: /`;

    if ((!AppSettings.API_URL.includes("writetextai-api-staging") && !AppSettings.API_URL.includes("writetextai-api-dev"))) {
        robotsTxt = ''
    }

    res.setHeader('Content-Type', 'text/plain')
    res.send(robotsTxt);
  }