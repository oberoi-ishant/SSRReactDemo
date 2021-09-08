import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../client/reducers/index';
import axios from 'axios';


export default (req) => {

  /**
   * Server side call. No proxy involved from index.js.
   */
  const axiosInstance = axios.create({
    baseURL: 'https://react-ssr-api.herokuapp.com',
    headers: {
      // if req has cookies send it, else empty string. Undefined cookie value in header will
      // crash the request.
      cookie: req.get('cookie') || ''
    }
  });

  const store = createStore(
    reducers,
    {},
    applyMiddleware(thunk.withExtraArgument(axiosInstance)));

  return store;
};