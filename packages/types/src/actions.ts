import type {
    Command,
    ExecuteCommand,
    GuidedAnswerTree,
    GuidedAnswerNode,
    GuidedAnswerNodeId,
    GoToPreviousPage,
    GoToAllAnswers,
    RestartAnswer,
    SearchTree,
    SelectNode,
    SetActiveTree,
    SetQueryValue,
    UpdateGuidedAnswerTrees,
    UpdateActiveNode,
    WebviewReady,
    UpdateLoading,
    GuidedAnswerTreeSearchResult,
    GuidedAnswersQueryOptions,
    BetaFeatures,
    SetProductFilters,
    SetComponentFilters,
    ResetFilters
} from './types';
import {
    EXECUTE_COMMAND,
    GO_TO_PREVIOUS_PAGE,
    GO_TO_ALL_ANSWERS,
    RESTART_ANSWER,
    SELECT_NODE,
    SET_ACTIVE_TREE,
    SEARCH_TREE,
    SET_QUERY_VALUE,
    UPDATE_GUIDED_ANSWER_TREES,
    UPDATE_ACTIVE_NODE,
    UPDATE_LOADING,
    WEBVIEW_READY,
    BETA_FEATURES,
    SET_PRODUCT_FILTERS,
    SET_COMPONENT_FILTERS,
    RESET_FILTERS
} from './types';

export const updateGuidedAnswerTrees = (payload: GuidedAnswerTreeSearchResult): UpdateGuidedAnswerTrees => ({
    type: UPDATE_GUIDED_ANSWER_TREES,
    payload
});

export const selectNode = (payload: GuidedAnswerNodeId): SelectNode => ({ type: SELECT_NODE, payload });

export const updateActiveNode = (payload: GuidedAnswerNode): UpdateActiveNode => ({
    type: UPDATE_ACTIVE_NODE,
    payload
});

export const updateLoading = (payload: boolean): UpdateLoading => ({
    type: UPDATE_LOADING,
    payload
});

export const goToPreviousPage = (): GoToPreviousPage => ({
    type: GO_TO_PREVIOUS_PAGE
});

export const goToAllAnswers = (): GoToAllAnswers => ({
    type: GO_TO_ALL_ANSWERS
});

export const restartAnswer = (): RestartAnswer => ({
    type: RESTART_ANSWER
});

export const executeCommand = (payload: Command): ExecuteCommand => ({
    type: EXECUTE_COMMAND,
    payload
});

export const setActiveTree = (payload: GuidedAnswerTree): SetActiveTree => ({
    type: SET_ACTIVE_TREE,
    payload
});

export const searchTree = (payload: GuidedAnswersQueryOptions): SearchTree => ({
    type: SEARCH_TREE,
    payload
});

export const setQueryValue = (payload: string): SetQueryValue => ({
    type: SET_QUERY_VALUE,
    payload
});

export const getBetaFeatures = (payload: boolean): BetaFeatures => ({
    type: BETA_FEATURES,
    payload
});

export const setProductFilters = (payload: string[]): SetProductFilters => ({
    type: SET_PRODUCT_FILTERS,
    payload
});

export const setComponentFilters = (payload: string[]): SetComponentFilters => ({
    type: SET_COMPONENT_FILTERS,
    payload
});

export const resetFilters = (): ResetFilters => ({
    type: RESET_FILTERS
});

export const webviewReady = (): WebviewReady => ({ type: WEBVIEW_READY });
