import React, { useEffect, useReducer, useState, useContext } from 'react';
import { useLocation } from "react-router-dom";
import history from './history';
import { useMsal } from "@azure/msal-react";
import { useIsAuthenticated } from "@azure/msal-react";

import { getdatetime, saveOrder } from '../blobs';
import CartContext from './CartContext';

import { storageRequest } from "../authConfig";

import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    wrapper: {
        flexWrap: 'wrap',
        padding: [10, 15],
        justifyContent: 'left',
      },
    wrapper2: {
      border: 'lightgrey solid 1px',
      margin: 10,
      padding: 20,
      position: 'relative',
      textAlign: 'center',
      textTransform: 'capitalize',
      width: 200,
    }
  });


const adresses = [
    {
        country: 'US', 
        fullname: 'Jane Doe', 
        phonenumber: '+654651321879132',
        addressline1: 'street123',
        addressline2: 'appt4', 
        city: 'Seattle', 
        state: 'WA', 
        zipcode: '98765'
    }
  ];

  const paymentmethods = [
    {
        cardnumber: '123456789',
        nameoncard: 'JD', 
        expirationdate: '202104'
    }
  ];

  const profile = JSON.stringify({adresses, paymentmethods});

function Checkout(){
    const { instance, accounts } = useMsal();
    const isAuthenticated = useIsAuthenticated();
    const classes = useStyles();
    const {cart, setCart} = useContext(CartContext);
    const [showMessage, setMessage] = React.useState(false)
    const [tokenData, setTokenData] = useState(null);

    const storeOrder = () => {
        const orderdate = new Date();

        const order = JSON.stringify({adresses, paymentmethods, cart, orderdate});
        console.log (order);

        saveOrder(accounts[0], order); 
  
        setCart({ order, type: 'clear' });
  
        setMessage(true);
    }
 
    const Message = () => (
        <div id="message" >
            Thank you for your order! :-) <br />
            <br />
            <button className='btn btn-secondary my-2 my-sm-0' onClick={() => history.push('/Order')}>View orders</button>
        </div>
    )

    const OrderDetails = () => (
        <div>
            <button className="btn btn-secondary my-2 my-sm-0" onClick={() => storeOrder()}>Order</button><br/>
            <div className={classes.wrapper2}>Address<br/></div>
            <div className={classes.wrapper2}>Paymentmethod<br/></div>
            <div className={classes.wrapper2}>Cart total<br/></div>
        </div>            

    )

    if (!isAuthenticated)
    {
        console.log('not auth');
        history.push('/');
        return null;
    }
        
    return(
        <div className="Checkout-main">
            <h3>&nbsp;&nbsp;Check out</h3>
            <div className={classes.wrapper}>
                <div>
                    { showMessage ? <Message /> : <OrderDetails /> }
                </div>
            </div>
        </div>
    );
}
export default Checkout;