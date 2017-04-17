import React from 'react';
import {connect} from 'react-redux';
import {ReverseLink} from 'react-router-reverse';
import {bindActionCreators} from 'redux';
import urlJoin from 'url-join';

import {fetch} from '../actions/dashboard';
import {AddonListingForDashboard} from '../components/listing';
import AddonSubnav from '../components/subnav';
import {addonPageSelector} from '../selectors/addon';
import {Page} from '../../site/components/page';
import Paginator from '../../site/components/paginator';


export class AddonDashboard extends React.Component {
  static PropTypes = {
    addons: React.PropTypes.array,
    fetch: React.PropTypes.func,
    isFetching: React.PropTypes.bool,
    hasNextPage: React.PropTypes.bool,
    hasPrevPage: React.PropTypes.bool,
    page: React.PropTypes.number,
    user: React.PropTypes.object,
  };

  static defaultProps = {
    addons: [],
    fetch: () => {},
  };

  constructor(props) {
    super(props);
    this.props.fetch(this.props.page);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.page !== this.props.page) {
      this.props.fetch(this.props.page);
    }
  }

  renderEmpty() {
    const mdnLink =
      'https://developer.mozilla.org/docs/Mozilla/Firefox_OS/Add-ons';
    return (
      <Page className="addon-dashboard addon-dashboard--empty"
            subnav={<AddonSubnav {...this.props}/>}
            title="My Firefox OS Add-ons">
          <p>You have not submitted any add-ons.</p>
      </Page>
    );
  }

  renderFull() {
    const devhubLink = urlJoin(process.env.MKT_ROOT, '/developers');
    return (
      <Page className="addon-dashboard"
            subnav={<AddonSubnav {...this.props}/>}
            title="My Firefox OS Add-ons">
        <div className="addon-dashboard-header">
          <p className="addon-dashboard--notice">
            Looking for your <a href={devhubLink} target="_blank">
            webapp submissions</a>?
          </p>
          {(this.props.hasNextPage || this.props.hasPrevPage) &&
            <Paginator hasNextPage={this.props.hasNextPage}
                       hasPrevPage={this.props.hasPrevPage}
                       page={this.props.page}
                       to="addon-dashboard-page"/>
          }
        </div>

        <AddonListingForDashboard
          addons={addonListSelector(this.props.addons, true)}
          linkTo="addon-dashboard-detail"/>
      </Page>
    );
  }

  render() {
    if (this.props.addons && this.props.addons.length) {
      return this.renderFull();
    } else {
      return this.renderEmpty();
    }
  }
};


export default connect(
  state => addonPageSelector(state.addonDashboard, state.router),
  dispatch => bindActionCreators({
    fetch
  }, dispatch)
)(AddonDashboard);
