/*
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import React, { useState } from 'react';
import Navbar from "react-bootstrap/Navbar";
//import form from "react-bootstrap/form";
import history from './history';
import CartSummary from './CartSummary';
import Routes from './Routes';

import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";

/**
 * Renders the navbar component with a sign-in or sign-out button depending on whether or not a user is authenticated
 * @param props 
 */
export const PageLayout = (props) => {
    // const [searchstring, setSearchstring] = useState("");
    const isAuthenticated = useIsAuthenticated();

    // const handleInput = event => {
    //     setSearchstring(event.target.value);  
    // };

    const loadPage = (page, param) => {

console.log("param:" + param);


        history.push({
            pathname: page,
            // search: '?query=abc',
            state: { detail: param }
          });
    }


    return (
        <>
            <Navbar bg="secondary" variant="dark">
            {/* <Navbar bg="dark" variant="dark"> */}
                <a className="navbar-brand" onClick={() => history.push('/Categories')}>
                    <img src="./logo.png" width="100" />
                </a>
                <div className="navbar-nav">
                    <a className="nav-item nav-link" onClick={() => history.push('/About')} id="about">About</a>
                </div>
                <div className="navbar-nav ml-auto">
                    {/* <form className="form-inline"> */}
                        {/* { <input className="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search" id="searchstring" onChange={handleInput} /> } */}
                        {/* { <button className="btn btn-secondary my-2 my-sm-0" onClick={() => loadPage('/Products', searchstring)}>Search</button> } */}
                        { isAuthenticated ? <SignOutButton /> : <SignInButton /> }
                    {/* </form> */}
                </div>
                <div className="navbar-nav">
                    <a className="nav-item nav-link" onClick={() => history.push('/Cart')} id="about">
                        <CartSummary />
                    </a>
                </div>
            </Navbar>
            <br />
            <div className="maindiv">
                <Routes />            

                {props.children}
            </div>
        </>
    );
};
