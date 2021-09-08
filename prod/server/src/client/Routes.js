/**
 * used for api data
 * https://react-ssr-api.herokuapp.com/
 */

import React from 'react';
// import { Route } from 'react-router-dom';
import App from './App';
import HomePage from './pages/HomePage';
import UsersListPage from './pages/UsersListPage';
import AdminsListPage from './pages/AdminsListPage';
import NotFoundPage from './pages/NotFoundPage';

export default [
  {
    ...App,
    routes: [
      {
        path: '/',
        exact: true,
        ...HomePage
      },
      {
        path: '/users',
        ...UsersListPage
      },
      {
        path: '/admins',
        ...AdminsListPage
      },
      {
        ...NotFoundPage // show this, if no routes match
      }
    ]
  }
];


// export default () => {
//   return (
//     <div>
//       <Route exact path="/" component={ Home } />
//       <Route path="/users" component={ UsersList } />
//     </div>
//   );
// };