import React, { useState, createContext, useContext, useReducer } from "react";
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from "@azure/msal-react";
// import { loginRequest } from "./authConfig";
import { PageLayout } from "./components/PageLayout";
// import { ProfileData } from "./components/ProfileData";
// import { callMsGraph } from "./graph";

import "./styles/App.css";
import CartContext from "./components/CartContext";

/**
 * Renders information about the signed-in user or a button to retrieve data about the user
 */
// const ProfileContent = () => {
//     const { instance, accounts } = useMsal();
//     const [graphData, setGraphData] = useState(null);

//     function RequestProfileData() {
//         // Silently acquires an access token which is then attached to a request for MS Graph data
//         instance.acquireTokenSilent({
//             ...storageRequest,
//             account: accounts[0]
//         }).then((response) => {
//             callMsGraph(response.accessToken).then(response => setGraphData(response));
//         });
//     }

//     return (
//         <>
//             <h5 className="card-title">Welcome {accounts[0].name}</h5>
//         </>
//     );
// };

/**
 * If a user is authenticated the ProfileContent component above is rendered. Otherwise a message indicating a user is not authenticated is rendered.
            <UnauthenticatedTemplate>
                <h5 className="card-title">Please sign-in to see your profile information.</h5>
            </UnauthenticatedTemplate>

*/
const MainContent = () => {    
    return (
        <div className="App">
            <AuthenticatedTemplate>
                {/* <ProfileContent /> */}
            </AuthenticatedTemplate>

        </div>
    );
};


function cartreducerold(state, item) {
    return [...state, item]
  }

  function cartreducer(state, action) {
    switch(action.type) {
      case 'add':
        return [...state, action.product];
      case 'remove':
        const productIndex = state.findIndex(item => item.name === action.product.name);
        if(productIndex < 0) {
          return state;
        }
        const update = [...state];
        update.splice(productIndex, 1)
        return update
    case 'clear':
        var clear = [...state];
        // console.log('before');
        // console.log(clear);
        clear = [];
        // console.log('after');
        // console.log(clear);

        return clear;
      default:
        return state;
    }
  }

  function totalreducer(state, action) {
    if(action.type === 'add') {
        return state + action.price;
      }
      return state - action.price
  }

//const CartContext = createContext();
//const cart = [];

export default function App() {
    const [cart, setCart] = useReducer(cartreducer, []);
    const [total, setTotal] = useReducer(totalreducer, 0);
    

    return (
        <CartContext.Provider value={{ cart, setCart}}>
            <PageLayout>
                {/* <MainContent /> */}
            </PageLayout>
        </CartContext.Provider>
    );
}
