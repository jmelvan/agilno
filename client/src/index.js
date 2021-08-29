import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Switch, Redirect } from "react-router-dom";
import Dashboard from './containers/dashboard';
import MyBets from './containers/mybets';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { history } from './helpers/history';
import { PrivateRoute } from './helpers/privateRoute';
import './scss/index.scss';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route exact path="/" component={Dashboard} />
          <PrivateRoute exact path="/my-bets" component={MyBets} />
          <Redirect from="*" to="/" />
        </Switch>
      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
