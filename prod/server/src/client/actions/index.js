// import axios from 'axios';

export const FETCH_USERS = 'fetch_users';

/**
 * Use of Proxy to authenticaye user.
 *
 * In SSR the first call to fetch data will be made via server (express render server).
 * Browser will just make a GET call to localhost:3000 - '/' or http://my.app.com/ route with all cookies.
 *
 * Browser app is hosted on say my.app.com. And API server is running at https://react-ssr-api.herokuapp.com.
 * So cookie will be set based on DOMAIN.
 * So during SSR we will pluck the cookie set in GET call http://my.app.com/ in initial load and
 * manually attach it to the fetch data call using custom axiosInstance in
 * prod/server/src/helpers/createStore.js
 * This way api server will be tricked and will think call is legitimate and from broswer (not from render server) as it has cookie.
 * It will validate the cookie against http://my.app.com/ and send the response.
 *
 * For client side rendering.
 * For follow up ajax requests, after intial load, browser http://my.app.com/ will make api calls via proxy set up in index.js and this will directly pass all cookies with the incoming browser request to the
 *  api server https://react-ssr-api.herokuapp.com and requests will be authenticated against http://my.app.com/ as we proxy/forward all /api request to api server.
 *
 */


/**
 * api is basically the axiosInstance passed by thunk withExtrargument.
 * Check Client.js and prod/server/src/helpers/createStore.js
 * Depending on, if it is called during server phase in initial load
 * or client phase as an ajax call after intial load is done as a follow up request.
 * It is know the base url and have the cookies values.
 * For server side rendering we have manually attached cookies to directly call
 * https://react-ssr-api.herokuapp.com.
 * for browser ajax call it will automatically have cookies and will be
 * passed to api server via proxy.
 */
export const fetchUsers = () => async (dispatch, getState, api) => {
  // const res = await api.get('http://react-ssr-api.herokuapp.com/users');
  /**
   * Custom axiosInstance with append /api to url /api/users then proxy in index.js will
   * forward request to http://react-ssr-api.herokuapp.com
   */
  const res = await api.get('/users');
  // console.log('Statewaaaaa', getState());
  dispatch({
    type: FETCH_USERS,
    payload: res
  });
}

// export const fetchUsers = () => dispatch => {
//   return axios.get('http://react-ssr-api.herokuapp.com/users').then(res => {
//     console.log(res);
//     dispatch({
//       type: FETCH_USERS,
//       payload: res
//     });
//   });
// }

// export const fetchUsers = () => dispatch => {
//   console.log('dispatch'. dispatch);
//   dispatch({
//     type: FETCH_USERS,
//     payload:  { data: [{ 'name': 'ishant', id: '123' }] }
//   });
// }

export const FETCH_CURRENT_USER = 'fetch_current_user';
export const fetchCurrentUser = () => async (dispatch, getState, api) => {
  // const res = await api.get('http://react-ssr-api.herokuapp.com/users');
  /**
   * Custom axiosInstance with append /api to url /api/users then proxy in index.js will
   * forward request to http://react-ssr-api.herokuapp.com
   */
  const res = await api.get('/current_user');
  // console.log('Statewaaaaa', getState());
  dispatch({
    type: FETCH_CURRENT_USER,
    payload: res
  });
}


export const FETCH_ADMINS = 'fetch_admins';
export const fetchAdmins = () => async (dispatch, getState, api) => {
  // const res = await api.get('http://react-ssr-api.herokuapp.com/users');
  /**
   * Custom axiosInstance with append /api to url /api/users then proxy in index.js will
   * forward request to http://react-ssr-api.herokuapp.com
   */
  const res = await api.get('/admins');
  // console.log('Statewaaaaa', getState());
  dispatch({
    type: FETCH_ADMINS,
    payload: res
  });
}
