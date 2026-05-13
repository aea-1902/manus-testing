import { UserManager, WebStorageStateStore } from 'oidc-client';
// import { useEffect } from 'react';
import { parseJwt } from '../utils/helper';
import {Storagekeys} from '../settings/StorageKeys';
class AuthenticationService {
    constructor() {
        const appSetting = require('../settings/AppSetting').default
        const settings = {
            authority: appSetting.AUTH_URL,
            client_id: appSetting.AUTH_CLIENT_ID,
            redirect_uri: `${appSetting.CLIENT_URL}signin-callback`,
            silent_redirect_uri: `${appSetting.CLIENT_URL}silent-callback`,
            post_logout_redirect_uri: appSetting.CLIENT_URL,
            scope: "openid profile Web Text",
            response_type: "id_token token",
            userStore: new WebStorageStateStore({ store: localStorage })
        }
        
        this.userManager = new UserManager(settings)
        this.userManager.events.addAccessTokenExpired(() => {
            this.logout();
        });
    }
    getUser = async () => {

            let user = await this.userManager.getUser();
            let loggedInUser = JSON.parse(sessionStorage.getItem(Storagekeys.LoggedInAs_Key));

            if (loggedInUser !== "undefined" && loggedInUser)
            {        
                let parsedUser = parseJwt(loggedInUser.access_token);
                parsedUser.profile = {};
                parsedUser.profile.sub = parsedUser.sub;
                parsedUser.profile.isCustomer = "true";
                parsedUser.profile.parentAcctId = user.profile.sub;
                parsedUser.access_token = loggedInUser.access_token;
                return parsedUser;
            }
            return user;
    }

    impersonated = async () => {
        let user = await this.userManager.getUser();
        return user;
    }

    login = async () => {
        return await this.userManager.signinRedirect();
    }

    loginCallback = () => {
        return this.userManager.signinRedirectCallback();
    }

    renewToken = () => {
        return this.userManager.signinSilent();
    }

    logout = async () => {
        let loggedInUser = JSON.parse(sessionStorage.getItem(Storagekeys.LoggedInAs_Key));

        if (loggedInUser !== "undefined" && loggedInUser)
        {   
            sessionStorage.removeItem(Storagekeys.LoggedInAs_Key);
            window.location.href = '/admin/loginas'
        }
        else
        {
            this.userManager.clearStaleState()
            this.userManager.removeUser()
            return await this.userManager.signoutRedirect();
        }
    }

}


let authenticationService = new AuthenticationService();
Object.freeze(authenticationService);
export default authenticationService;