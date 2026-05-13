
export function LocaleDateString(date) {
 
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

