import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

const Header = (props) => {
  const { auth } = props;
  console.log('auth', auth);

  /**
   * Using /api coz we want all reqs with /api to go via proxy.
   * check client.js and index.js
   *
   * Why not Link tag? Coz link tag is used to navigate within the React app.
   * Here we want the browser to navigate to those urls outside React app and
   * update the address bar.
   * You will see browser redirect to google login and then back to our app
   * with complete page refresh.
   */
  const authBtn = auth
    ? (<a href="/api/logout">Logout</a>)
    : (<a href="/api/auth/google">Login</a>);

  return (
    <nav>
      <div className="nav-wrapper">
        <Link to="/" className="brand-logo">React SSR</Link>
        <ul className="right">
          <li><Link to="/users">Users</Link></li>
          <li><Link to="/admins">Admis</Link></li>
          <li>{ authBtn }</li>
        </ul>
      </div>
    </nav>
  );
};

function mapStateToProps(state) {
  const { auth } = state;
  return {
    auth
  };
};

export default connect(mapStateToProps)(Header);