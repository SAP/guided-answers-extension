import type {
    GuidedAnswerNode,
    GuidedAnswerTree,
    GuidedAnswerTreeSearchResult
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
    pageSize: number;
    feedbackStatus: boolean;
    feedbackResponse: boolean;
}
