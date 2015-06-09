/*
    FxA Login component.

    Involved in the process is the Login action, the Login store, and User
    store.
*/
import classnames from 'classnames';
import FluxComponent from 'flummox/component';
import connectToStores from 'flummox/connect';
import fluxMixin from 'flummox/mixin';
import React from 'react';
import Url from 'urlgray';

import Login from './handlers/login';


class FxaLogin extends React.Component {
  /* After login, FxA OAuth redirects to this handler which is within a popup.
     Retrieves the auth info from the URL and postmessage back to opener.
     Note this handler is currently not used in production, but rather
     Fireplace's /fxa-authorize handler, but it'll work since every app will
     be proxied onto the same domain.
  */
  componentDidMount() {
    const {router} = this.context;

    if (this.isPopup()) {
      // `auth_code` to match the legacy Commonplace key.
      window.opener.postMessage({auth_code: window.location.href},
                                window.location.origin);
    }
  }
  isPopup() {
    try {
        if (window.opener.location.protocol == window.location.protocol &&
            window.opener.location.host == window.location.host) {
          return true;
        }
    } catch (e) {
      return false;
    }
  }
  render() {
    return <h1>Processing Firefox Accounts authorization&hellip;</h1>
  }
}
FxaLogin.contextTypes = {
  router: React.PropTypes.func
};
export {FxaLogin};


class LoginButton extends React.Component {
  // Wrapper around FxA login button to connect to Marketplace's API.
  siteConfigStateGetter(siteConfig) {
    return siteConfig.getAuthInfo(this.props.signup);
  }
  render() {
    return <FluxComponent
              connectToStores={{siteConfig: this.siteConfigStateGetter.bind(this)}}>
      <FxaLoginButton signup={this.props.signup}/>
    </FluxComponent>
  }
}
LoginButton.propTypes = {
  signup: React.PropTypes.bool
};
export {LoginButton};


class FxaLoginButton extends React.Component {
  // Opens up an FxA login popup window.
  constructor() {
    super();
    this.state = { loggingIn: false };
  }
  componentDidMount() {
    window.addEventListener('message', this.handlePostMessage.bind(this));
  }
  componentWillUnmount() {
    window.removeEventListener('message', this.handlePostMessage);
  }
  handlePostMessage(msg) {
    var origins = [process.env.API_ROOT, window.location.origin];
    if (msg.data && msg.data.auth_code && origins.indexOf(msg.origin) !== -1) {
        // Trigger Login action.
        this.props.flux.getActions('login').login(
            msg.data.auth_code, this.props.authState,
            this.props.localDevClientId);
    }
  }
  openPopup() {
    const w = this.props.popupWidth || 320;
    const h = this.props.popupHeight || 600;
    const x = window.screenX +
          Math.max(0, Math.floor((window.innerWidth - w) / 2));
    const y = window.screenY +
          Math.max(0, Math.floor((window.innerHeight - h) / 2));

    const popup = window.open(
      this.props.authUrl, 'fxa',
      `scrollbars=yes,width=${w},height=${h},left=${x},top=${y}`);

    return new Promise((resolve, reject) => {
      resolve(popup);
      const popupInterval = setInterval(() => {
        if (!popup || popup.closed) {
          // Popup closed, login cancelled.
          clearInterval(popupInterval);
          reject(popup);
        }
      }, 500);
    });
  }
  startLogin() {
    const root = this;
    root.setState({
      loggingIn: true
    });
    root.openPopup().then((popup) => {
      this.props.flux.getActions('login').startLogin(popup);
    }, () => {
      root.setState({
        loggingIn: false
      });
    });
  }
  render() {
    var btnClasses = classnames({
      login: true,
      ['login--register']: this.props.signup,
    });
    return <button className={btnClasses} onClick={this.startLogin.bind(this)}>
      {this.props.content || this.props.signup ? 'Register' : 'Login'}
    </button>;
  }
}
FxaLoginButton.propTypes = {
  authUrl: React.PropTypes.string,
  authState: React.PropTypes.string,
  content: React.PropTypes.any,
  localDevClientId: React.PropTypes.string,
  signup: React.PropTypes.bool
};
export {FxaLoginButton};


class LogoutButton extends React.Component {
  logout() {
    // Trigger Logout action.
    this.props.flux.getActions('login').logout();
  }
  render() {
    return <button className="logout" onClick={this.logout.bind(this)}>
      {this.props.content || 'Logout'}
    </button>
  }
}
export {LogoutButton};


const loginRequired = Component => {
  class AuthenticatedComponent extends React.Component {
    render() {
      if(!this.props.isLoggedIn) {
        return <Login />
      } else {
        return <Component {...this.props}/>
      }
    }
  }
  return connectToStores(AuthenticatedComponent, {
    user: userStore => ({
      isLoggedIn: userStore.isLoggedIn()
    })
  }); 
};
export {loginRequired};
