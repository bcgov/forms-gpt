import Keycloak from 'keycloak-js';
import {keycloakConfig, SSO_REDIRECT_URI, PRES_REQ_CONF_ID, SITEMINDER_LOGOUT } from "../constants/keycloak";

const _kc = new Keycloak(keycloakConfig);


const loginOptions = {
    redirectUri: SSO_REDIRECT_URI,
    idpHint: '',
    pres_req_conf_id: PRES_REQ_CONF_ID,
};

export const initializeKeycloak = async () => {
    try {
        _kc.onTokenExpired = () => {
            _kc
                .updateToken(5)
                .then(function (refreshed) {
                    if (refreshed) {
                        console.log('Token was successfully refreshed');
                    } else {
                        console.log('Token is still valid');
                    }
                })
                .catch(function () {
                    console.log('Failed to refresh the token, or the session has expired');
                });
        };

        const auth = await _kc.init({
            pkceMethod: 'S256',
            checkLoginIframe: false,
            onLoad: 'check-sso',
        });

        if (auth) {
            return _kc;
        } else {
            if(loginOptions.pres_req_conf_id){
                let loginURL = _kc?.createLoginUrl(loginOptions);
                if(loginURL){
                    /* The keycloak-js library will not pass in the `pres_req_conf_id` needed for DC login
                    meaning the login url must have it appended.  */
                    // @ts-ignore//
                    window.location.href = loginURL + '&pres_req_conf_id=' + loginOptions.pres_req_conf_id;
                };
            } else {
                console.warn("DC needs a REACT_APP_PRES_REQ_CONF_ID env variable defined to work properly");
                _kc.login(loginOptions);
            }
        }
    } catch (err) {
        console.log(err);
    }
};

// since we have to perform logout at siteminder, we cannot use keycloak-js logout method so manually triggering logout through a function
// if using post_logout_redirect_uri, then either client_id or id_token_hint has to be included and post_logout_redirect_uri need to match
// one of valid post logout redirect uris in the client configuration
export const logout = () => {
    window.location.href = `${SITEMINDER_LOGOUT}?retnow=1&returl=${encodeURIComponent(
        `${keycloakConfig.url}/realms/${keycloakConfig.realm}/protocol/openid-connect/logout?post_logout_redirect_uri=` +
        SSO_REDIRECT_URI +
        '&id_token_hint=' +
        _kc.idToken,
    )}`;
};