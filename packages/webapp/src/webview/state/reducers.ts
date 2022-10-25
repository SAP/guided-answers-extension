import type { GuidedAnswerActions } from '@sap/guided-answers-extension-types';
import {
    UPDATE_GUIDED_ANSWER_TREES,
    UPDATE_ACTIVE_NODE,
    UPDATE_LOADING,
    GO_TO_PREVIOUS_PAGE,
    GO_TO_ALL_ANSWERS,
    RESTART_ANSWER,
    SET_ACTIVE_TREE,
    SET_QUERY_VALUE,
    GUIDE_FEEDBACK,
    BETA_FEATURES,
    SEARCH_TREE,
    SET_PRODUCT_FILTERS,
    SET_COMPONENT_FILTERS,
    RESET_FILTERS
} from '@sap/guided-answers-extension-types';
import i18next from 'i18next';
import type { Reducer } from 'redux';
import type { AppState } from '../types';

/**
 * Return the initial app state.
 *
 * @returns - initial state of the app
 */
export function getInitialState(): AppState {
    return {
        loading: true,
        query: '',
        guidedAnswerTreeSearchResult: {
            resultSize: -1,
            componentFilters: [],
            productFilters: [],
            trees: []
        },
        updatedGuidedAnswerTrees: [],
        activeGuidedAnswerNode: [],
        betaFeatures: false,
        searchResultCount: -1,
        guideFeedback: null,
        selectedProductFilters: [],
        selectedComponentFilters: [],
        currentOffset: 0
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
            newState.guidedAnswerTreeSearchResult = action.payload;
            newState.updatedGuidedAnswerTrees = [...newState.updatedGuidedAnswerTrees, ...action.payload.trees]
                .filter((value, index, self) => index === self.findIndex((t) => t.TREE_ID === value.TREE_ID))
                .sort((a, b) => {
                    return b.SCORE - a.SCORE;
                });
            // newState.updatedGuidedAnswerTrees = newState.updatedGuidedAnswerTrees.concat(action.payload.trees);
            newState.currentOffset = newState.currentOffset + 20;
            delete newState.activeGuidedAnswer;
            break;
        }
        case UPDATE_ACTIVE_NODE: {
            const node = newState.activeGuidedAnswerNode.find((n) => n.NODE_ID === action.payload.NODE_ID);
            if (newState.guideFeedback === false) {
                newState.guideFeedback = null;
                newState.activeGuidedAnswerNode.pop();
            }
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
        case UPDATE_LOADING: {
            newState.loading = action.payload;
            break;
        }
        case GO_TO_PREVIOUS_PAGE: {
            if (newState.activeGuidedAnswerNode.length > 0 && newState.guideFeedback !== false) {
                newState.activeGuidedAnswerNode.pop();
            }
            if (newState.guideFeedback === false) {
                newState.guideFeedback = null;
                newState.activeGuidedAnswerNode.pop();
            }
            break;
        }
        case GO_TO_ALL_ANSWERS: {
            newState.guideFeedback = null;
            newState.activeGuidedAnswerNode = [];
            delete newState.activeGuidedAnswer;
            break;
        }
        case RESTART_ANSWER: {
            newState.activeGuidedAnswerNode = [newState.activeGuidedAnswerNode[0]];
            newState.guideFeedback = null;
            break;
        }
        case SET_ACTIVE_TREE: {
            newState.activeGuidedAnswer = action.payload;
            break;
        }
        case SET_QUERY_VALUE: {
            newState.updatedGuidedAnswerTrees = [];
            newState.currentOffset = 0;
            newState.query = action.payload;
            break;
        }
        case BETA_FEATURES: {
            newState.betaFeatures = action.payload;
            break;
        }
        case GUIDE_FEEDBACK: {
            newState.guideFeedback = action.payload;
            if (action.payload === false) {
                newState.activeGuidedAnswerNode.push({
                    NODE_ID: 99999,
                    TITLE: i18next.t('ISSUE_IS_NOT_RESOLVED'),
                    BODY: '',
                    QUESTION: '',
                    EDGES: []
                });
            }
            break;
        }
        case SET_PRODUCT_FILTERS: {
            newState.selectedProductFilters = action.payload;
            newState.updatedGuidedAnswerTrees = [];
            break;
        }
        case SET_COMPONENT_FILTERS: {
            newState.selectedComponentFilters = action.payload;
            newState.updatedGuidedAnswerTrees = [];
            break;
        }
        case RESET_FILTERS: {
            newState.currentOffset = 0;
            newState.selectedProductFilters = [];
            newState.selectedComponentFilters = [];
            break;
        }
        case SEARCH_TREE: {
            const selectedComponentFilters = action.payload?.filters?.component;
            newState.selectedComponentFilters = Array.isArray(selectedComponentFilters) ? selectedComponentFilters : [];
            const selectedProductFilters = action.payload?.filters?.product;
            newState.selectedProductFilters = Array.isArray(selectedProductFilters) ? selectedProductFilters : [];
            break;
        }
        default: {
            // Do nothing, newState is cloned old state
        }
    }
    return newState;
};
