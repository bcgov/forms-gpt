//import Keycloak from 'keycloak-js';

const keycloakConfig = {
    realm: (window._env_ && window._env_.REACT_APP_KEYCLOAK_REALM) || process.env.REACT_APP_KEYCLOAK_REALM,
    url: (window._env_ && window._env_.REACT_APP_KEYCLOAK_URL) || process.env.REACT_APP_KEYCLOAK_URL,
    clientId: (window._env_ && window._env_.REACT_APP_KEYCLOAK_CLIENTID) || process.env.REACT_APP_KEYCLOAK_CLIENTID
};

/* url: 'YOUR_KEYCLOAK_URL/auth',
    realm: 'YOUR_REALM',
    clientId: 'YOUR_CLIENT_ID',*/


//const keycloakInstance = new Keycloak(keycloakConfig);

export default keycloakConfig;