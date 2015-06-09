import FluxComponent from 'flummox/component';
import React from 'react';

import {LoginButton, LogoutButton} from './login';


export default class Header extends React.Component {
  userStateGetter(user) {
    return {
      displayName: user.getDisplayName(),
      isLoggedIn: user.isLoggedIn()
    };
  }
  render() {
    return <header>
      <div className="header--wordmark">
        <p className="header--icon"/>
        <h1>Submission Tools</h1>
      </div>
      <FluxComponent connectToStores={{user: this.userStateGetter}}>
        <HeaderLogin isLoggedIn={false}/>
      </FluxComponent>
    </header>
  }
}


class HeaderLogin extends React.Component {
  render() {
    if (this.props.isLoggedIn) {
      return <div className="header--login">
        <p>Logged in as {this.props.displayName}</p>
        <FluxComponent>
          <LogoutButton/>
        </FluxComponent>
      </div>
    } else {
      return <div className="header--login">
        <LoginButton signup={true}/>
        <LoginButton/>
      </div>
    }
  }
}
HeaderLogin.propTypes = {
  displayName: React.PropTypes.string,
  isLoggedIn: React.PropTypes.bool.isRequired,
};
export {HeaderLogin};
