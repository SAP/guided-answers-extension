import type { WebviewPanel } from 'vscode';
import type { IDE, GuidedAnswerNodeId, GuidedAnswerTreeId, AppState } from '@sap/guided-answers-extension-types';

export * from './telemetry';

export interface Options {
    apiHost?: string;
    devSpace?: string;
    ide?: IDE;
    startOptions?: StartOptions;
    restore?: {
        webviewPanel: WebviewPanel;
        appState: AppState;
    };
}

export interface StartOptions {
    treeId: GuidedAnswerTreeId;
    nodeIdPath?: GuidedAnswerNodeId[];
    openToSide?: boolean;
    trigger?: string;
}
