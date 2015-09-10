/*
  Add-ons in the review queue, keyed by slug.
  Versions are attached separately to each add-on, keyed by ID.
*/
import _ from 'lodash';

import * as addonActions from '../actions/addon';
import * as reviewActions from '../actions/review';
import * as submitActions from '../actions/submit';
import * as constants from '../constants';


const initialState = {
  __persist: true,
  addons: {}
};


export default function addonReviewReducer(state=initialState, action) {
  switch (action.type) {
    case addonActions.FETCH_VERSIONS_OK: {
      // Attach versions to their respective addon.
      const newState = _.cloneDeep(state);

      // Create add-on if it doesn't exist, just in case.
      if (!newState.addons[action.payload.addonSlug]) {
        newState.addons[action.payload.addonSlug] = {};
      }

      // Store as an object keyed by version ID for easier lookups.
      const addon = newState.addons[action.payload.addonSlug];
      addon.versions = {};
      action.payload.versions.forEach(version => {
        addon.versions[version.id] = version;
      });
      return newState;
    }

    case reviewActions.FETCH_OK: {
      // Store add-ons from the review queue.
      const newState = _.cloneDeep(state);
      newState.addons = {};  // Invalidate old queue.

      action.payload.forEach(addon => {
        newState.addons[addon.slug] = addon;
        newState.addons[addon.slug].versions = {};
      });
      return newState;
    }

    case reviewActions.PUBLISH_ERROR: {
      // Set add-on version as no longer publishing.
      const newState = _.cloneDeep(state);
      const {addonSlug, versionId} = action.payload;

      newState.addons[addonSlug].versions[versionId].isPublishing = false;
      return newState;
    }

    case reviewActions.PUBLISH_OK: {
      // Set add-on version status as published.
      const newState = _.cloneDeep(state);
      const {addonSlug, versionId} = action.payload;

      const version = newState.addons[addonSlug].versions[versionId];
      version.isPublishing = false;
      version.status = constants.STATUS_PUBLIC;
      return newState;
    }

    case reviewActions.PUBLISH_PENDING: {
      // Set add-on version as publishing.
      const newState = _.cloneDeep(state);
      const {addonSlug, versionId} = action.payload;

      newState.addons[addonSlug].versions[versionId].isPublishing = true;
      return newState;
    }

    case reviewActions.REJECT_ERROR: {
      // Set add-on version as no longer rejecting.
      const newState = _.cloneDeep(state);
      const {addonSlug, versionId} = action.payload;

      newState.addons[addonSlug].versions[versionId].isRejecting = false;
      return newState;
    }

    case reviewActions.REJECT_OK : {
      // Set add-on version status as rejected.
      // Set add-on version status as no longer rejecting.
      const newState = _.cloneDeep(state);
      const {addonSlug, versionId} = action.payload;

      const version = newState.addons[addonSlug].versions[versionId];
      version.status = constants.STATUS_REJECTED;
      version.isRejecting = false;
      return newState;
    }

    case reviewActions.REJECT_PENDING: {
      // Set add-on version as rejecting.
      const newState = _.cloneDeep(state);
      const {addonSlug, versionId} = action.payload;

      newState.addons[addonSlug].versions[versionId].isRejecting = true;
      return newState;
    }

    case submitActions.SUBMIT_OK: {
      // Add new submission to the review queue.
      const newState = _.cloneDeep(state);

      newState.addons[action.payload.slug] = action.payload;
      newState.addons[action.payload.slug].versions = {};
      return newState;
    }

    default: {
      return state;
    }
  }
}
