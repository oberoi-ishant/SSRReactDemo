import React from 'react';
import { connect } from 'react-redux';
import { fetchAdmins } from '../actions/index';
import requireAuth from '../components/hocs/requireAuth';

class AdminsListPage extends React.Component {
  constructor(props) {
    super(props);
    // console.log('constructor');
  }

  componentDidMount() {
    // console.log('componentDidMount', this.props);
    this.props.fetchAdmins();
  }

  renderAdmins() {
    return this.props.admins.map(admin => {
      return <li key={ admin.id }>{ admin.name }</li>
    });
  }

  render() {
    // console.log('render', this.props);
    return (
      <div>
        Protected list of admins.
        <ul>
          { this.renderAdmins() }
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  // console.log('state', state);
  return {
    admins: state.admins
  }
}

function loadData (store) {
  const res = store.dispatch(fetchAdmins());
  return res;
}

export default {
  component: connect(mapStateToProps, { fetchAdmins })(requireAuth(AdminsListPage)),
  loadData
};