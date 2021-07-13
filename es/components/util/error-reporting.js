'use strict';

import _ from 'underscore';
import { isServerSide } from './misc';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";
var state = null;
/**
 * Initialize Sentry Reporting. Call this from app.js on initial mount perhaps.
 *
 * @export
 * @param {string} [dsn] - Sentry dsn.
 * @param {Object} [context] - Current page content / JSON, to get details about Item, etc.
 * @param {Object} [options] - Extra options.
 * @returns {boolean} true if initialized.
 */

export function initializeSentry() {
  var dsn = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
  arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  if (dsn === null || typeof dsn !== 'string') {
    throw new Error("No dsn provided");
  }

  if (isServerSide()) return false;
  Sentry.init({
    dsn: dsn,
    integrations: [new Integrations.BrowserTracing()],
    environment: 'production',
    maxBreadcrumbs: 100,
    //Monitor the health of releases by observing user adoption, usage of the application, percentage of crashes, and session data.
    autoSessionTracking: true,
    //Determine issues and regressions introduced in a new release
    //Predict which commit caused an issue and who is likely responsible
    //Resolve issues by including the issue number in your commit message
    //Receive email notifications when your code gets deployed
    release: '',
    // Set tracesSampleRate to 1.0 to capture 100%
    // of transactions for performance monitoring.
    // We recommend adjusting this value in production
    tracesSampleRate: 1.0
  });

  if (!shouldTrack()) {
    console.error("EXITING ANALYTICS INITIALIZATION.");
    return false;
  }

  console.info("Sentry: Initialized");
  return true;
}
/**
 *
 */

export function captureException() {
  var level = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Sentry.Severity.Warning;
  var message = arguments.length > 1 ? arguments[1] : undefined;

  for (var _len = arguments.length, arg = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    arg[_key - 2] = arguments[_key];
  }

  switch (level) {
    case Sentry.Severity.Warning:
      console.warn(message, arg);
      break;

    case Sentry.Severity.Log:
      console.log(message, arg);
      break;

    case Sentry.Severity.Error:
      console.error(message, arg);
      break;

    default:
      console.info(message, arg);
      break;
  }

  if (message !== null || typeof message === 'string') {
    Sentry.withScope(function (scope) {
      scope.setLevel(level);
      scope.setTag("ExampleTag", "Example");
      scope.setExtra("someVariable", "some data");
      Sentry.captureException(message);
    });
  }

  return true;
}
export function breadCrumbs(user) {
  Sentry.addBreadcrumb({
    category: "auth",
    message: "Authenticated user " + user.email,
    level: Sentry.Severity.Info
  });
}
/*********************
 * Private Functions *
 *********************/

function shouldTrack() {
  console.error("Sentry Reporting is not initialized. Fine if this appears in a test.");
  return false;
}

export var levels = {
  /** JSDoc */
  Fatal: "fatal",

  /** JSDoc */
  Error: "error",

  /** JSDoc */
  Warning: "warning",

  /** JSDoc */
  Log: "log",

  /** JSDoc */
  Info: "info",

  /** JSDoc */
  Debug: "debug",

  /** JSDoc */
  Critical: "critical"
};