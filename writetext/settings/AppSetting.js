const settings = {
    API_URL: process.env.REACT_APP_API_URL,
    CLIENT_URL: process.env.REACT_APP_CLIENT_URL,
    AUTH_URL: process.env.REACT_APP_AUTH_URL,
    AUTH_CLIENT_ID: "WriteTextAI.Backend",
    CHANGE_PASSWORD: process.env.REACT_APP_AUTH_CHANGEPW,
    CHANGE_EMAIL: process.env.REACT_APP_AUTH_CHANGEEMAIL,
    DISABLE_PAYPAL: process.env.DISABLE_PAYPAL,
    AUTH_STOR_KEY: `oidc.user:${process.env.REACT_APP_AUTH_URL}:WriteTextAI.Backend`,
    WAI_ADMIN: "Administrator",
    FACEBOOK_PIXEL: process.env.FACEBOOK_PIXEL,
    ENABLE_GA: process.env.ENABLE_GA,
    GOOGLE_ANALYTICS: "G-FX5HP5WYLJ",
};

export default settings;