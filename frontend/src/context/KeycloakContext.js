import React, { createContext, useState, useEffect } from 'react';
import Keycloak from "keycloak-js";

const KeycloakContext = createContext();

const KeycloakProvider = ({ children, kcConfig }) => {
    const [keycloak, setKeycloak] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const keycloakInstance = new Keycloak(kcConfig);

        keycloakInstance
            .init({
                onLoad: 'check-sso',
                promiseType: 'native',
                silentCheckSsoRedirectUri: window.location.origin + '/silent-check-sso.html',
                pkceMethod: 'S256',
                checkLoginIframe: false
            })
            .then((authenticated) => {
                setKeycloak(keycloakInstance);
                if (!authenticated && !keycloakInstance.token) {
                    keycloakInstance.login();
                }else {
                    setLoading(false);
                }
            })
            .catch(error => {
                console.error('Keycloak initialization error:', error);
                setLoading(false);
            });
    }, [kcConfig]);

    useEffect(() => {
        const checkTokenInterval = setInterval(() => {
            if (keycloak && keycloak.token) {
                keycloak.updateToken(60)
                    .then(refreshed => {
                        if (refreshed) {
                            console.log('Token refreshed');
                        }/* else {
                            console.warn('Token not refreshed');
                        }*/
                    })
                    .catch(error => {
                        console.error('Failed to refresh token:', error);
                    });
            }
        }, 10000);

        return () => clearInterval(checkTokenInterval);
    }, [keycloak]);

    const logout = () => {
        if (keycloak) {
            localStorage.clear();
            sessionStorage.clear();
            keycloak.logout();
        }
    };

    const getToken = () => keycloak?.token;

    return (
        <KeycloakContext.Provider value={{ keycloak, logout, getToken }}>
            {loading ? <div>Loading...</div> : children}
        </KeycloakContext.Provider>
    );
};

export { KeycloakProvider, KeycloakContext };
