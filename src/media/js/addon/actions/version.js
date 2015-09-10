'use strict';
import {createAction} from 'redux-actions';
import req from 'request';
import Url from 'urlgray';
import urlJoin from 'url-join';


export const FETCH_OK = 'ADDON_VERSION__FETCH_OK';
const fetchOk = createAction(FETCH_OK);


export function fetch(slug) {
  /*
    Fetch versions of an add-on.
  */
  return (dispatch, getState) => {
    const apiArgs = getState().apiArgs || {};
    const dashboardUrl = Url(
      urlJoin(process.env.MKT_API_ROOT, 'extensions/extension/')
    ).q(apiArgs);

    req
      .get(dashboardUrl)
      .then((res, err) => {
        // Take further action by polling.
        dispatch(fetchOk(res.body.objects));
      });
  };
}
