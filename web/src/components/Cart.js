import React, { useContext, useState } from 'react';
import { createUseStyles } from 'react-jss';
import CartContext from './CartContext';
import history from './history';
import ProductItem from './ProductItem';

import { useIsAuthenticated } from "@azure/msal-react";
import { SignInButton } from "./SignInButton";

const useStyles = createUseStyles({
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: [10, 20],
    justifyContent: 'left',
  }
  });


export default function Cart () {
    const cart = useContext(CartContext);
    const isAuthenticated = useIsAuthenticated();
    const classes = useStyles();
    const {setCart} = useContext(CartContext);

    function add(product) {
        setCart({ product, type: 'add' });
    }

    function remove(product) {
        setCart({ product, type: 'remove' });
    }

    function ShowCheckout(){
        console.log("cart.cart.length:");
        console.log(cart.cart.length);
        if (cart.cart.length > 0) {
        return (
            <div>
                <button className="btn btn-secondary my-2 my-sm-0" onClick={() => history.push('/Checkout')}>Check out</button><br />
                These items are in your shopping cart:
            </div>
            );
        }
        else
        {
            return (
                <div>
                    <button className="btn btn-secondary my-2 my-sm-0" onClick={() => history.push('/Categories')}>Browse catalog</button><br />
                    There are no items in your shopping cart.
                </div>
                );
        }
    }


    return(
        <div className="Cart-main">
            <h3>&nbsp;&nbsp;Cart</h3>

            <div className={classes.wrapper}>
                <div>
                    { isAuthenticated ? ShowCheckout() : <SignInButton /> }

{/* { console.log(cart)} */}

                    {cart.cart.map((blob, i) => (
                    <div key={i}>
                        <ProductItem 
                        key={i}
                        url={blob.url}
                        product={blob.product}
                        price={blob.price}
                        />
                        <button className="btn btn-secondary my-2 my-sm-0" onClick={() => remove(blob)}>Remove</button>
                    </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
