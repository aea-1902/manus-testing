export function getLocaleFromBrowser() {
    if (process.browser) {
      // Get the user's preferred language from the browser
      const userLanguage = navigator.language || navigator.userLanguage;
  
      // You might want to normalize the user's language to match your locales
      // For example, convert "en-US" to "en"
      const normalizedLanguage = userLanguage.split('-')[0];
  
      // Return the normalized language or a default if it's not supported
      return normalizedLanguage;
    }
  
    // If not in the browser, return a default locale
    return 'en'; // Change this to your default locale
  }
  