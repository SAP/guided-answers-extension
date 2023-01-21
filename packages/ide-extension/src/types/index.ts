import type { IDE, GuidedAnswerNodeId, GuidedAnswerTreeId } from '@sap/guided-answers-extension-types';

export * from './telemetry';

export interface Options {
    apiHost?: string;
    devSpace?: string;
    ide?: IDE;
    startOptions?: StartOptions;
}

export interface StartOptions {
    treeId: GuidedAnswerTreeId;
    nodeIdPath?: GuidedAnswerNodeId[];
}
