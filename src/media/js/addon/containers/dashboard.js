import React from 'react';
import {connect} from 'react-redux';
import {ReverseLink} from 'react-router-reverse';
import {bindActionCreators} from 'redux';
import urlJoin from 'url-join';

import {fetch} from '../actions/dashboard';
import {AddonListingForDashboard} from '../components/addonListing';
import AddonSubnav from '../components/addonSubnav';
import {addonListSelector} from '../selectors/addon';
import {Page} from '../../site/components/page';
import Paginator from '../../site/components/paginator';


export class AddonDashboard extends React.Component {
  static PropTypes = {
    addons: React.PropTypes.array,
    fetch: React.PropTypes.func,
    hasNextPage: React.PropTypes.bool,
    hasPrevPage: React.PropTypes.bool,
    page: React.PropTypes.number
  };

  static defaultProps = {
    addons: [],
    fetch: () => {},
  };

  constructor(props) {
    super(props);
    this.props.fetch(this.props.page);
  }

  renderEmpty() {
    const mdnLink =
      'https://developer.mozilla.org/docs/Mozilla/Firefox_OS/Add-ons';
    return (
      <Page title="My Firefox OS Add-ons" subnav={<AddonSubnav/>}
            className="addon-dashboard addon-dashboard--empty">
          <p>You have not submitted any add-ons yet.</p>
          <a href={mdnLink} className="button" target="_blank">
            Get started now!
          </a>
          <ReverseLink className="button" to="addon-submit">
            Submit an Add-on
          </ReverseLink>
      </Page>
    );
  }

  renderFull() {
    const devhubLink = urlJoin(process.env.MKT_ROOT, '/developers');
    return (
      <Page title="My Firefox OS Add-ons" subnav={<AddonSubnav/>}
            className="addon-dashboard">

        <div className="addon-dashboard-header">
          <p className="addon-dashboard--notice">
            Looking for your <a href={devhubLink} target="_blank">
            webapp submissions</a>?
          </p>
          <Paginator hasNextPage={this.props.hasNextPage}
                     hasPrevPage={this.props.hasPrevPage}
                     page={this.props.page}
                     to="addon-dashboard-page"/>
        </div>

        <AddonListingForDashboard
          addons={addonListSelector(this.props.addons, true)}
          linkTo="addon-dashboard-detail"/>
      </Page>
    );
  }

  render() {
    return (this.props.addons && this.props.addons.length ?
            this.renderFull() : this.renderEmpty());
  }
};


export default connect(
  state => {
    const pageNum = parseInt(state.router.params.page, 10) || 1;
    const page = state.addonDashboard.pages[pageNum] ||
                 state.addonDashboard.pages[1];
    return {
      addons: page.addons,
      hasNextPage: page.hasNextPage,
      hasPrevPage: page.hasPrevPage,
      page: pageNum
    };
  },
  dispatch => bindActionCreators({
    fetch
  }, dispatch)
)(AddonDashboard);
