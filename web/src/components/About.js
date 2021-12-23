import React from 'react';

import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
    wrapper: {
        flexWrap: 'wrap',
        padding: [10, 15],
        justifyContent: 'left',
      }
      });

function About(){
    const classes = useStyles();
        
    return(
        <div className="About-main">
            <div className={classes.wrapper}>
                <img src="./adventureworks.png" width="300" />
                <br />
                <br />
                <h3>AdvenureWork cycles</h3>
                This is an application development sample in React to help Azure customers work with blob storage, tags, index, Azure active directory, role-based access control, and event handlers using Event Grid and Azure Functions.
                <br />

            </div>            
        </div>
    );
}
export default About;