
const customEvents = {
    // Add custom events here
    1000: "Purchase_1000",
    200: "Purchase_200",
    5000:"Purchase_5000",
    InstallationService:"Purchase_Installation_Service",
    Monthly: "Purchase_Monthly",
    Yearly: "Purchase_Yearly",
};
export const event = (action , params ) => {
    const customEvent = customEvents[action];
    window.gtag('event', customEvent, params)
}