import TelemetryReporter from '@vscode/extension-telemetry';
import type { IDE, SendTelemetry } from '@sap/guided-answers-extension-types';
import { logString } from '../logger/logger';
import packageJson from '../../package.json';
import type { TelemetryEvent, TelemetryCommonProperties } from '../types';
import { actionMap } from './action-map';

const key = 'ApplicationInsightsInstrumentationKeyPLACEH0LDER';

// Telemetry reporter client
let reporter: TelemetryReporter;

// Common properties that will be added to each event
let commonProperties: TelemetryCommonProperties | undefined;

/**
 * Initialize telemetry.
 *
 * @returns - telemetry reporter
 */
export function initTelemetry(): TelemetryReporter {
    if (!reporter) {
        commonProperties = undefined;
        reporter = new TelemetryReporter('ga', packageJson.version, key);
    }
    return reporter;
}

/**
 * Set common properties which will be added to every telemetry event.
 * If called without properties, all common properties are removed.
 *
 * @param properties - name/value pair of properties (optional)
 * @param properties.ide - development environment VSCODE or SBAS
 * @param properties.devSpace - SBAS devspace
 * @param properties.apiHost - host for Guided Answers API
 * @param properties.apiVersion - version of Guided Answers API
 */
export function setCommonProperties(properties?: { ide: IDE; devSpace: string; apiHost: string; apiVersion: string }) {
    commonProperties = properties
        ? {
              'cmn.appstudio': properties.ide === 'SBAS' ? 'true' : 'false',
              'cmn.devspace': properties.devSpace,
              apiHost: properties.apiHost,
              apiVersion: properties.apiVersion
          }
        : undefined;
}

/**
 * Track an even using telemetry.
 *
 * @param event - telemetry event
 */
export async function trackEvent(event: TelemetryEvent): Promise<void> {
    try {
        const properties = propertyValuesToString({ ...event.properties, ...(commonProperties || {}) });
        reporter.sendTelemetryEvent(event.name, properties);
        logString(`Telemetry event '${event.name}': ${JSON.stringify(properties)}`);
    } catch (error) {
        logString(`Error sending telemetry event ${(error as Error).message}`);
    }
}

/**
 * Map specified redux actions to to telemetry events and track them.
 *
 * @param action - action that occurred
 */
export async function trackAction(action: SendTelemetry): Promise<void> {
    if (actionMap[action.payload.action.type]) {
        const properties = actionMap[action.payload.action.type](action);
        trackEvent({ name: 'USER_INTERACTION', properties });
    }
}

/**
 * Ensure all property values are strings. While type TelemetryEventProperties defines the values
 * as string | number | any, the call sendTelemetryEvent() throws an exception if a non-string
 * property value is passed.
 *
 * @param properties - key/value map of properties
 * @returns - key/value map where all values are strings
 */
function propertyValuesToString(properties: { [key: string]: any }): { [key: string]: string } {
    for (const property in properties) {
        if (typeof properties[property] !== 'string') {
            properties[property] = properties[property].toString();
        }
    }
    return properties;
}
