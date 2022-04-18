import type {
    Command,
    ExecuteCommand,
    GuidedAnswerTree,
    GuidedAnswerNode,
    GuidedAnswerNodeId,
    GoToPreviousPage,
    SearchTree,
    SelectNode,
    SetActiveTree,
    SetQueryValue,
    UpdateGuidedAnserTrees,
    UpdateActiveNode,
    WebviewReady
} from './types';
import {
    EXECUTE_COMMAND,
    GO_TO_PREVIOUS_PAGE,
    SELECT_NODE,
    SET_ACTIVE_TREE,
    SEARCH_TREE,
    SET_QUERY_VALUE,
    UPDATE_GUIDED_ANSWER_TREES,
    UPDATE_ACTIVE_NODE,
    WEBVIEW_READY
} from './types';

export const updateGuidedAnserTrees = (payload: GuidedAnswerTree[]): UpdateGuidedAnserTrees => ({
    type: UPDATE_GUIDED_ANSWER_TREES,
    payload
});

export const selectNode = (payload: GuidedAnswerNodeId): SelectNode => ({ type: SELECT_NODE, payload });

export const updateActiveNode = (payload: GuidedAnswerNode): UpdateActiveNode => ({
    type: UPDATE_ACTIVE_NODE,
    payload
});

export const goToPreviousPage = (): GoToPreviousPage => ({
    type: GO_TO_PREVIOUS_PAGE
});

export const executeCommand = (payload: Command): ExecuteCommand => ({
    type: EXECUTE_COMMAND,
    payload
});

export const setActiveTree = (payload: GuidedAnswerTree): SetActiveTree => ({
    type: SET_ACTIVE_TREE,
    payload
});

export const searchTree = (payload: string): SearchTree => ({
    type: SEARCH_TREE,
    payload
});

export const setQueryValue = (payload: string): SetQueryValue => ({
    type: SET_QUERY_VALUE,
    payload
});

export const webviewReady = (): WebviewReady => ({ type: WEBVIEW_READY });
