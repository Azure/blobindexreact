import React, {useState, createContext, useContext}  from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router } from 'react-router-dom';

import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/index.css";
import App from "./App.jsx";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import { msalConfig } from "./authConfig";

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.render(
    <React.StrictMode>
        <MsalProvider instance={msalInstance}>
            <App />
        </MsalProvider>
    </React.StrictMode>,
    document.getElementById("root")
);
