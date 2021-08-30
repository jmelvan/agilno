import React from 'react';
import { Route, Redirect } from 'react-router-dom';

export const PrivateRoute = ({ component: Component, roles, forbidAdmin, login, ...rest }) => (
    <Route {...rest} render={props => {
        const currentUser = JSON.parse(localStorage.getItem('user'));
        
        // not logged in so redirect to login page with the return url
        if (login && login == "required" && !currentUser)
            return <Redirect to={{ pathname: '/', state: { from: props.location } }} />

        // check if route is restricted by role
        if(roles && roles.indexOf(currentUser.role) === -1)
            return <Redirect to={{ pathname: '/'}} />

        // admin can't place bets
        if(forbidAdmin && currentUser && currentUser.role == 'admin') 
            return <Redirect to={{ pathname: '/admin'}} />

        // authorised, so return component
        return <Component {...props} />
    }} />
)