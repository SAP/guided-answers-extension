import type { TelemetryEventProperties } from '@vscode/extension-telemetry';
import type { IDE } from '@sap/guided-answers-extension-types';

export type TelemetryEvent = TelemetryStartupEvent | TelemetryUserInteraction;

interface TelemetryBaseEvent {
    name: string;
    properties?: TelemetryEventProperties;
}

export interface TelemetryCommonProperties extends TelemetryEventProperties {
    ide: IDE;
    apiHost: string;
}

export interface TelemetryStartupEvent extends TelemetryBaseEvent {
    name: 'GA_STARTUP';
}

export interface TelemetryUserInteraction extends TelemetryBaseEvent {
    name: 'GA_USER_INTERACTION';
    properties: { action: string } & TelemetryEventProperties;
}
