import type { GuidedAnswerActions } from '@sap/guided-answers-extension-types';
import {
    UPDATE_GUIDED_ANSWER_TREES,
    UPDATE_ACTIVE_NODE,
    GO_TO_PREVIOUS_PAGE,
    SET_ACTIVE_TREE,
    SET_QUERY_VALUE
} from '@sap/guided-answers-extension-types';
import type { Reducer } from 'redux';
import type { AppState } from '../types';

/**
 * Return the initial app state.
 *
 * @returns - initial state of the app
 */
export function getInitialState(): AppState {
    return {
        query: '',
        guidedAnswerTrees: [],
        activeGuidedAnswerNode: []
    };
}

/**
 * Redux reducer implementation state + action => new state.
 *
 * @param state - current state
 * @param action - action to execute
 * @returns - new state
 */
export const reducer: Reducer<AppState, GuidedAnswerActions> = (
    state: AppState = getInitialState(),
    action: GuidedAnswerActions
): AppState => {
    const newState: AppState = JSON.parse(JSON.stringify(state)) as AppState;
    switch (action.type) {
        case UPDATE_GUIDED_ANSWER_TREES: {
            newState.guidedAnswerTrees = action.payload;
            delete newState.activeGuidedAnswer;
            break;
        }
        case UPDATE_ACTIVE_NODE: {
            const node = newState.activeGuidedAnswerNode.find((n) => n.NODE_ID === action.payload.NODE_ID);
            if (node) {
                newState.activeGuidedAnswerNode = newState.activeGuidedAnswerNode.slice(
                    0,
                    newState.activeGuidedAnswerNode.indexOf(node) + 1
                );
            } else {
                newState.activeGuidedAnswerNode.push(action.payload);
            }
            break;
        }
        case GO_TO_PREVIOUS_PAGE: {
            newState.activeGuidedAnswerNode.pop();
            if (newState.activeGuidedAnswerNode.length === 0) {
                delete newState.activeGuidedAnswer;
            }
            break;
        }
        case SET_ACTIVE_TREE: {
            newState.activeGuidedAnswer = action.payload;
            break;
        }
        case SET_QUERY_VALUE: {
            newState.query = action.payload;
            break;
        }
        default: {
            // Do nothing, newState is cloned old state
        }
    }
    return newState;
};