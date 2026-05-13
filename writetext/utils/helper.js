export function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};

export function isValidUrl(str) {
    try {
        // Add http:// if no protocol is specified
        if (!str.startsWith('http://') && !str.startsWith('https://')) {
            str = 'http://' + str;
        }
        const url = new URL(str);
        return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
        return false;
    }
}

export function addHttps(url) {
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        return 'https://' + url;
    }
    return url;
}

export function formatTrialDate(date) {
    const d = new Date(date)
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    };
    const formattedDate = d.toLocaleDateString('en-US', options);
    return formattedDate
}

export function formatCreditsDisplay(credits) {
    //add commas to the number
    return credits.toLocaleString('en-US')
}