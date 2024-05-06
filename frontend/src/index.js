import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@formio/js/dist/formio.full.min.css';
import {BrowserRouter} from "react-router-dom";
import {KeycloakProvider} from "./context/KeycloakContext";
import keycloakConfig from "./constants/keycloak";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
      <BrowserRouter>
          <KeycloakProvider kcConfig={keycloakConfig}>
            <App />
          </KeycloakProvider>
      </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
