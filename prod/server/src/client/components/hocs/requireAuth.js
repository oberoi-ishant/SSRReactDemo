import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';

export default (ChildComponent) => {
  class RequireAuth extends React.Component {
    render () {
      switch(this.props.auth) {
        case null:
          return (<div>Loading auth state...</div>);
        case false:
          // if not authenticated, redirect user to / route.
          /**
           * Once this app is being rendered on the server..initial load or
           * javascript blocked.
           * Using Redirect will not do much, as Server is rendering using Static Router.
           * We will need to hook this with context passed to static router for a proper
           * redirect to / route in this case.
           *
           * If you console log context object (index..js) when Redirect
           * tag works by attempting to load /admins when not logged in, we will see
           * { action: 'REPLACE', location: { pathname: '/', search: '',
           * hash: '', state: undefined }, url: '/' }
           * So we just to check in context if these properties are there and manually
           * navigate to '/' route as server side is using a StaticRouter in index.js
           */
          return (<Redirect to="/" />);
        default:
          return (<ChildComponent { ...this.props } />);
      }
    }
  }

  function mapStateToProps (state) {
    return {
      auth: state.auth
    }
  }

  return connect(mapStateToProps)(RequireAuth);
}