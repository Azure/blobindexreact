import React, { useEffect, useReducer, useState } from 'react';
import history from './history';
import { useMsal } from "@azure/msal-react";

import { loadOrders } from '../blobs';
import ProductItem from './ProductItem';

import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: [10, 15],
        justifyContent: 'left',
      }
      });

function Order(){
    const [orders, setOrders] = useState([]);
    const { instance, accounts } = useMsal();

    const classes = useStyles();
        
    const findOrders = async () => {

        var result = await loadOrders(accounts[0]);
        console.log('result:');
        console.log(result);
        if (result != null && result.length > 0) 
        {
            // result.sort((a,b) => a.orderdate - b.orderdate);
            setOrders(result);
        }
    }

    function getOrders () {
        return new Promise((resolve) => {
                resolve(
                    findOrders()
                )
        })
    }

    useEffect(() => {
        let mounted = true;
        getOrders()
        .then(data => {
          if(mounted && data) {
            setOrders(data)
          }
        });
        return () => {
         mounted = false;
       }
      }, [])

      function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
      }

      function formatDate(date) {
        return (
          [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
          ].join('-') +
          ' ' +
          [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),
          ].join(':')
        );
      }
      
        
    return(
        <div className="Orders-main">
            <h3>&nbsp;&nbsp;Orders</h3>

            <div >
                {console.log(orders)}
                <div>

                    {orders
                    .sort((a, b) => a.orderdate < b.orderdate ? 1 : -1)
                    .map(order => (
                    <div key={order.orderdate}>
                        <h4>&nbsp;&nbsp;&nbsp;Order {formatDate(new Date(order.orderdate))}</h4>
                        <div className={classes.wrapper}>
                        {order.cart.map((blob, i) => (
                            <div key={i}>
                                <ProductItem 
                                    key={i}
                                    url={blob.url}
                                    product={blob.product}
                                    price={blob.price}
                                    />

                            </div>
                        ))}
                        </div>
                     </div>
                    ))}
                </div>  


            </div>            
            
        </div>
    );
}
export default Order;