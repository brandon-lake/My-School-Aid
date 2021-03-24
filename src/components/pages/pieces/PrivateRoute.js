import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { useAuth } from '../../../contexts/AuthContext';

/* This contains the private route functionality, to ensure the user must login/signup before using the site */
const PrivateRoute = ({ component: Component, ...restProps }) => {
    const { currentUser } = useAuth();

    return (
        <Route {...restProps} render={props => {
            return currentUser ? <Component {...props} /> : <Redirect to="/loginsignup" />
        }} />
    );
};

export default PrivateRoute;