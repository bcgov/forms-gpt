import React, {createContext, useCallback, useEffect, useState} from 'react';
import { Routes, Route } from 'react-router-dom';
import FormCreator from './components/FormCreator';
import FormList from './components/FormList';
import { FormProvider } from './context/FormContext';
import NavbarComponent from "./components/NavbarComponent";
import FormViewUpdate from './components/FormViewUpdate';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css";
import FormSubmissionPage from "./components/FormSubmissionPage";
import {BrowserRouter} from "react-router-dom";

import {initializeKeycloak} from "./services/keycloakUserService";

export const AuthenticationContext = createContext('authentication');


function App() {
    const [keycloak, setKeycloak] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const initKeycloak = useCallback(async () => {
        const _keycloak = await initializeKeycloak();
        setIsAuthenticated(_keycloak.authenticated);
        setKeycloak(_keycloak);
    }, []);

    useEffect(() => {
        initKeycloak();
    }, [initKeycloak]);

    return (

        <>
            {isAuthenticated && (
                <AuthenticationContext.Provider value={keycloak}>
                    <BrowserRouter>
                    <FormProvider>
                        <NavbarComponent/>
                        <Routes>
                            <Route path="/" element={<FormList />} />
                            <Route path="/create" element={<FormCreator />} />
                            <Route path="/form/:formIndex" element={<FormViewUpdate />} />
                            <Route path="/form/submit/:formIndex" element={<FormSubmissionPage />} />
                        </Routes>
                    </FormProvider>
                    </BrowserRouter>
                </AuthenticationContext.Provider>
            )}
        </>
    );
}

export default App;
