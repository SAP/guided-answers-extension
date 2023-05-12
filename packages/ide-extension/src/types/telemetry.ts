import type { Disposable } from 'vscode';
import type { TelemetryClient } from 'applicationinsights';

export interface TelemetryReporter extends Disposable {
    client: TelemetryClient;
    commonProperties?: TelemetryCommonProperties;
    enabled: boolean;
}

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
    'common.os': string;
    'common.nodeArch': string;
    'common.platformversion': string;
    'common.extname': string;
    'common.extversion': string;
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
    isFinalNode: string;
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

export interface TelemetryUISelectOutcomeProps extends TelemetryUIEventProps {
    action: 'SELECT_OUTCOME';
    solved: string;
    treeId: string;
    treeTitle: string;
    lastNodeId: string;
    lastNodeTitle: string;
    nodeIdPath: string;
    nodeLevel: string;
}

export interface TelemetryUICommentProps extends TelemetryUIEventProps {
    action: 'COMMENT';
    treeId: string;
    treeTitle: string;
    lastNodeId: string;
    lastNodeTitle: string;
    nodeIdPath: string;
    nodeLevel: string;
}

export interface TelemetryUISearchProps extends TelemetryUIEventProps {
    action: 'SEARCH';
    treeCount: string;
    productFilterCount: string;
    componentFilterCount: string;
}

export interface TelemetryUIExecuteCommandProps extends TelemetryUIEventProps {
    action: 'EXECUTE_COMMAND';
    commandLabel: string;
    treeId: string;
    treeTitle: string;
    lastNodeId: string;
    lastNodeTitle: string;
    nodeIdPath: string;
    nodeLevel: string;
}

export interface TelemetryUIFilterComponentsProps extends TelemetryUIEventProps {
    action: 'FILTER_COMPONENTS';
}

export interface TelemetryUIFilterProductsProps extends TelemetryUIEventProps {
    action: 'FILTER_PRODUCTS';
}

export interface TelemetryUIOpenLinkProps extends TelemetryUIEventProps {
    action: 'OPEN_LINK';
}

export interface TelemetryUIShareLinkProps extends TelemetryUIEventProps {
    action: 'SHARE_LINK';
}

export interface TelemetryUIClearFiltersProps extends TelemetryUIEventProps {
    action: 'CLEAR_FILTERS';
    justOpened: string;
}
