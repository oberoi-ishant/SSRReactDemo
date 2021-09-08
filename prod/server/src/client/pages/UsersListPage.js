import React from 'react';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { fetchUsers } from '../actions/index';

class UsersListPage extends React.Component {
  constructor(props) {
    super(props);
    // console.log('constructor');
  }

  componentDidMount() {
    // console.log('componentDidMount', this.props);
    this.props.fetchUsers();
  }

  renderUsers() {
    return this.props.users.map(user => {
      return <li key={ user.id }>{ user.name }</li>
    });
  }

  head() {
    /**
      Helmet Tags can be placed anywhere inside the content.
      only condition is helmet tag should be rendered.
      Then we will manually pull all these tags out from Helmet lib
      and add them to our html in renderer.js.
      This is server side behaviour.
      Also check https://ogp.me/ for usage on og:<> properties.

      <title>{this.props.users.length} Users Loaded</title> Will break.
      Error: Helmet expects a string as a child of <title>. Did you forget to wrap your children in braces? ( <title>{``}</title> )
      As Helmet expects ONE STRING for the content inside title.
      So use es6 template literals as done below.
    */
    return (
      <Helmet>
        <title>{ `${ this.props.users.length} Users Loaded` }</title>
        <meta property="og:title" content="Users App" />
      </Helmet>
    );
  }

  render() {
    // console.log('render', this.props);
    return (
      <div>
        { this.head() }
        Here is the list of the users
        <ul>
          { this.renderUsers() }
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  // console.log('state', state);
  return {
    users: state.users
  }
}

function loadData (store) {
  const res = store.dispatch(fetchUsers());
  return res;
}

export default {
  component: connect(mapStateToProps, { fetchUsers })(UsersListPage),
  loadData
};