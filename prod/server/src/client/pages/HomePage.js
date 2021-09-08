import React from 'react';

class HomePage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: 'server-pass'
    }
    // console.log('constructor', this.state);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick() {
    alert(this.state.name);
  };

  componentDidMount() {
    // console.log('componentDidMount', this.state);
    this.setState(() => ({
      name: 'client-pass'
    }));
  }

  render() {
    const { name } = this.state;
    // console.log('render', this.state);
    return (
      <div className="center-align" style={{ marginTop: '200px' }}>
        <h3>Welcome</h3>
        Home Component <p>{ name }</p>
        We are using ES6 on server side using webpack.
        <div>
          <button onClick={ this.handleClick }>Click Me!</button>
        </div>
      </div>
    );
  }
};

export default {
  component: HomePage
};