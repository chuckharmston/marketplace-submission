import React from 'react';


export default class SubmissionRedirect extends React.Component {
  static willTransitionTo(transition) {
    transition.redirect('submission');
  }
  render() {
    return <div/>
  }
}
