/*
  Add-on validation and submission actions.

  1. Upload a ZIP, get a validation ID.
  2. Poll the validation API using the given ID to get processing status.
  3. Once validation passes, ping the API with the validation ID to create the
     add-on and finish the submission process.
*/
'use strict';
import {createAction} from 'redux-actions';
import req from 'request';
import Url from 'urlgray';
import urlJoin from 'url-join';


export const VALIDATION_BEGIN = 'SUBMISSION_ADDON__VALIDATION_BEGIN';
const validationBegin = createAction(VALIDATION_BEGIN);

// For when the add-on upload has started processing.
export const VALIDATION_PENDING = 'SUBMISSION_ADDON__VALIDATION_PENDING';
const validationPending = createAction(VALIDATION_PENDING);

// For when the add-on upload has finished validation.
export const VALIDATION_PASS = 'SUBMISSION_ADDON__VALIDATION_PASS';
const validationPassed = createAction(VALIDATION_PASS);

export const VALIDATION_FAIL = 'SUBMISSION_ADDON__VALIDATION_FAIL';
const validationFail = createAction(VALIDATION_FAIL);

export const SUBMIT_OK = 'SUBMISSION_ADDON__SUBMIT_OK';
const submitOk = createAction(SUBMIT_OK);

export const SUBMIT_ERROR = 'SUBMISSION_ADDON__SUBMIT_ERROR';
const submitError = createAction(SUBMIT_ERROR);


export function validate(fileData) {
  /*
    Upload add-on .zip file for validation.
  */
  return (dispatch, getState) => {
    const apiArgs = getState().apiArgs || {};
    const validationUrl = Url(
      urlJoin(process.env.MKT_API_ROOT, 'extensions/validation/')
    ).q(apiArgs);

    dispatch(validationBegin());

    req
      .post(validationUrl)
      .set('Content-Type', 'application/zip')
      .set('Content-Disposition',
           'form-data; name="binary_data"; filename="extension.zip"')
      .send(fileData)
      .then(res => {
        // Notify the reducers.
        dispatch(validationPending(res.body.id));

        // Take further action by polling.
        dispatch(pollValidator(res.body.id));
      }, err => {
        dispatch(validationFail(JSON.parse(err.response.text).detail));
      });
  };
}


export function pollValidator(validationId) {
  /*
    Poll add-on's validation detail endpoint to wait until validation has
    processed.
  */
  return (dispatch, getState) => {
    const apiArgs = getState().apiArgs || {};
    const pollUrl = Url(
      urlJoin(process.env.MKT_API_ROOT,
              `extensions/validation/${validationId}/`)
    ).q(apiArgs);

    function poll(interval) {
      req
        .get(pollUrl)
        .then(res => {
          if (res.body.processed) {
            // If processed, then validation is complete. Resolve process.
            clearInterval(pollValidatorInterval);

            if (res.body.valid) {
              dispatch(create(res.body));
            } else {
              dispatch(validationFail(res.body.validation));
            }
          }
        });
    }

    // Poll the validator, poll() will clear interval when complete + dispatch.
    const pollValidatorInterval = setInterval(() => {
      poll(pollValidatorInterval);
    }, 500);
  };
}


export function create() {
  /*
    Finish add-on submission process.
  */
  return (dispatch, getState) => {
    const apiArgs = getState().apiArgs || {};
    const createUrl = Url(
      urlJoin(process.env.MKT_API_ROOT, 'extensions/extension/')
    ).q(apiArgs);

    req
      .post(createUrl)
      .send({validation_id: getState().addonSubmit.validationId})
      .then(res => {
        dispatch(submitOk(res.body));
      }, err => {
        dispatch(submitError(res.body));
      });
  };
}
