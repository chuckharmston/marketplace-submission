import FluxComponent from 'flummox/component';
import React from 'react';

import {LoginButton} from '../login';


export default class Login extends React.Component {
  render() {
    return <FluxComponent>
      <h2>Login Required</h2>
      <LoginButton/>
    </FluxComponent>
  }
}
