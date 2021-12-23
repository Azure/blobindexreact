import React, { useEffect, useReducer, useState, useContext } from 'react';
import { useLocation } from "react-router-dom";
import PropTypes from 'prop-types';
import history from './history';
import CartContext from './CartContext';

import { useMsal } from "@azure/msal-react";

import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  wrapper: {
    // display: 'flex',
    flexWrap: 'wrap',
    padding: [0, 20],
    justifyContent: 'left',
  }
});

// const reducer = key => key + 1;

export default function ProductDetails(){
    const [productInformation, setProductInformation] = useState([]);
    const {setCart} = useContext(CartContext);
    const location = useLocation();
    const classes = useStyles();
    const [showMessage, setMessage] = React.useState(false)
    var blob = [];

    useEffect(() => {
        // console.log(location.pathname); // result: '/secondpage'
        // console.log(location.search); // result: '?query=abc'
        if (location.state)
        {
            // console.log(location.state.detail); // result: 'some_value'
            blob = location.state.detail;
        }
        else
            console.log('state is null'); 

        if (productInformation && productInformation.length > 0)
             console.log(productInformation);
        else
        {
            // console.log('productInformation is null or empty');   
            setProductInformation([blob]);
        }

      }, [])

    // const addCart = (item) => {
    //     setCart(item);
    //     // setCart({cart: item, total: item.price});
    //     setMessage(true);
    // }

    function add(product) {
        setCart({ product, type: 'add' });
        setMessage(true);
      }
    
      function remove(product) {
        setCart({ product, type: 'remove' });
      }

    const Message = () => (
        <div className={classes.wrapper} id="message" >
            <br />
            <div>The item was added to your cart.</div>
            <div>
                <button className='btn btn-secondary my-2 my-sm-0' onClick={() => history.push('/Cart')}>View cart</button>
            </div>
        </div>
    )

    return(
        <div className="ProductDetails-main">
            <div className={classes.wrapper}>

                {productInformation.map(blob => (
                    // <div key={blob.name} onClick={() => add(blob)}>
                    <div key={blob.name} >
                        <h3>{blob.product}</h3>

                        <span className={classes.image} role="img" aria-label={blob}>
                            <img src={blob.url} width="320" />
                        </span>
                        <br />
                        $ {blob.price} 
                        <br />
                        {blob.description}
                        <br />
                        <button className="btn btn-secondary my-2 my-sm-0" onClick={() => add(blob)}>Add to cart</button>
                    </div>

                ))}
            </div>
            { showMessage ? <Message /> : null }
        </div>
    );
}