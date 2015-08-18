import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

import {LoginButton} from '../login';
import {fxaLoginBegin, login} from '../../actions/login';


export class Login extends React.Component {
  static propTypes = {
    authUrl: React.PropTypes.string,
    fxaLoginBegin: React.PropTypes.func.isRequired,
    login: React.PropTypes.func.isRequired,
  };
  loginHandler = authCode => {
    // Call login, passing in some extra stuff from siteConfig.
    this.props.login(authCode, this.props.siteConfig.authState,
                     this.props.siteConfig.clientId);
  }
  render() {
    return <section className="login-handler">
      <h2>You must be logged in to access these tools.</h2>
      <LoginButton authUrl={this.props.siteConfig.authUrl}
                   loginBeginHandler={this.props.fxaLoginBegin}
                   loginHandler={this.loginHandler}/>
    </section>
  }
}


export default connect(
  state => ({
    siteConfig: state.siteConfig,
  }),
  dispatch => bindActionCreators({
    fxaLoginBegin,
    login
  }, dispatch)
)(Login);
