//import Keycloak from 'keycloak-js';

export const keycloakConfig = {
    realm: (window._env_ && window._env_.REACT_APP_KEYCLOAK_REALM) || process.env.REACT_APP_KEYCLOAK_REALM,
    url: (window._env_ && window._env_.REACT_APP_KEYCLOAK_URL) || process.env.REACT_APP_KEYCLOAK_URL,
    clientId: (window._env_ && window._env_.REACT_APP_KEYCLOAK_CLIENTID) || process.env.REACT_APP_KEYCLOAK_CLIENTID
};

/* url: 'YOUR_KEYCLOAK_URL/auth',
    realm: 'YOUR_REALM',
    clientId: 'YOUR_CLIENT_ID',*/


//const keycloakInstance = new Keycloak(keycloakConfig);
export const SSO_REDIRECT_URI = (window._env_ && window._env_.REACT_APP_SSO_REDIRECT_URI) || process.env.REACT_APP_SSO_REDIRECT_URI || window.location.origin;

export const PRES_REQ_CONF_ID="verified-email";

export const SITEMINDER_LOGOUT = (window._env_ && window._env_.REACT_APP_SITEMINDER_LOGOUT) || process.env.REACT_APP_SITEMINDER_LOGOUT || "https://logon7.gov.bc.ca/clp-cgi/logoff.cgi";
