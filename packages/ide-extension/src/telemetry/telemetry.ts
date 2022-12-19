import TelemetryReporter from '@vscode/extension-telemetry';
import { logString } from '../logger/logger';
import packageJson from '../../package.json';
import type { TelemetryCommonProperties, TelemetryEvent } from '../types';

const key = 'ApplicationInsightsInstrumentationKeyPLACEH0LDER';

// Telemetry reporter client
let reporter: TelemetryReporter;

// Common properties that will be included with every event
let commonProperties: TelemetryCommonProperties;

/**
 * Initialize telemetry.
 *
 * @returns - telemetry reporter
 */
export function initTelemetry(): TelemetryReporter {
    if (!reporter) {
        reporter = new TelemetryReporter(packageJson.name, packageJson.version, key);
    }
    return reporter;
}

/**
 * Set common properties which will be added to every telemetry event.
 *
 * @param commonProps - name/value map of common properties
 */
export function setCommonProperties(commonProps: TelemetryCommonProperties) {
    commonProperties = commonProps;
}

/**
 * Ensure all property values are strings. While type TelemetryEventProperties defines the values
 * as string | number | any, the call sendTelemetryEvent() throws an exception if a non-string
 * property value is passed.
 *
 * @param properties - key/value map of properties
 * @returns - key/value map where all values are strings
 */
function propertiesToString(properties: { [key: string]: any }): { [key: string]: string } {
    for (const property in properties) {
        if (typeof properties[property] !== 'string') {
            properties[property] = properties[property].toString();
        }
    }
    return properties;
}

/**
 * Track an even using telemetry.
 *
 * @param event - telemetry event
 */
export async function trackEvent(event: TelemetryEvent): Promise<void> {
    try {
        const properties = propertiesToString({ ...event.properties, ...(commonProperties || {}) });
        reporter.sendTelemetryEvent(event.name, properties);
        logString(`Telemetry event '${event.name}': ${JSON.stringify(properties)}`);
    } catch (error) {
        logString(`Error sending telemetry event ${(error as Error).message}`);
    }
}
