import {
    GO_TO_PREVIOUS_PAGE,
    SET_ACTIVE_TREE,
    UPDATE_ACTIVE_NODE,
    SEND_FEEDBACK_OUTCOME,
    SEND_FEEDBACK_COMMENT,
    EXECUTE_COMMAND,
    SET_COMPONENT_FILTERS,
    SET_PRODUCT_FILTERS,
    UPDATE_GUIDED_ANSWER_TREES,
    OPEN_LINK_TELEMETRY,
    SHARE_LINK_TELEMETRY,
    RESET_FILTERS,
    GET_BOOKMARKS,
    UPDATE_BOOKMARKS,
    SYNCHRONIZE_BOOKMARK
} from '@sap/guided-answers-extension-types';
import type {
    AppState,
    SendTelemetry,
    SetActiveTree,
    ExecuteCommand,
    UpdateGuidedAnswerTrees,
    UpdateActiveNode,
    SendFeedbackOutcome,
    GetBookmarks,
    UpdateBookmarks
} from '@sap/guided-answers-extension-types';
import type {
    TelemetryUIEventProps,
    TelemetryUIGoToPreviousPage,
    TelemetryUIOpenTreeEventProps,
    TelemetryUISelectNodeEventProps,
    TelemetryUISelectOutcomeProps,
    TelemetryUICommentProps,
    TelemetryUISearchProps,
    TelemetryUIExecuteCommandProps,
    TelemetryUIFilterComponentsProps,
    TelemetryUIFilterProductsProps,
    TelemetryUIShareLinkProps,
    TelemetryUIOpenLinkProps,
    TelemetryUIClearFiltersProps,
    TelemetryUILoadBookmarksProps,
    TelemetryUIUpdateBookmarksProps,
    TelemetryUIClickBookmarkProps
} from '../types';

/**
 * Map redux action -> telemetry event properties
 * Requires respective redux action to be in allowedTelemetryActions in packages/webapp/src/webview/state/middleware.ts
 */
export const actionMap: {
    [action: string]: (action: SendTelemetry) => TelemetryUIEventProps;
} = {
    [SET_ACTIVE_TREE]: (action: SendTelemetry): TelemetryUIOpenTreeEventProps => ({
        action: 'OPEN_TREE',
        treeId: (action.payload.action as SetActiveTree).payload.TREE_ID.toString(),
        treeTitle: getTreeNodeInfo(action.payload.state).treeTitle
    }),
    [UPDATE_ACTIVE_NODE]: (action: SendTelemetry): TelemetryUISelectNodeEventProps => ({
        action: 'NODE_SELECTED',
        isFinalNode: (action.payload.action as UpdateActiveNode).payload.EDGES?.length === 0 ? 'true' : 'false',
        ...getTreeNodeInfo(action.payload.state)
    }),
    [GO_TO_PREVIOUS_PAGE]: (action: SendTelemetry): TelemetryUIGoToPreviousPage => ({
        action: 'GO_BACK_IN_TREE',
        ...getTreeNodeInfo(action.payload.state)
    }),
    [SEND_FEEDBACK_OUTCOME]: (action: SendTelemetry): TelemetryUISelectOutcomeProps => ({
        action: 'SELECT_OUTCOME',
        solved: (action.payload.action as SendFeedbackOutcome).payload.solved ? 'true' : 'false',
        ...getTreeNodeInfo(action.payload.state)
    }),
    [SEND_FEEDBACK_COMMENT]: (action: SendTelemetry): TelemetryUICommentProps => ({
        action: 'COMMENT',
        ...getTreeNodeInfo(action.payload.state)
    }),
    [UPDATE_GUIDED_ANSWER_TREES]: (action: SendTelemetry): TelemetryUISearchProps => ({
        action: 'SEARCH',
        treeCount:
            (action.payload.action as UpdateGuidedAnswerTrees).payload.searchResult.trees?.length.toString() || '',
        productFilterCount:
            (action.payload.action as UpdateGuidedAnswerTrees).payload.searchResult.productFilters?.length.toString() ||
            '',
        componentFilterCount:
            (
                action.payload.action as UpdateGuidedAnswerTrees
            ).payload.searchResult.componentFilters?.length.toString() || ''
    }),
    [EXECUTE_COMMAND]: (action: SendTelemetry): TelemetryUIExecuteCommandProps => ({
        action: 'EXECUTE_COMMAND',
        commandLabel: (action.payload.action as ExecuteCommand).payload.label || '',
        ...getTreeNodeInfo(action.payload.state)
    }),
    [SET_COMPONENT_FILTERS]: (): TelemetryUIFilterComponentsProps => ({
        action: 'FILTER_COMPONENTS'
    }),
    [SET_PRODUCT_FILTERS]: (): TelemetryUIFilterProductsProps => ({
        action: 'FILTER_PRODUCTS'
    }),
    [OPEN_LINK_TELEMETRY]: (): TelemetryUIOpenLinkProps => ({
        action: 'OPEN_LINK'
    }),
    [SHARE_LINK_TELEMETRY]: (): TelemetryUIShareLinkProps => ({
        action: 'SHARE_LINK'
    }),
    [RESET_FILTERS]: (): TelemetryUIClearFiltersProps => ({
        action: 'CLEAR_FILTERS'
    }),
    [GET_BOOKMARKS]: (action: SendTelemetry): TelemetryUILoadBookmarksProps => ({
        action: 'LOAD_BOOKMARKS',
        count: Object.keys((action.payload.action as GetBookmarks).payload).length.toString()
    }),
    [UPDATE_BOOKMARKS]: (action: SendTelemetry): TelemetryUIUpdateBookmarksProps => {
        const bookmarkKey = (action.payload.action as UpdateBookmarks).payload.bookmarkKey;

        let mappedAction: 'ADD_BOOKMARK' | 'REMOVE_BOOKMARK' | 'SYNC_BOOKMARK';
        if (!bookmarkKey) {
            mappedAction = 'SYNC_BOOKMARK';
        } else if (Object.keys(action.payload.state.bookmarks).includes(bookmarkKey)) {
            mappedAction = 'ADD_BOOKMARK';
        } else {
            mappedAction = 'REMOVE_BOOKMARK';
        }

        return {
            action: mappedAction,
            ...getTreeNodeInfo(action.payload.state)
        };
    },
    [SYNCHRONIZE_BOOKMARK]: (action: SendTelemetry): TelemetryUIClickBookmarkProps => ({
        action: 'CLICK_BOOKMARK',
        ...getTreeNodeInfo(action.payload.state)
    })
};

/**
 * Extract tree and node information from the state.
 *
 * @param state - application state
 * @returns - tree and node information
 */
function getTreeNodeInfo(state: AppState): {
    treeId: string;
    treeTitle: string;
    lastNodeId: string;
    lastNodeTitle: string;
    nodeIdPath: string;
    nodeLevel: string;
} {
    const treeId = state.activeGuidedAnswer?.TREE_ID.toString() ?? '';
    const nodeIdPath = state.activeGuidedAnswerNode.map((node) => node.NODE_ID.toString()).join(':');

    return {
        treeId,
        treeTitle: state.activeGuidedAnswer?.TITLE ?? '',
        lastNodeId: state.activeGuidedAnswerNode.slice(-1)[0]?.NODE_ID.toString(),
        lastNodeTitle: state.activeGuidedAnswerNode.slice(-1)[0]?.TITLE,
        nodeIdPath,
        nodeLevel: state.activeGuidedAnswerNode.length.toString()
    };
}
