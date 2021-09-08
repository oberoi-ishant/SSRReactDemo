import React from 'react';
import { renderRoutes } from 'react-router-config';
import Header from './components/Header';
import { fetchCurrentUser } from './actions';

const App = (props) => {
  // console.log(props);
  const { route } = props;
  return (
    <div>
      <Header/>
      <div>{ renderRoutes(route.routes) }</div>
    </div>
  );
}


export default {
  component: App,
  loadData: (store) => {
    return store.dispatch(fetchCurrentUser())
  }
};