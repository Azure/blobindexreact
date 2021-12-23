import React, { useEffect, useReducer, useState, Component } from 'react';
import { useLocation } from "react-router-dom";

import PropTypes from 'prop-types';
import history from './history';
import { findBlobs } from '../blobs';
import ProductItem from './ProductItem';

import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: [10, 20],
    justifyContent: 'left',
  }
});

export default function Products() {
    const [productInformation, setProductInformation] = useState([]);
    const location = useLocation();

    var filter = "";
    if (location && location.state ) filter = location.state.detail;

    const findProducts = async (categoryname) => {
        var partialquery = "product > '' AND category = '" + categoryname + "'";

        var result = await findBlobs(partialquery, true);
        setProductInformation(result);
    }

    function getProducts (categoryname) {
        return new Promise((resolve) => {
                resolve(
                    findProducts(categoryname)
                )
        })
    }

    useEffect(() => {
        // console.log('filter=' + filter);

        let mounted = true;
        if (location && location.state ) filter = location.state.detail;
        // console.log('filter=' + filter);

        getProducts(filter)
        .then(data => {
          if(mounted && data) {
            setProductInformation(data)
          }
        });
        return () => {
         mounted = false;
       }
      }, [])

    const loadPage = (page, param) => {

        history.push({
            pathname: page,
            // search: '?query=abc',
            state: { detail: param }
          });
    }


    const classes = useStyles();

    return(
        <div>            
            <h3>&nbsp;&nbsp;{filter} bikes</h3>

            <div className={classes.wrapper}>
                {productInformation.map(blob => (
                    <div key={blob.name} onClick={() => loadPage('/ProductDetails', blob)}>
                        <ProductItem 
                            key={blob.name}
                            url={blob.url}
                            product={blob.product}
                            price={blob.price}
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}