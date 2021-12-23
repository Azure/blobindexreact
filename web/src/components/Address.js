import React, { useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import history from './history';
import { useMsal } from "@azure/msal-react";

import { loadAddresses } from '../blobs';

import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: [10, 15],
        justifyContent: 'left',
      }
      });


function Address(){
    const [addresses, setAddresses] = useState([]);
    const { instance, accounts } = useMsal();

    const classes = useStyles();

    const findAddresses = async () => {

        var result = await loadAddresses(accounts[0]);
// console.log(result);
var temp = JSON.parse(result);
// console.log(temp);

        setAddresses(temp);
    }

    function getAddresses () {
        return new Promise((resolve) => {
                resolve(
                    findAddresses()
                )
        })
    }

    useEffect(() => {
        let mounted = true;
        getAddresses()
        .then(data => {
          if(mounted && data) {
            setAddresses(data)
          }
        });
        return () => {
         mounted = false;
       }
      }, [])

        
    return(
        <div className="Address-main">
            <h3>&nbsp;&nbsp;Addresses</h3>

            <div className={classes.wrapper}>
                { console.log(addresses)}
                <div>

                    {addresses.map(address => (
                    <div >
                        {address.fullname}
                        <br />
                        {address.addressline1}
                        <br />
                        {address.addressline2}
                        <br />
                        {address.city}
                        <br />
                        {address.state}
                        <br />
                        {address.country}
                        <br />
                        {address.zipcode}
                        <br />
                        {address.phonenumber}
                        <br />
                        {/* <button className="btn btn-secondary my-2 my-sm-0" onClick={() => remove(address)}>Remove</button> */}
                    </div>
                    ))}
                </div>


            </div>            
            
        </div>
    );
}
export default Address;