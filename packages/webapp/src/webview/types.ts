import type {
    GuidedAnswerNode,
    GuidedAnswerTree,
    GuidedAnswerTreeSearchResult,
    GuidedAnswerTreeSearchHit
} from '@sap/guided-answers-extension-types';

export interface AppState {
    loading: boolean;
    query: string;
    guidedAnswerTreeSearchResult: GuidedAnswerTreeSearchResult;
    activeGuidedAnswerNode: GuidedAnswerNode[];
    activeGuidedAnswer?: GuidedAnswerTree;
    betaFeatures: boolean;
    searchResultCount: number;
    guideFeedback: null | boolean;
    selectedProductFilters: string[];
    selectedComponentFilters: string[];
    updatedGuidedAnswerTrees: GuidedAnswerTreeSearchHit[];
    currentOffset: number;
}
