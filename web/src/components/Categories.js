import React, { useEffect, useReducer, useState } from 'react';
import PropTypes from 'prop-types';
import history from './history';
import CategoryItem from './CategoryItem';
import { findBlobs } from '../blobs';

import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  wrapper: {
    display: 'flex',
    flexWrap: 'wrap',
    padding: [10, 20],
    justifyContent: 'left',
  }
});

export default function Categories() {
    const [categoryInformation, setCategoryInformation] = useState([]);

    const findCategories = async () => {
        var partialquery = "product = '' AND category > ''";
        // var partialquery = "product = ''";

        var result = await findBlobs(partialquery, true);
        // console.log(result);
        setCategoryInformation(result);
    }

    function getCategories () {
        return new Promise((resolve) => {
                resolve(
                    findCategories()
                )
        })
    }

    useEffect(() => {
        let mounted = true;
        getCategories()
        .then(data => {
          if(mounted && data) {
            setCategoryInformation(data)
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
            <h3>&nbsp;&nbsp;Categories</h3>

            <div className={classes.wrapper}>

                {categoryInformation.map(blob => (
                    <div key={blob.name} onClick={() => loadPage('/Products', blob.category)}>
                        <CategoryItem 
                            key={blob.name}
                            url={blob.url}
                            category={blob.category}
                        
                        />
                    </div>
                ))}
            </div>
        </div>
    )
}