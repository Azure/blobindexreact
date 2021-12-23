import React from "react";
import { Router, Switch, Route } from "react-router-dom";
import Products from './Products';
import Categories from "./Categories";
import About from "./About";
import Cart from "./Cart";
import CartSummary from "./CartSummary";
import history from './history';
import ProductDetails from "./ProductDetails";
import Address from "./Address";
import Checkout from "./Checkout";
import PaymentMethod from "./PaymentMethod";
import Order from "./Order";

export default function Routes() {
        return (
                <Router history={history}>
                    <Switch>
                    <Route path="/" exact component={Categories} />
                        <Route path="/Categories" exact component={Categories} />
                        <Route path="/Products" exact component={Products} />
                        <Route path="/ProductDetails" exact component={ProductDetails} />
                        <Route path="/About" exact component={About} />
                        <Route path="/Cart" exact component={Cart} />
                        <Route path="/CartSummary" exact component={CartSummary} />
                        <Route path="/Address" exact component={Address} />
                        <Route path="/Checkout" exact component={Checkout} />
                        <Route path="/PaymentMethod" exact component={PaymentMethod} />
                        <Route path="/Order" exact component={Order} />
                    </Switch>
                </Router>
        )
    }
