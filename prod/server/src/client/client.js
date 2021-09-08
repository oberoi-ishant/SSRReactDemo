/** Startup point for the client application */

import 'babel-polyfill'; // for async-await--generatorRuntime is not defined
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import axios from 'axios';
import { Provider } from 'react-redux';
import reducers from './reducers/index';
import { renderRoutes } from 'react-router-config';
import Routes from './Routes';

const axiosInstance = axios.create({
  baseURL: '/api',
});

const store = createStore(
  reducers,
  window.INITIAL_SERVER_STATE,
  applyMiddleware(thunk.withExtraArgument(axiosInstance))); // This now automatically passes axiosInstance in all thunk calls...like it passes dispatch and getState.

ReactDOM.hydrate(
  <Provider store={ store }>
    <BrowserRouter>
      <div>{ renderRoutes(Routes) }</div>
    </BrowserRouter>
  </Provider>, document.getElementById('my-app-id'));
