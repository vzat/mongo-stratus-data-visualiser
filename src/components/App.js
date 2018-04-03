import React, { Component } from 'react';

import './css/App.css';

import Header from './Header';

import { } from 'semantic-ui-react'

class App extends Component {
  render() {
    return (
      <div className="App">
          <Header
              username = 'jsmith'
              db = 'db'
              instanceName = 'instance'
              databaseName = 'dbName'
          />
      </div>
    );
  }
}

export default App;

// <Header
//     username = {this.props.username}
//     notification = {this.props.creatingDB}
//     db = {this.props.db}
//     setCreatingDB = {this.props.setCreatingDB}
//     setRefreshServerList = {this.props.setRefreshServerList}
//     instanceName = {this.state.instanceInfo.instanceName}
// />
