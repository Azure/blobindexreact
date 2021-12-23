import React, { useContext } from 'react';
import history from './history';
import CartContext from './CartContext';

function CartSummary(){
    const cart = useContext(CartContext);
    // console.log(cart.cart.length);
    // console.log(cart);
    return(
        <div>
            Cart({cart.cart.length})
        </div>
    );
}
export default CartSummary;