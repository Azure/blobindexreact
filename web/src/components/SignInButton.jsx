import React from "react";
import { useMsal } from "@azure/msal-react";
// import { loginRequest } from "../authConfig";
import { storageRequest } from "../authConfig";
// import { managementRequest } from "../authConfig";
import { Link } from "react-router-dom";
import history from './history';

/**
 * Renders a drop down button with child buttons for logging in with a popup or redirect
 * 
 *         <DropdownButton variant="secondary" className="ml-auto" drop="left" title="Sign In">
            <Dropdown.Item as="button" onClick={() => handleLogin("popup")}>Sign in using Popup</Dropdown.Item>
            <Dropdown.Item as="button" onClick={() => handleLogin("redirect")}>Sign in using Redirect</Dropdown.Item>
        </DropdownButton>
        <button onClick={()=> handleLogin("redirect")} >Sign in</button>

 */
export const SignInButton = () => {
    const { instance, accounts } = useMsal();

    const handleLogin = async (loginType) => {
        if (loginType === "popup") {
            instance.loginPopup(storageRequest).catch(e => {
                console.log(e);
            });
        } else if (loginType === "redirect") {
            instance.loginRedirect(storageRequest).catch(e => {
                console.log(e);
            });
        }
    }

    return (
        <button type="button" className="btn btn-secondary" onClick={()=> handleLogin("popup")} >Sign in</button>
    )
}