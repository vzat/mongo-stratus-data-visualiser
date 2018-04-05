import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './css/App.css';

import MainPage from './MainPage';

class App extends Component {
    state = {
        username: undefined,
        creatingDB: false
    };

    componentDidMount = async () => {
        document.title = 'MongoStratus';

        const res = await fetch('/api/v1/internal/get/username', {
            method: 'GET',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const json = await res.json();

        if (!json.ok || json.ok === 0) {
            window.location = 'http://localhost:3001/login';
        }

        this.setState({username: json.username});
    };

    setCreatingDB = (value) => {
        this.setState({creatingDB: value});
    };

    render() {
      return (
        <Router>
            <div className="App">
                <Switch>
                    <Route
                        path = '/data/:instanceName/:databaseName'
                        render = {props =>
                            <MainPage
                                {...props}
                                username = {this.state.username}
                                setCreatingDB = {this.setCreatingDB}
                                creatingDB = {this.state.creatingDB}
                            />
                        }
                    />
                </Switch>
            </div>
        </Router>
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
