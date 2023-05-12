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
    RESET_FILTERS
} from '@sap/guided-answers-extension-types';
import type {
    AppState,
    SendTelemetry,
    SetActiveTree,
    ExecuteCommand,
    UpdateGuidedAnswerTrees,
    UpdateActiveNode,
    SendFeedbackOutcome
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
    TelemetryUIClearFiltersProps
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
        treeCount: (action.payload.action as UpdateGuidedAnswerTrees).payload.trees?.length.toString() || '',
        productFilterCount:
            (action.payload.action as UpdateGuidedAnswerTrees).payload.productFilters?.length.toString() || '',
        componentFilterCount:
            (action.payload.action as UpdateGuidedAnswerTrees).payload.componentFilters?.length.toString() || ''
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
    [RESET_FILTERS]: (action: SendTelemetry): TelemetryUIClearFiltersProps => ({
        action: 'CLEAR_FILTERS',
        justOpened: action.payload.state.justOpened ? 'true' : 'false'
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
    return {
        treeId: state.activeGuidedAnswer?.TREE_ID.toString() || '',
        treeTitle: state.activeGuidedAnswer?.TITLE || '',
        lastNodeId: state.activeGuidedAnswerNode.slice(-1)[0]?.NODE_ID.toString(),
        lastNodeTitle: state.activeGuidedAnswerNode.slice(-1)[0]?.TITLE,
        nodeIdPath: state.activeGuidedAnswerNode.map((node) => node.NODE_ID.toString()).join(':'),
        nodeLevel: state.activeGuidedAnswerNode.length.toString()
    };
}
