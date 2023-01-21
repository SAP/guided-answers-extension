import TelemetryReporter from '@vscode/extension-telemetry';
import { SELECT_NODE, SET_ACTIVE_TREE } from '@sap/guided-answers-extension-types';
import type { IDE, SendTelemetry } from '@sap/guided-answers-extension-types';
import { logString } from '../logger/logger';
import packageJson from '../../package.json';
import type {
    TelemetryEvent,
    TelemetryCommonProperties,
    TelemetryUIOpenTreeEventProps,
    TelemetryUIEventProps,
    TelemetryUISelectNodeEventProps
} from '../types';

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
        reporter = new TelemetryReporter('ga', packageJson.version, key);
    }
    return reporter;
}

/**
 * Set common properties which will be added to every telemetry event.
 *
 * @param properties - name/value pair of  properties
 * @param properties.ide - development environment VSCODE or SBAS
 * @param properties.devSpace - SBAS devspace
 * @param properties.apiHost - host for Guided Answers API
 * @param properties.apiVersion - version of Guided Answers API
 */
export function setCommonProperties(properties: { ide: IDE; devSpace: string; apiHost: string; apiVersion: string }) {
    commonProperties = {
        'cmn.appstudio': properties.ide === 'SBAS' ? 'true' : 'false',
        'cmn.devspace': properties.devSpace,
        apiHost: properties.apiHost,
        apiVersion: properties.apiVersion
    };
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

/**
 * Map redux action -> telemetry event properties
 */
const actionMap: {
    [action: string]: (action: SendTelemetry) => TelemetryUIEventProps;
} = {
    [SET_ACTIVE_TREE]: (action: SendTelemetry): TelemetryUIOpenTreeEventProps => ({
        action: 'OPEN_TREE',
        treeId: action.payload.action.type === SET_ACTIVE_TREE ? action.payload.action.payload.TREE_ID.toString() : '',
        treeTitle: action.payload.state.activeGuidedAnswer?.TITLE || ''
    }),
    [SELECT_NODE]: (action: SendTelemetry): TelemetryUISelectNodeEventProps => ({
        action: 'NODE_SELECTED',
        treeId: action.payload.action.type === SELECT_NODE ? action.payload.action.payload.toString() : '',
        treeTitle: action.payload.state.activeGuidedAnswer?.TITLE || '',
        lastNodeId: action.payload.state.activeGuidedAnswerNode.slice(-1)[0].NODE_ID.toString(),
        lastNodeTitle: action.payload.state.activeGuidedAnswerNode.slice(-1)[0].TITLE,
        nodeIdPath: action.payload.state.activeGuidedAnswerNode.map((node) => node.NODE_ID.toString()).join(':'),
        nodeLevel: action.payload.state.activeGuidedAnswerNode.length.toString()
    })
};

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
