import React, { Component } from 'react';

import './css/MainPage.css';

import Header from './Header';
import DataViewer from './DataViewer';

import { Segment, Menu, Grid } from 'semantic-ui-react'

class MainPage extends Component {
    state = {
        sidebar: false,
        collections: [
            'post',
            'comments',
            'other'
        ],
        docs: [{
            _id: 'abc',
            abc: 6,
            dsa: 'dsa',
            zxc: ['dsa', 'dsa'],
            nested: {
                afs: 'dsa',
                dsadsa: 'dsa',
                nested2: {
                    sda: 'dsa'
                }
            }
        },
        {
            _id: 'dadsa',
            dsa: 'dsaddas',
            cxzc: 'dsasd',
            a: [{
                dadf: 'dsa',
                dsa: 'fads'
            },
            {
                dsa: 'dsa',
                dsa: 'dsa'
            }]
        }]
    };

    toggleSidebar = () => {
        this.setState({sidebar: !this.state.sidebar});
    }

    setDoc = (doc, index) => {
        let { docs } = this.state;
        
        if (index >= 0 && index < docs.length) {
            docs[index] = doc;
            this.setState({docs});
        }
    }

    render() {
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
                                  <Menu.Item name = 'abc' active>
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
                              <DataViewer
                                  docs = {this.state.docs}
                                  setDoc = {this.setDoc}
                              />
                          </Segment>
                      </Grid.Column>
                  </Grid>
            </div>
        );
    }
}

export default MainPage;

// const panes = [
//     { menuItem: 'Data', render: () => <Tab.Pane> Content </Tab.Pane>},
//     { menuItem: 'Visual', render: () => <Tab.Pane> Visual </Tab.Pane>}
// ];


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
