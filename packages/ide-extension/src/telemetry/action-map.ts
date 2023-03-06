import { GO_TO_PREVIOUS_PAGE, SET_ACTIVE_TREE, UPDATE_ACTIVE_NODE } from '@sap/guided-answers-extension-types';
import type { AppState, SendTelemetry, SetActiveTree } from '@sap/guided-answers-extension-types';
import type {
    TelemetryUIEventProps,
    TelemetryUIGoToPreviousPage,
    TelemetryUIOpenTreeEventProps,
    TelemetryUISelectNodeEventProps
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
        ...getTreeNodeInfo(action.payload.state)
    }),
    [GO_TO_PREVIOUS_PAGE]: (action: SendTelemetry): TelemetryUIGoToPreviousPage => ({
        action: 'GO_BACK_IN_TREE',
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
    return {
        treeId: state.activeGuidedAnswer?.TREE_ID.toString() || '',
        treeTitle: state.activeGuidedAnswer?.TITLE || '',
        lastNodeId: state.activeGuidedAnswerNode.slice(-1)[0]?.NODE_ID.toString(),
        lastNodeTitle: state.activeGuidedAnswerNode.slice(-1)[0]?.TITLE,
        nodeIdPath: state.activeGuidedAnswerNode.map((node) => node.NODE_ID.toString()).join(':'),
        nodeLevel: state.activeGuidedAnswerNode.length.toString()
    };
}
