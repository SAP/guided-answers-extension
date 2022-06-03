import type { GuidedAnswerNode, GuidedAnswerTree } from '@sap/guided-answers-extension-types';

export interface AppState {
    query: string;
    guidedAnswerTrees: GuidedAnswerTree[];
    activeGuidedAnswerNode: GuidedAnswerNode[];
    activeGuidedAnswer?: GuidedAnswerTree;
    searchResultCount: number;
}
