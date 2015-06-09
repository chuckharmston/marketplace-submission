import FluxComponent from 'flummox/component';
import React from 'react';
import Router from 'react-router';

import Footer from './footer';
import Header from './header';


export default class App extends React.Component {
  render() {
    return <div className="app">
      <Header/>
      <main>
        <FluxComponent>
          <Router.RouteHandler/>
        </FluxComponent>
      </main>
      <Footer/>
    </div>
  }
}
