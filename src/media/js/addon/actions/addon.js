'use strict';
import {createAction} from 'redux-actions';
import req from 'request';
import Url from 'urlgray';
import urlJoin from 'url-join';


export const FETCH_OK = 'ADDON_ADDON__FETCH_OK';
const fetchOk = createAction(FETCH_OK);

export const FETCH_VERSIONS_OK = 'ADDON_ADDON__FETCH_VERSIONS_OK';
const fetchVersionsOk = createAction(FETCH_VERSIONS_OK);


export function fetch(addonSlug) {
  /*
    Fetch add-on.
  */
  return (dispatch, getState) => {
    const apiArgs = getState().apiArgs || {};
    const addonUrl = Url(
      urlJoin(process.env.MKT_API_ROOT, 'extensions/extension/', addonSlug)
    ).q(apiArgs);

    if (process.env.NODE_ENV === 'test') {
      // Mock data.
      const addonFactory = (
        require('../../__tests__/factory.test').addonFactory
      );
      return dispatch(fetchOk(addonFactory()));
    }

    req
      .get(addonUrl)
      .then((res, err) => {
        dispatch(fetchOk(res.body));
      });
  };
}


export function fetchVersions(addonSlug) {
  /*
    Fetch versions of an add-on.
  */
  return (dispatch, getState) => {
    const apiArgs = getState().apiArgs || {};
    const versionsUrl = Url(
      urlJoin(process.env.MKT_API_ROOT, 'extensions/extension/', addonSlug,
              'versions/')
    ).q(apiArgs);

    if (process.env.NODE_ENV === 'test') {
      // Mock data.
      const versionsFactory = (
        require('../../__tests__/factory.test').versionsFactory
      );
      return dispatch(fetchVersionsOk({
        addonSlug,
        versions: versionsFactory()
      }));
    }

    req
      .get(versionsUrl)
      .then((res, err) => {
        dispatch(fetchVersionsOk({
          addonSlug,
          versions: res.body.objects
        }));
      });
  };
}
