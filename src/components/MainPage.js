import React, { Component } from 'react';

import './css/MainPage.css';

import { Segment, Menu, Grid, Responsive, Container } from 'semantic-ui-react';

import Header from './Header';
import DataViewer from './DataViewer';

import db from './utils/db';

class MainPage extends Component {
    state = {
        sidebar: false,
        collections: [
            'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
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
        }],
        activeMenuItem: ''
    };

    getCollections = async (username, instance, database) => {
          try {
              const res = await db.get('/api/v1/' + username + '/' + instance + '/' + database + '/collections');

              if (res.ok && res.ok === 1) {
                  const data = res.data;

                  let collections = [];
                  for (let cNo = 0 ; cNo < data.length ; cNo ++) {
                      collections.push(data[cNo].name);
                  }
                  this.setState({collections});
              }
          }
          catch (err) {
              console.log(err);
          }
    };

    componentDidMount = async () => {
        if (this.props.username) {
            await this.getCollections(this.props.username, this.props.match.params.instanceName, this.props.match.params.databaseName);
        }
    }

    componentWillReceiveProps = async (nextProps) => {
        if (this.props.username !== nextProps.username) {
            await this.getCollections(nextProps.username, this.props.match.params.instanceName, this.props.match.params.databaseName);
        }
    }

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

    getDocuments = async (username, instanceName, databaseName, collectionName) => {
        let docs = [];
        this.setState({docs});

        const res = await db.get('/api/v1/' + username + '/' + instanceName + '/' + databaseName + '/' + collectionName + '/documents');

        if (res.ok && res.ok === 1) {
            docs = res.data;
            this.setState({docs});
        }
    };

    menuClick = async (event, comp) => {
        this.setState({activeMenuItem: comp.name});

        if (this.props.username) {
            const username = this.props.username;
            const instanceName = this.props.match.params.instanceName;
            const databaseName = this.props.match.params.databaseName;
            const collectionName = comp.name;

            this.getDocuments(username, instanceName, databaseName, collectionName);
        }
    };

    render() {
        const { collections } = this.state;
        const collectionList = collections.map((collection, index) => (
            <Menu.Item
                name = { collection }
                active = {this.state.activeMenuItem === collection}
                onClick = {this.menuClick} >
                    {
                        collection.length > 18 ? collection.substr(0, 18) + '...' : collection
                    }
            </Menu.Item>
        ));

        return (
            <div className="MainPage">
                  <Header
                      username = {this.props.username}
                      instanceName = {this.props.match.params.instanceName}
                      databaseName = {this.props.match.params.databaseName}
                      setCreatingDB = {this.props.setCreatingDB}
                      notification = {this.props.creatingDB}
                  />

                  <div className = 'content'>
                        <Menu vertical secondary pointing color = 'green' className = 'collection-menu'>
                            <Menu.Item header>
                                Collections
                            </Menu.Item>
                            { collectionList }
                        </Menu>

                        <div className = 'data-content'>
                            <DataViewer
                                docs = {this.state.docs}
                                setDoc = {this.setDoc}
                            />
                        </div>
                  </div>
            </div>
        );
    }
}

export default MainPage;


// <Grid style = {{ height: 'calc(100vh - 70px)' }} stackable>
//     <Grid.Column style = {{ height: '100%' }} className = 'menu-column'>
//         <Segment compact style = {{ height: '100%' }} >
//             <Menu vertical secondary pointing>
//                 <Menu.Item header>
//                     Collections
//                 </Menu.Item>
//                 { collectionList }
//             </Menu>
//         </Segment>
//     </Grid.Column>
//     <Grid.Column stretched>
//         <Segment className = 'data-content'>
//             <DataViewer
//                 docs = {this.state.docs}
//                 setDoc = {this.setDoc}
//             />
//         </Segment>
//     </Grid.Column>
// </Grid>










// const panes = [
//     { menuItem: 'Data', render: () => <Tab.Pane> Content </Tab.Pane>},
//     { menuItem: 'Visual', render: () => <Tab.Pane> Visual </Tab.Pane>}
// ];

// <Menu.Item name = 'abc' active>
//     Item1
// </Menu.Item>
// <Menu.Item name = 'abcdsa'>
//     Item2
// </Menu.Item>


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
