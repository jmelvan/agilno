import React from 'react';
import ReactDOM from 'react-dom';
import { Router } from "react-router-dom";
import Dashboard from './containers/dashboard';
import { store } from './app/store';
import { Provider } from 'react-redux';
import { history } from './helpers/history';
import './scss/index.scss';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <Router history={history}>
        <Dashboard />

      </Router>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
