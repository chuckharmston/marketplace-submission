import React from 'react';
import {ReverseLink} from 'react-router-reverse';

import {versionListSelector} from '../selectors/addon';
import * as constants from '../constants';


export class AddonListing extends React.Component {
  static propTypes = {
    addons: React.PropTypes.array.isRequired,
    isReview: React.PropTypes.bool,
  };

  render() {
    return (
      <ul className="addon-listing">
        {this.props.addons.map(addon =>
          <li>
            <Addon {...this.props} {...addon} isListing={true}/>
          </li>
        )}
        {this.props.addons.length === 0 && <p>No add-ons.</p>}
      </ul>
    );
  }
}


export class Addon extends React.Component {
  static PropTypes = {
    latest_version: React.PropTypes.number,
    latest_public_version: React.PropTypes.number,
    mini_manifest_url: React.PropTypes.string.isRequired,
    name: React.PropTypes.string.isRequired,
    slug: React.PropTypes.string.isRequired,
    status: React.PropTypes.string.isRequired,

    isListing: React.PropTypes.bool,
    isReview: React.PropTypes.bool,
    publish: React.PropTypes.func,
    reject: React.PropTypes.func,
  };

  renderName() {
    if (this.props.isListing && this.props.isReview) {
      // Render a link to review detail page if part of review queue.
      return (
        <ReverseLink to="addon-review-detail"
                     params={{slug: this.props.slug}}>
          <h2>{this.props.name}</h2>
        </ReverseLink>
      );
    }
    return <h2>{this.props.name}</h2>
  }

  render() {
    return (
      <div className="addon">
        <div>
          {this.renderName()}
        </div>
        <dl>
          <dt>Slug</dt>
          <dd>{this.props.slug}</dd>

          <dt>Manifest</dt>
          <dd>
            <a href={this.props.mini_manifest_url}>
              Download manifest
            </a>
          </dd>
        </dl>

        {!this.props.isListing &&
          <VersionListing isReview={this.props.isReview}
                          publish={this.props.publish}
                          reject={this.props.reject}
                          slug={this.props.slug}
                          versions={versionListSelector(this.props.versions)}/>
        }
      </div>
    );
  }
}


class VersionListing extends React.Component {
  static propTypes = {
    isReview: React.PropTypes.bool,
    versions: React.PropTypes.array.isRequired,

    publish: React.PropTypes.func,
    reject: React.PropTypes.func,
  };

  render() {
    return (
      <div className="version-listing">
        <h3>Versions</h3>

        <ul>
          {this.props.versions.map(version =>
            <li>
              <Version {...this.props} {...version}/>
            </li>
          )}
        </ul>
      </div>
    );
  }
}


class Version extends React.Component {
  static PropTypes = {
    id: React.PropTypes.number.isRequired,
    download_url: React.PropTypes.string.isRequired,
    slug: React.PropTypes.string.isRequired,
    status: React.PropTypes.string.isRequired,
    version: React.PropTypes.string.isRequired,
    unsigned_download_url: React.PropTypes.string.isRequired,

    // `isReview` determines whether public/reject buttons are displayed.
    // It will be `false` in cases such as the AddonDashboard.
    isReview: React.PropTypes.bool,
    publish: React.PropTypes.func,
    reject: React.PropTypes.func,
  };

  publish = () => {
    this.props.publish(this.props.slug, this.props.id);
  }

  reject = () => {
    this.props.reject(this.props.slug, this.props.id);
  }

  render() {
    const disabled = this.props.isPublishing || this.props.isRejecting;

    return (
      <div className="version">
        <dl>
          <dt>Version</dt>
          <dd>{this.props.version}</dd>

          <dt>Files</dt>
          <dd>
            <a href={this.props.unsigned_download_url}>
              Download v{this.props.version} .zip
            </a>
          </dd>

          <dt>Status</dt>
          <dd>{this.props.status}</dd>
        </dl>

        {this.props.isReview &&
          <div>
            {this.props.status !== constants.STATUS_REJECTED &&
              <button onClick={this.reject} disabled={disabled}>
                {this.props.isRejecting ? 'Rejecting...' : 'Reject'}
              </button>
            }
            {this.props.status !== constants.STATUS_PUBLIC &&
              <button onClick={this.publish} disabled={disabled}>
                {this.props.isPublishing ? 'Publishing...' : 'Publish'}
              </button>
            }
          </div>
        }
      </div>
    );
  }
}
