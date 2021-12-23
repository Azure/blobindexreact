import React from 'react';
import history from './history';

import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    wrapper: {
        display: 'flex',
        flexWrap: 'wrap',
        padding: [10, 15],
        justifyContent: 'left',
      }
      });


function PaymentMethod(){
    const classes = useStyles();
        
    return(
        <div className="Payment-main">
            <h3>&nbsp;&nbsp;Payment methods</h3>
            <div className={classes.wrapper}>
                Card number
                Name on card
                Expiration date

            </div>            

        </div>
    );
}
export default PaymentMethod;