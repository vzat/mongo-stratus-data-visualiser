import React, { Component } from 'react';

import './css/MainPage.css';

import { Segment, Menu, Grid, Container, Button, Icon, Modal, Input, Dimmer, Loader, Divider, Label, Confirm } from 'semantic-ui-react';

import Header from './Header';
import DataViewer from './DataViewer';

import db from './utils/db';

class MainPage extends Component {
    state = {
        sidebar: false,
        collections: [],
        docs: [],
        activeMenuItem: '',
        collectionModal: false,
        inputCollectionName: '',
        loadingDeleteCollection: false
    };

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.value });
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
        let docs = ['...'];
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

    openCollectionModal = () => {
        this.setState({collectionModal: true});
    };

    closeCollectionModal = () => {
        this.setState({collectionModal: false});
    };

    createCollection = async (event, comp) => {
        if (this.props.username) {
            this.setState({loadingCollectionModal: true});

            const username = this.props.username;
            const instanceName = this.props.match.params.instanceName;
            const databaseName = this.props.match.params.databaseName;

            const res = await db.post('/api/v1/' + username + '/' + instanceName + '/' + databaseName + '/collection', JSON.stringify({collection: this.state.inputCollectionName}));

            if (res.ok && res.ok === 1) {
                  this.getCollections(this.props.username, this.props.match.params.instanceName, this.props.match.params.databaseName);
            }

            this.setState({inputCollectionName: ''});
            this.setState({loadingCollectionModal: false});
            this.setState({collectionModal: false});
        }
    };

    deleteCollection = async () => {
        if (this.props.username && this.state.activeMenuItem) {
            this.setState({loadingDeleteCollection: true});

            const username = this.props.username;
            const instanceName = this.props.match.params.instanceName;
            const databaseName = this.props.match.params.databaseName;

            const res = await db.delete('/api/v1/' + username + '/' + instanceName + '/' + databaseName + '/collection', JSON.stringify({collection: this.state.activeMenuItem}));

            if (res.ok && res.ok === 1) {
                  this.getCollections(this.props.username, this.props.match.params.instanceName, this.props.match.params.databaseName);

                  this.setState({activeMenuItem: false});
                  this.setState({confirmDeleteCollection: false});
                  this.setState({loadingDeleteCollection: false});
            }
        }
    };

    openConfirmCollection = () => {
        this.setState({confirmDeleteCollection: true});
    };

    closeConfirmCollection = () => {
        this.setState({confirmDeleteCollection: false});
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
                            <Menu.Item>
                                <Button icon
                                    labelPosition = 'left'
                                    color = 'green'
                                    onClick = {() => this.openCollectionModal()} >
                                        <Icon name = 'plus' />
                                            Collection
                                </Button>
                            </Menu.Item>
                        </Menu>

                        <div className = 'data-content'>
                            {
                                this.state.activeMenuItem &&
                                <Menu secondary>
                                    <Menu.Item>
                                        <Button icon
                                            color = 'red'
                                            labelPosition = 'left'
                                            onClick = {() => this.openConfirmCollection()}>
                                                <Icon name = 'trash' />
                                                Delete Collection
                                        </Button>
                                    </Menu.Item>

                                    <Menu.Item position = 'right'>
                                        <Label size = 'large' color = 'blue'>
                                            Documents
                                            <Label.Detail> {this.state.docs.length} </Label.Detail>
                                        </Label>
                                    </Menu.Item>
                                </Menu>
                            }

                            {
                                this.state.activeMenuItem &&
                                <Divider />
                            }

                            {
                                this.state.docs && this.state.docs.length > 0 &&
                                <DataViewer
                                    docs = {this.state.docs}
                                    setDoc = {this.setDoc}
                                />
                            }

                            {
                                this.state.activeMenuItem && this.state.docs && this.state.docs.length === 0 &&
                                <Container style = {{textAlign: 'center'}}> <h3> No Documents </h3> </Container>
                            }
                        </div>
                  </div>

                  <Modal
                      open = {this.state.collectionModal}
                      size = 'fullscreen'
                      closeIcon
                      closeOnEscape = { true }
                      closeOnRootNodeClick = { true }
                      onClose = {() => this.closeCollectionModal()}
                      style = {{
                          marginTop: '40vh',
                          maxWidth: 400
                      }} >
                          <Modal.Header>
                              Create a new Collection
                          </Modal.Header>
                          <Modal.Content>
                              <Input fluid
                                  name = 'inputCollectionName'
                                  placeholder = 'Collection Name'
                                  value = {this.state.inputCollectionName}
                                  onChange = {this.handleChange} />

                              <Dimmer active = { this.state.loadingCollectionModal } >
                                  <Loader content = 'Loading' />
                              </Dimmer>
                          </Modal.Content>
                          <Modal.Actions>
                              <Button onClick = {() => this.closeCollectionModal()} > Cancel </Button>
                              <Button color = 'green' onClick = {this.createCollection} > Create Collection </Button>
                          </Modal.Actions>
                    </Modal>

                    <Confirm
                        open = {this.state.confirmDeleteCollection}
                        onCancel = {() => this.closeConfirmCollection()}
                        onConfirm = {() => this.deleteCollection()}
                        header = 'Are you sure you want to delete this collection?'
                        content = {
                          <Modal.Content>
                              All data will be permanently deleted. You cannot undo this action.
                              <Dimmer active = { this.state.loadingDeleteCollection } >
                                  <Loader content = 'Loading' />
                              </Dimmer>
                          </Modal.Content>
                        }
                        confirmButton = {
                            <Button icon
                                labelPosition = 'left'
                                primary = {false}
                                color = 'red'>
                                    <Icon name = 'trash' />
                                    Delete Collection
                            </Button>
                        }
                        size = 'fullscreen'
                        style = {{
                            marginTop: '40vh',
                            maxWidth: 800
                        }}
                    />
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
