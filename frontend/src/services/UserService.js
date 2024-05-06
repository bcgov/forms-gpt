/* istanbul ignore file */
import {
    ROLES,
    USER_RESOURCE_FORM_ID,
    Keycloak_Client,
    ANONYMOUS_USER,
    ANONYMOUS_ID,
    FORMIO_JWT_SECRET
} from "../constants/constants";


import keycloakInstance from "../constants/keycloak";


/**
 * Initializes Keycloak instance and calls the provided callback function if successfully authenticated.
 *
 * @param onAuthenticatedCallback
 */


const initKeycloak = ( ...rest) => {
    const done = rest.length ? rest[0] : () => {};
    KeycloakData
        .init({
            onLoad: "check-sso",
            promiseType: "native",
            silentCheckSsoRedirectUri:
                window.location.origin + "/silent-check-sso.html",
            pkceMethod: "S256",
            checkLoginIframe: false
        })
        .then((authenticated) => {
            if (authenticated) {
                //Todo
            } else {
                console.warn("not authenticated!");
                doLogin();
            }
        });
};
let refreshInterval;
const refreshToken = () => {
    refreshInterval = setInterval(() => {
        KeycloakData && KeycloakData.updateToken(5).then((refreshed)=> {
            if (refreshed) {
               //token refreshed
            }
        }).catch( (error)=> {
            console.log(error);
            userLogout();
        });
    }, 6000);
}


/**
 * Logout function
 */
const userLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    clearInterval(refreshInterval);
    doLogout();
};

const KeycloakData= keycloakInstance;

const doLogin = KeycloakData.login;
const doLogout = KeycloakData.logout;
const getToken = () => KeycloakData.token;

const UserService ={
    initKeycloak,
    userLogout,
    getToken
};

export default UserService;
