import type {
    BetaFeatures,
    GetBookmarks,
    GuidedAnswerActions,
    GuideFeedback,
    RestoreState,
    SearchTree,
    SetActiveTree,
    SetComponentFilters,
    SetProductFilters,
    SetQueryValue,
    UpdateActiveNode,
    UpdateActiveNodeSharing,
    UpdateBookmarks,
    UpdateGuidedAnswerTrees,
    UpdateNetworkStatus,
    SetPageSize,
    FeedbackResponse,
    FeedbackStatus,
    GuidedAnswerNode,
    GetLastVisitedGuides,
    SetQuickFilters
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
        networkStatus: 'LOADING',
        query: '',
        guidedAnswerTreeSearchResult: {
            resultSize: -1,
            componentFilters: [],
            productFilters: [],
            trees: []
        },
        activeNodeSharing: null,
        activeGuidedAnswerNode: [],
        betaFeatures: false,
        guideFeedback: null,
        selectedProductFilters: [],
        selectedComponentFilters: [],
        pageSize: 20,
        feedbackStatus: false,
        feedbackResponse: false,
        bookmarks: {},
        activeScreen: 'HOME',
        lastVisitedGuides: [],
        quickFilters: []
    };
}

/**
 * Some type magic to convert a union type to an intersection type. We need this to convert the union type GuidedAnswerActions
 * into an intersection type to used in the reducer map.
 */
type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

/**
 * Define the type for case reducer map
 */
type Reducers = {
    [actionType in GuidedAnswerActions['type']]: (
        newState: AppState,
        action: UnionToIntersection<GuidedAnswerActions>
    ) => AppState;
};

/**
 * Map of action type to case reducer
 */
const reducers: Partial<Reducers> = {
    UPDATE_GUIDED_ANSWER_TREES: updateGuidedAnswerTreesReducer,
    UPDATE_ACTIVE_NODE: updateActiveNodeReducer,
    UPDATE_NETWORK_STATUS: updateNetworkStatusReducer,
    UPDATE_ACTIVE_NODE_SHARING: updateActiveNodeSharingReducer,
    GO_TO_PREVIOUS_PAGE: goToPreviousPageReducer,
    GO_TO_ALL_ANSWERS: goToAllAnswersReducer,
    RESTART_ANSWER: restartAnswerReducer,
    GO_TO_HOME_PAGE: goToHomePageReducer,
    SET_ACTIVE_TREE: setActiveTreeReducer,
    SET_QUERY_VALUE: setQueryValueReducer,
    BETA_FEATURES: betaFeaturesReducer,
    GUIDE_FEEDBACK: GuideFeedbackReducer,
    SET_PRODUCT_FILTERS: setProductFiltersReducer,
    SET_COMPONENT_FILTERS: setComponentFiltersReducer,
    RESET_FILTERS: resetFiltersReducer,
    RESTORE_STATE: restoreStateReducer,
    SEARCH_TREE: searchTreeReducer,
    SET_PAGE_SIZE: updatePageSize,
    FEEDBACK_RESPONSE: feedbackResponseReducer,
    FEEDBACK_STATUS: feedbackStatusReducer,
    GET_BOOKMARKS: getBookmarksReducer,
    UPDATE_BOOKMARKS: updateBookmarksReducer,
    GET_LAST_VISITED_GUIDES: getLastVisitedGuidesReducer,
    SET_QUICK_FILTERS: setQuickFiltersReducer
};

/**
 * Redux reducer implementation state + action => new state.
 *
 * @param state - current state
 * @param action - action to execute
 * @returns - new state
 */
export const reducer: Reducer<AppState, GuidedAnswerActions> = (
    state: AppState = getInitialState(),
    action: GuidedAnswerActions = {} as GuidedAnswerActions // avoid default-param-last issue for state argument
): AppState => {
    const caseReducer = reducers[action.type];
    if (typeof caseReducer === 'function') {
        return caseReducer(cloneState(state), action as UnionToIntersection<GuidedAnswerActions>);
    }
    return state;
};

/**
 * Return a clone of the state.
 *
 * @param state - state to clone
 * @returns - cloned state
 */
function cloneState(state: AppState): AppState {
    return JSON.parse(JSON.stringify(state)) as AppState;
}

/**
 * Update list of Guided Answers trees, usually as result of search.
 *
 * @param newState - already cloned state that is modified and returned
 * @param action - action with payload
 * @returns new state with changes
 */
function updateGuidedAnswerTreesReducer(newState: AppState, action: UpdateGuidedAnswerTrees): AppState {
    const trees = newState.guidedAnswerTreeSearchResult.trees;
    newState.guidedAnswerTreeSearchResult = action.payload.searchResult;
    if ((action.payload?.pagingOptions?.offset ?? 0) > 0) {
        newState.guidedAnswerTreeSearchResult.trees.unshift(...trees);
    }
    delete newState.activeGuidedAnswer;
    newState.activeScreen = 'SEARCH';
    return newState;
}

/**
 * Set new Guided Answers node as active, which might involve adding a new node or slicing the
 * array in case the node is already in the list of nodes.
 *
 * @param newState - already cloned state that is modified and returned
 * @param action - action with payload
 * @returns new state with changes
 */
function updateActiveNodeReducer(newState: AppState, action: UpdateActiveNode): AppState {
    const node = newState.activeGuidedAnswerNode.find((n: GuidedAnswerNode) => n.NODE_ID === action.payload.NODE_ID);
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
    newState.activeScreen = 'NODE';
    return newState;
}

/**
 * Update property 'activeNodeSharing' with links. If null is passed as payload, property will be
 * removed.
 *
 * @param newState - already cloned state that is modified and returned
 * @param action - action with payload
 * @returns new state with changes
 */
function updateActiveNodeSharingReducer(newState: AppState, action: UpdateActiveNodeSharing): AppState {
    newState.activeNodeSharing = action.payload;
    return newState;
}

/**
 * Update the network status.
 *
 * @param newState - already cloned state that is modified and returned
 * @param action - action with payload
 * @returns new state with changes
 */
function updateNetworkStatusReducer(newState: AppState, action: UpdateNetworkStatus): AppState {
    newState.networkStatus = action.payload;
    return newState;
}

/**
 * Go to previous Guided Answers node.
 *
 * @param newState - already cloned state that is modified and returned
 * @returns new state with changes
 */
function goToPreviousPageReducer(newState: AppState): AppState {
    if (newState.activeGuidedAnswerNode.length > 0 && newState.guideFeedback !== false) {
        newState.activeGuidedAnswerNode.pop();
    }
    if (newState.guideFeedback === false) {
        newState.guideFeedback = null;
        newState.activeGuidedAnswerNode.pop();
    }
    if (newState.activeGuidedAnswerNode.length === 0) {
        newState.activeScreen = 'SEARCH';
    }
    return newState;
}

/**
 * Go back to the list of Guided Answers trees.
 *
 * @param newState - already cloned state that is modified and returned
 * @returns new state with changes
 */
function goToAllAnswersReducer(newState: AppState): AppState {
    newState.guideFeedback = null;
    newState.activeGuidedAnswerNode = [];
    delete newState.activeGuidedAnswer;
    newState.activeScreen = 'SEARCH';
    return newState;
}

/**
 * Go back to the first node of a Guided Answers tree.
 *
 * @param newState - already cloned state that is modified and returned
 * @returns new state with changes
 */
function restartAnswerReducer(newState: AppState): AppState {
    newState.activeGuidedAnswerNode = [newState.activeGuidedAnswerNode[0]];
    newState.guideFeedback = null;
    return newState;
}

/**
 * Go to home page.
 *
 * @param newState - already cloned state that is modified and returned
 * @returns new state with changes
 */
function goToHomePageReducer(newState: AppState): AppState {
    newState.activeScreen = 'HOME';
    newState.query = '';
    newState.activeNodeSharing = null;
    newState.activeGuidedAnswerNode = [];
    newState.selectedComponentFilters = [];
    newState.selectedProductFilters = [];
    newState.guidedAnswerTreeSearchResult.componentFilters = [];
    newState.guidedAnswerTreeSearchResult.productFilters = [];
    return newState;
}

/**
 * Set the active Guided Answers tree.
 *
 * @param newState - already cloned state that is modified and returned
 * @param action - action with payload
 * @returns new state with changes
 */
function setActiveTreeReducer(newState: AppState, action: SetActiveTree): AppState {
    newState.activeGuidedAnswer = action.payload;
    return newState;
}

/**
 * Store the search query in state.
 *
 * @param newState - already cloned state that is modified and returned
 * @param action - action with payload
 * @returns new state with changes
 */
function setQueryValueReducer(newState: AppState, action: SetQueryValue): AppState {
    newState.guidedAnswerTreeSearchResult = {
        resultSize: -1,
        componentFilters: [],
        productFilters: [],
        trees: []
    };
    newState.query = action.payload;
    return newState;
}

/**
 * Set feature toggles.
 *
 * @param newState - already cloned state that is modified and returned
 * @param action - action with payload
 * @returns new state with changes
 */
function betaFeaturesReducer(newState: AppState, action: BetaFeatures): AppState {
    newState.betaFeatures = action.payload;
    return newState;
}

/**
 * Set state for feedback.
 *
 * @param newState - already cloned state that is modified and returned
 * @param action - action with payload
 * @returns new state with changes
 */
function GuideFeedbackReducer(newState: AppState, action: GuideFeedback): AppState {
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
    return newState;
}

/**
 * Set state for feedback response.
 *
 * @param newState - already cloned state that is modified and returned
 * @param action - action with payload
 * @returns new state with changes
 */
function feedbackResponseReducer(newState: AppState, action: FeedbackResponse): AppState {
    newState.feedbackResponse = action.payload;
    return newState;
}

/**
 * Set state for bookmarks.
 *
 * @param newState - already cloned state that is modified and returned
 * @param action - action with payload
 * @returns new state with changes
 */
function getBookmarksReducer(newState: AppState, action: GetBookmarks): AppState {
    newState.bookmarks = action.payload;
    return newState;
}

/**
 * Set state for last visited guides.
 *
 * @param newState - already cloned state that is modified and returned
 * @param action - action with payload
 * @returns new state with changes
 */
function getLastVisitedGuidesReducer(newState: AppState, action: GetLastVisitedGuides): AppState {
    newState.lastVisitedGuides = action.payload;
    return newState;
}

/**
 * Set state for feedback status.
 *
 * @param newState - already cloned state that is modified and returned
 * @param action - action with payload
 * @returns new state with changes
 */
function feedbackStatusReducer(newState: AppState, action: FeedbackStatus): AppState {
    newState.feedbackStatus = action.payload;
    return newState;
}

/**
 * Set filter for products.
 *
 * @param newState - already cloned state that is modified and returned
 * @param action - action with payload
 * @returns new state with changes
 */
function setProductFiltersReducer(newState: AppState, action: SetProductFilters): AppState {
    newState.selectedProductFilters = action.payload;
    newState.guidedAnswerTreeSearchResult.trees = [];
    return newState;
}

/**
 * Set filter for components.
 *
 * @param newState - already cloned state that is modified and returned
 * @param action - action with payload
 * @returns new state with changes
 */
function setComponentFiltersReducer(newState: AppState, action: SetComponentFilters): AppState {
    newState.selectedComponentFilters = action.payload;
    newState.guidedAnswerTreeSearchResult.trees = [];
    return newState;
}

/**
 * Reset all filters.
 *
 * @param newState - already cloned state that is modified and returned
 * @returns new state with changes
 */
function resetFiltersReducer(newState: AppState): AppState {
    newState.selectedProductFilters = [];
    newState.selectedComponentFilters = [];
    newState.guidedAnswerTreeSearchResult.trees = [];
    return newState;
}

/**
 * Set filters to search tree. Actual search is done in handler in ide-extension.
 *
 * @param newState - already cloned state that is modified and returned
 * @param action - action with payload
 * @returns new state with changes
 */
function searchTreeReducer(newState: AppState, action: SearchTree): AppState {
    newState.selectedComponentFilters = action.payload.filters?.component ?? [];
    newState.selectedProductFilters = action.payload.filters?.product ?? [];
    newState.activeScreen = 'SEARCH';
    return newState;
}

/**
 * Update state for bookmarks.
 *
 * @param newState - already cloned state that is modified and returned
 * @param action - action with payload
 * @returns new state with changes
 */
function updateBookmarksReducer(newState: AppState, action: UpdateBookmarks): AppState {
    newState.bookmarks = action.payload.bookmarks;
    return newState;
}

/**
 * Update the page size.
 *
 * @param newState - already cloned state that is modified and returned
 * @param action - action with payload
 * @returns new state with changes
 */
function updatePageSize(newState: AppState, action: SetPageSize): AppState {
    newState.pageSize = action.payload;
    return newState;
}

/**
 * Set quick filters.
 *
 * @param newState - already cloned state that is modified and returned
 * @param action - action with payload
 * @returns new state with changes
 */
function setQuickFiltersReducer(newState: AppState, action: SetQuickFilters): AppState {
    newState.quickFilters = action.payload;
    return newState;
}

/**
 * Restore the state, happens after deserializing of the webview panel.
 *
 * @param newState - already cloned state that is modified and returned
 * @param action - action with payload
 * @returns new state with changes
 */
function restoreStateReducer(newState: AppState, action: RestoreState) {
    return action.payload;
}
