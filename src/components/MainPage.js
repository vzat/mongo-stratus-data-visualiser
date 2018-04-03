import React, { Component } from 'react';

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import './css/MainPage.css';

import Header from './Header';

import { Button, Sidebar, Segment, Menu, Grid, Tab } from 'semantic-ui-react'

class MainPage extends Component {
    state = {
        sidebar: false
    };

    toggleSidebar = () => {
        this.setState({sidebar: !this.state.sidebar});
    }

    render() {
        const panes = [
            { menuItem: 'Data', render: () => <Tab.Pane> Content </Tab.Pane>},
            { menuItem: 'Visual', render: () => <Tab.Pane> Visual </Tab.Pane>}
        ];

        return (
            <div className="MainPage">
                  <Header
                      username = {this.props.username}
                      instanceName = {this.props.match.params.instanceName}
                      databaseName = {this.props.match.params.databaseName}
                      setCreatingDB = {this.props.setCreatingDB}
                      notification = {this.props.creatingDB}
                  />
                  <Grid style = {{ height: 'calc(100vh - 70px)' }} stackable>
                      <Grid.Column style = {{ height: '100%' }} className = 'menu-column'>
                          <Segment compact style = {{ height: '100%' }} >
                              <Menu vertical secondary>
                                  <Menu.Item name = 'abc'>
                                      Item1
                                  </Menu.Item>
                                  <Menu.Item name = 'abcdsa'>
                                      Item2
                                  </Menu.Item>
                              </Menu>
                          </Segment>
                      </Grid.Column>
                      <Grid.Column stretched>
                          <Segment className = 'data-content'>
                          </Segment>
                      </Grid.Column>
                  </Grid>
            </div>
        );
    }
}

export default MainPage;

// <Button onClick = {this.toggleSidebar}> Menu </Button>
// <Sidebar.Pushable as = {Segment}>
//     <Sidebar as = {Menu} animation = 'push' width = 'thin' visible = {this.state.sidebar} icon = 'labeled' vertical >
//         <Menu.Item name = 'abc'>
//             dsada
//         </Menu.Item>
//     </Sidebar>
//     <Sidebar.Pusher>
//         <Segment basic style = {{ height: 'calc(100vh - 167px)'}}>
//             Content
//         </Segment>
//     </Sidebar.Pusher>
// </Sidebar.Pushable>

// <Menu secondary pointing color = 'green' className = 'data-content'>
//     <Menu.Item active link>
//         Data
//     </Menu.Item>
//     <Menu.Item link>
//         Visual
//     </Menu.Item>
// </Menu>
