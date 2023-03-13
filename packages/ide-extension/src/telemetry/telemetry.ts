import { platform, arch, release } from 'os';
import { env, workspace } from 'vscode';
import type { Disposable } from 'vscode';
import { TelemetryClient } from 'applicationinsights';
import type { Contracts } from 'applicationinsights';
import type { IDE, SendTelemetry } from '@sap/guided-answers-extension-types';
import { logString } from '../logger/logger';
import packageJson from '../../package.json';
import type { TelemetryEvent, TelemetryCommonProperties } from '../types';
import { actionMap } from './action-map';

const key = 'ApplicationInsightsInstrumentationKeyPLACEH0LDER';

// Central telemetry switch, set according to setting
let telemetryEnabled = false;

// Telemetry reporter client
let reporter: TelemetryClient;

// Common properties that will be added to each event
let commonProperties: TelemetryCommonProperties | undefined;

/**
 * Initialize telemetry.
 *
 * @returns - telemetry reporter
 */
export function initTelemetry(): Disposable {
    const disposables: Disposable[] = [];
    if (!reporter) {
        const telemetryClient = new TelemetryClient(key);
        telemetryClient.channel.setUseDiskRetryCaching(true);
        telemetryClient.addTelemetryProcessor((envelope: Contracts.Envelope) => {
            envelope.tags['ai.location.ip'] = '0.0.0.0';
            envelope.tags['ai.cloud.roleInstance'] = 'masked';
            return true;
        });
        telemetryClient.context.tags[telemetryClient.context.keys.userId] = env.machineId;
        telemetryClient.context.tags[telemetryClient.context.keys.sessionId] = env.sessionId;
        telemetryClient.context.tags[telemetryClient.context.keys.cloudRole] = env.appName;
        reporter = telemetryClient;
        updateTelemetryStatus();
        disposables.push(workspace.onDidChangeConfiguration(() => updateTelemetryStatus()));
    }
    return {
        dispose: () => {
            disposables.forEach((d) => d.dispose());
        }
    };
}

function updateTelemetryStatus() {
    telemetryEnabled = !!workspace.getConfiguration('sap.ux.guidedAnswer').get('telemetryEnabled');
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
              apiVersion: properties.apiVersion,
              'common.os': platform(),
              'common.nodeArch': arch(),
              'common.platformversion': (release() || '').replace(/^(\d+)(\.\d+)?(\.\d+)?(.*)/, '$1$2$3'),
              'common.extname': packageJson.name,
              'common.extversion': packageJson.version
          }
        : undefined;
}

/**
 * Track an even using telemetry.
 *
 * @param event - telemetry event
 */
export async function trackEvent(event: TelemetryEvent): Promise<void> {
    if (!telemetryEnabled) {
        return;
    }
    try {
        const name = `${packageJson.name}/${event.name}`;
        const properties = propertyValuesToString({ ...event.properties, ...(commonProperties || {}) });
        reporter.trackEvent({ name, properties });
        logString(`Telemetry event '${event.name}': ${JSON.stringify(properties)}`);
    } catch (error) {
        logString(`Error sending telemetry event '${event.name}': ${(error as Error).message}`);
    }
}

/**
 * Map specified redux actions to to telemetry events and track them.
 *
 * @param action - action that occurred
 */
export async function trackAction(action: SendTelemetry): Promise<void> {
    if (actionMap[action.payload.action.type]) {
        try {
            const properties = actionMap[action.payload.action.type](action);
            trackEvent({ name: 'USER_INTERACTION', properties });
        } catch (error) {
            logString(`Error sending telemetry action '${action.payload.action.type}': ${(error as Error).message}`);
        }
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
