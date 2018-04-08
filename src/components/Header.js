import React, { Component } from 'react';

import './css/Header.css';

import { Segment, Image, Dropdown, Loader, Transition, Button, Breadcrumb, Icon } from 'semantic-ui-react';

import logo from './resources/images/MongoStratusLogo.svg';

class ServerList extends Component {
  state = {
      notificationText: 'Your instance is being created...'
  };

  handleNotification = (visible, text) => {
      this.setState({
          notification: visible,
          notificationText: text
      });
  };

  componentDidMount = () => {
      // Show notification if a db is being created
      this.checkDB();
  };

  checkDB = async () => {
      const res = await fetch('/api/v1/internal/show/notification', {
          method: 'GET',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json'
          }
      });

      const json = await res.json();

      if (json.ok && json.ok === 1 && json.notification && json.notification === 1) {
          this.props.setCreatingDB(true);
      }
      else {
          this.props.setCreatingDB(false);
      }

      setTimeout(this.checkDB, 10000);
  };

  hideNotification = async () => {
      await fetch('/api/v1/internal/hide/notification', {
          method: 'POST',
          credentials: 'include',
          headers: {
              'Content-Type': 'application/json'
          }
      });
  };

  render() {
      const username = this.props.username;
      const { notificationText } = this.state;
      const { notification } = this.props;

      const breadcrumb = (
          <Breadcrumb className = 'breadcrumb-nav'>
              <Breadcrumb.Section
                  href = '/'
                  active = { this.props.instanceName === undefined }>
                      Home
              </Breadcrumb.Section>

              { this.props.instanceName &&
                  <Breadcrumb.Divider icon = 'right chevron'/>
              }
              { this.props.instanceName &&
                  <Breadcrumb.Section
                      href = {'/instance/' + this.props.instanceName}
                      active = { this.props.databaseName === undefined } >
                          { this.props.instanceName }
                  </Breadcrumb.Section>
              }

              { this.props.databaseName &&
                  <Breadcrumb.Divider icon = 'right chevron' />
              }
              { this.props.databaseName &&
                  <Breadcrumb.Section
                      href = {'/data/' + this.props.instanceName + '/' + this.props.databaseName}
                      active >
                          { this.props.databaseName }
                  </Breadcrumb.Section>
              }
          </Breadcrumb>
      );

      logout = async (event, comp) => {
          if (this.props.username) {
              const res = await fetch('/api/v1/internal/' + this.props.username + '/logout', {
                  method: 'POST',
                  credentials: 'include',
                  headers: {
                      'Content-Type': 'application/json'
                  }
              });

              // Reload the page for the logout to take effect
              window.location.reload();
          }
      };

      return (
        <div className = "Header">
            <Segment attached = 'top'>
                <Image
                    src = {logo}
                    size = 'small'
                    href = '/'
                    verticalAlign = 'middle'
                />

                <div className = 'username-dropdown'>
                    <Icon name = 'user circle' />
                    <Dropdown text = {username} direction = 'left' inline compact>
                        <Dropdown.Menu>
                            <Dropdown.Item key = 'Logout' text = 'Logout' value = 'Logout' onClick = {this.logout} />
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </Segment>
            <Transition.Group animation = 'fade down' duration = {500} >
                { notification &&
                    <Segment attached = 'bottom' color = 'green' inverted textAlign = 'center' size = 'small' >
                        <Loader active inline indeterminate inverted size = 'small' />
                        <div className = 'notification-text'>
                            { notificationText }
                        </div>
                        <Button compact floated = 'right' icon = 'close' size = 'tiny' color = 'green' onClick = { this.hideNotification } />
                    </Segment>
                }
            </Transition.Group>
            { breadcrumb }
        </div>
      );
    }
}

export default ServerList;
