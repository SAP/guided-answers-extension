export interface TelemetryEventProperties {
    readonly [key: string]: string;
}

export type TelemetryEvent = TelemetryStartupEvent | TelemetryUIEvent;

interface TelemetryBaseEvent {
    name: string;
    properties?: TelemetryEventProperties;
}

export interface TelemetryCommonProperties extends TelemetryEventProperties {
    'cmn.appstudio': 'true' | 'false';
    'cmn.devspace': string;
    apiHost: string;
    apiVersion: string;
}

export interface TelemetryStartupEvent extends TelemetryBaseEvent {
    name: 'STARTUP';
    properties: {
        treeId: string;
        nodeIdPath: string;
    };
}

export interface TelemetryUIEvent extends TelemetryBaseEvent {
    name: 'USER_INTERACTION';
    properties: TelemetryUIEventProps;
}

export interface TelemetryUIEventProps extends TelemetryEventProperties {
    action: string;
    [prop: string]: string;
}

export interface TelemetryUIOpenTreeEventProps extends TelemetryUIEventProps {
    action: 'OPEN_TREE';
    treeId: string;
    treeTitle: string;
}

export interface TelemetryUISelectNodeEventProps extends TelemetryUIEventProps {
    action: 'NODE_SELECTED';
    treeId: string;
    treeTitle: string;
    lastNodeId: string;
    lastNodeTitle: string;
    nodeIdPath: string;
    nodeLevel: string;
}

export interface TelemetryUIGoToPreviousPage extends TelemetryUIEventProps {
    action: 'GO_BACK_IN_TREE';
    treeId: string;
    treeTitle: string;
    lastNodeId: string;
    lastNodeTitle: string;
    nodeIdPath: string;
    nodeLevel: string;
}
