import React, { useState} from "react";
import { useMsal } from "@azure/msal-react";
import DropdownButton from "react-bootstrap/DropdownButton";
import Dropdown from "react-bootstrap/esm/Dropdown";
import history from './history';
import { ensureProfile } from "../blobs";
import { storageRequest } from "../authConfig";

export const SignOutButton = () => {
    const { instance, accounts } = useMsal();
    const [profile, setProfile] = useState(null);

    const handleLogout = (logoutType) => {
        if (logoutType === "popup") {
            instance.logoutPopup({
                postLogoutRedirectUri: "/",
                mainWindowRedirectUri: "/"
            });
        } else if (logoutType === "redirect") {
            instance.logoutRedirect({
                postLogoutRedirectUri: "/",
            });
        }
    }

    const ensureProfileContainer = (accounts) => {

        // TODO: Caching when the container is available
        // if (!profile) {
        //     console.log("!profile");
            instance.acquireTokenSilent({
                ...storageRequest,
                account: accounts[0],
                forceRefresh: true
            }).then((response) => {
                ensureProfile(accounts[0]).then(response => setProfile(response));
            });
        // }

    }


    // Make sure a storage container for the user exists
    ensureProfileContainer(accounts);
    // Note: this fires twice in dev with strictmode. Strictmode is preferred so ignoring. 

    return (
                // <button onClick={()=> handleLogout("redirect")} >Sign out</button>
                <div className="navbar-nav ml-auto">
                   {/* <a className="nav-item nav-link">Hi {accounts[0].name}.</a>
                    <a className="nav-item nav-link" onClick={()=> handleLogout("redirect")}>Sign out</a> */}

                    <DropdownButton variant="secondary" className="ml-auto" title={accounts[0].name}>
                        {/* <Dropdown.Item as="button" onClick={() => history.push('/Address')}>Addresses</Dropdown.Item> */}
                        {/* <Dropdown.Item as="button" onClick={() => history.push('/PaymentMethod')}>Payment methods</Dropdown.Item> */}
                        <Dropdown.Item as="button" onClick={() => history.push('/Order')}>Orders</Dropdown.Item>
                        <Dropdown.Item as="button" onClick={() => handleLogout("popup")}>Sign out</Dropdown.Item>
                    </DropdownButton>

                </div>
    )
}