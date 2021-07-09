'use strict';

import _ from 'underscore';
import { isServerSide } from './misc';
import * as Sentry from "@sentry/react";
import { Integrations } from "@sentry/tracing";


const state = null;

/**
 * Initialize Sentry Reporting. Call this from app.js on initial mount perhaps.
 *
 * @export
 * @param {string} [dsn] - Sentry dsn.
 * @param {Object} [context] - Current page content / JSON, to get details about Item, etc.
 * @param {Object} [options] - Extra options.
 * @returns {boolean} true if initialized.
 */
export function initializeSentry(dsn = null, appOptions = {}){

    if (dsn === null || typeof dsn !== 'string'){
        throw new Error("No dsn provided");
    }

    if (isServerSide()) return false;

    Sentry.init({
        dsn: dsn,
        integrations: [new Integrations.BrowserTracing()],
        environment:'prod',
        maxBreadcrumbs:100,
        // Set tracesSampleRate to 1.0 to capture 100%
        // of transactions for performance monitoring.
        // We recommend adjusting this value in production
        tracesSampleRate: 1.0,
    });

    if (!shouldTrack()){
        console.error("EXITING ANALYTICS INITIALIZATION.");
        return false;
    }
    console.info("Sentry: Initialized");

    return true;
}

/**
 *
 */
export function captureException(message, level = Sentry.Severity.Warning, fatal = false){

    if (!shouldTrack()) return false;

    Sentry.withScope(function(scope) {
        scope.setLevel(level);
        Sentry.captureException(message);
    });
    //Sentry.captureException(message);
    return true;
}

/*********************
 * Private Functions *
 *********************/

function shouldTrack(){

    if (!state) {
        console.error("Sentry Reporting is not initialized. Fine if this appears in a test.");
        return false;
    }

    if (!state.enabled) {
        console.warn("Sentry Reporting is not enabled. Fine if expected, else check config.");
        return false;
    }

    if (isServerSide()){
        console.warn("Sentry Reporting will not be sent events while serverside. Fine if this appears in a test.");
        return false;
    }

    if (typeof window.Sentry === 'undefined') {
        console.error("Sentry Reporting library is not loaded/available. Fine if disabled via AdBlocker, else check `reporting.js` loading.");
        return false;
    }

    return true;
}

export const levels = {
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


