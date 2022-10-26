import type { IDE, GuidedAnswerNodeId, GuidedAnswerTreeId } from '@sap/guided-answers-extension-types';

export interface Options {
    startOptions?: StartOptions;
    ide?: IDE;
}

export interface StartOptions {
    treeId: GuidedAnswerTreeId;
    nodeIdPath?: GuidedAnswerNodeId[];
}
