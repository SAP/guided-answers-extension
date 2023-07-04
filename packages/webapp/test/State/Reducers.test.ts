import { GUIDE_FEEDBACK, AppState, GuidedAnswerActions } from './../../../types/src/types';
import { getInitialState, reducer } from '../../src/webview/state/reducers';
import {
    UPDATE_GUIDED_ANSWER_TREES,
    UPDATE_ACTIVE_NODE,
    UPDATE_NETWORK_STATUS,
    GO_TO_PREVIOUS_PAGE,
    GO_TO_ALL_ANSWERS,
    RESTART_ANSWER,
    SET_ACTIVE_TREE,
    SET_QUERY_VALUE,
    BETA_FEATURES,
    SET_PRODUCT_FILTERS,
    SET_COMPONENT_FILTERS,
    RESTORE_STATE,
    RESET_FILTERS,
    GO_TO_HOME_PAGE
} from '@sap/guided-answers-extension-types';
import type { GuidedAnswerTreeSearchHit } from '@sap/guided-answers-extension-types';

const mockedPayload = {
    trees: [
        {
            TREE_ID: 1,
            TITLE: 'One',
            DESCRIPTION: 'First tree',
            AVAILABILITY: 'PUBLIC',
            FIRST_NODE_ID: 100,
            SCORE: 0.1,
            COMPONENT: 'C1',
            PRODUCT: 'P_one'
        },
        {
            TREE_ID: 2,
            TITLE: 'Two',
            DESCRIPTION: 'Second tree',
            AVAILABILITY: 'PUBLIC',
            FIRST_NODE_ID: 200,
            SCORE: 0.2,
            COMPONENT: 'C2',
            PRODUCT: 'P_two'
        }
    ],
    resultSize: 2,
    componentFilters: [{ COMPONENT: 'C1', COUNT: 1 }],
    productFilters: [{ PRODUCT: 'P_one', COUNT: 1 }]
};

const mockedInitState = {
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
    bookmarks: {},
    feedbackResponse: false,
    feedbackStatus: false,
    guideFeedback: null,
    selectedProductFilters: [],
    selectedComponentFilters: [],
    pageSize: 20,
    isHome: true
};

const mockedActiveGuidedAnswerNode = [
    {
        BODY: '<p>SAP Fiori Tools is a set of extensions for SAP Business Application Studio and Visual Studio Code</p>',
        EDGES: [
            {
                LABEL: 'Deployment',
                TARGET_NODE: 45996,
                ORD: 1
            },
            {
                LABEL: 'Fiori Generator',
                TARGET_NODE: 48363,
                ORD: 2
            }
        ],
        NODE_ID: 45995,
        QUESTION: 'I have a problem with',
        TITLE: 'SAP Fiori Tools'
    }
];

const mockedGuidedAnswerTreeSearchResult = {
    trees: [
        {
            TREE_ID: 1,
            TITLE: 'One',
            DESCRIPTION: 'First tree',
            AVAILABILITY: 'PUBLIC',
            FIRST_NODE_ID: 100,
            SCORE: 0.1,
            COMPONENT: 'C1',
            PRODUCT: 'P_one'
        },
        {
            TREE_ID: 2,
            TITLE: 'Two',
            DESCRIPTION: 'Second tree',
            AVAILABILITY: 'PUBLIC',
            FIRST_NODE_ID: 200,
            SCORE: 0.2,
            COMPONENT: 'C2',
            PRODUCT: 'P_two'
        }
    ],
    resultSize: 2,
    componentFilters: [
        {
            COMPONENT: 'C1',
            COUNT: 1
        }
    ],
    productFilters: [
        {
            PRODUCT: 'P_one',
            COUNT: 1
        }
    ]
};

describe('Test functions in reducers', () => {
    it('Should return the initial state', () => {
        const initState = getInitialState();
        expect(initState).toEqual(mockedInitState);
    });

    it('Should return state if action is not known to reduced', () => {
        expect(reducer({ any: 'value' } as unknown as AppState, undefined as unknown as GuidedAnswerActions)).toEqual({
            any: 'value'
        });
    });

    it('Should return updated guide answer trees', () => {
        const answersWithDefaultState = reducer(undefined, {
            type: UPDATE_GUIDED_ANSWER_TREES,
            payload: { searchResult: mockedPayload }
        });

        const answers = reducer(getInitialState(), {
            type: UPDATE_GUIDED_ANSWER_TREES,
            payload: { searchResult: mockedPayload }
        });

        const expected = {
            networkStatus: 'LOADING',
            query: '',
            guidedAnswerTreeSearchResult: mockedGuidedAnswerTreeSearchResult,
            activeGuidedAnswerNode: [],
            activeNodeSharing: null,
            betaFeatures: false,
            bookmarks: {},
            feedbackResponse: false,
            feedbackStatus: false,
            guideFeedback: null,
            selectedProductFilters: [],
            selectedComponentFilters: [],
            pageSize: 20,
            isHome: false
        };

        expect(answersWithDefaultState).toEqual(expected);
        expect(answers).toEqual(expected);
    });

    it('Should add new results to existing guided answers trees (paging)', () => {
        const state = getInitialState();
        state.guidedAnswerTreeSearchResult.trees = [{ TREE_ID: 1 } as GuidedAnswerTreeSearchHit];

        const newState = reducer(state, {
            type: UPDATE_GUIDED_ANSWER_TREES,
            payload: {
                searchResult: {
                    trees: [{ TREE_ID: 2 } as GuidedAnswerTreeSearchHit],
                    resultSize: 2,
                    componentFilters: [],
                    productFilters: []
                },
                pagingOptions: { offset: 1, responseSize: 10 }
            }
        });

        expect(newState.guidedAnswerTreeSearchResult).toEqual({
            trees: [{ TREE_ID: 1 }, { TREE_ID: 2 }],
            resultSize: 2,
            componentFilters: [],
            productFilters: []
        });
    });

    it('Should pop node when tree is updated with GuideFeedback as False', () => {
        const treeWithGuideFeedbackFalse = reducer(getInitialState(), {
            type: GUIDE_FEEDBACK,
            payload: false
        });
        const answerwithGuidedAnswerTree = reducer(treeWithGuideFeedbackFalse, {
            type: UPDATE_ACTIVE_NODE,
            payload: mockedActiveGuidedAnswerNode[0]
        });
        expect(answerwithGuidedAnswerTree.guideFeedback).toBe(null);
        expect(answerwithGuidedAnswerTree.activeGuidedAnswerNode.length).toBe(1);
    });

    it('Should return the active node', () => {
        const activeNode = reducer(getInitialState(), {
            type: UPDATE_ACTIVE_NODE,
            payload: mockedActiveGuidedAnswerNode[0]
        });

        expect(activeNode).toEqual({
            networkStatus: 'LOADING',
            query: '',
            guidedAnswerTreeSearchResult: {
                resultSize: -1,
                componentFilters: [],
                productFilters: [],
                trees: []
            },
            activeGuidedAnswerNode: mockedActiveGuidedAnswerNode,
            activeNodeSharing: null,
            feedbackResponse: false,
            feedbackStatus: false,
            guideFeedback: null,
            betaFeatures: false,
            bookmarks: {},
            selectedProductFilters: [],
            selectedComponentFilters: [],
            pageSize: 20,
            isHome: false
        });

        const mockedInitStateWithActiveGuidedNode: any = mockedInitState;
        mockedInitStateWithActiveGuidedNode.activeGuidedAnswerNode = mockedActiveGuidedAnswerNode;

        const hasActiveNode = reducer(mockedInitStateWithActiveGuidedNode, {
            type: UPDATE_ACTIVE_NODE,
            payload: mockedActiveGuidedAnswerNode[0]
        });

        expect(hasActiveNode).toEqual({
            networkStatus: 'LOADING',
            query: '',
            guidedAnswerTreeSearchResult: {
                resultSize: -1,
                componentFilters: [],
                productFilters: [],
                trees: []
            },
            activeGuidedAnswerNode: mockedActiveGuidedAnswerNode,
            activeNodeSharing: null,
            betaFeatures: false,
            bookmarks: {},
            feedbackResponse: false,
            feedbackStatus: false,
            guideFeedback: null,
            selectedProductFilters: [],
            selectedComponentFilters: [],
            pageSize: 20,
            isHome: false
        });
    });

    it('Should return network status state', () => {
        const networkStatusState = reducer(getInitialState(), {
            type: UPDATE_NETWORK_STATUS,
            payload: 'LOADING'
        });
        expect(networkStatusState.networkStatus).toBe('LOADING');
    });

    it('Should go to previous page', () => {
        const mockedInitStateWithActiveGuidedNode: any = mockedInitState;
        mockedInitStateWithActiveGuidedNode.activeGuidedAnswerNode = mockedActiveGuidedAnswerNode;
        mockedInitStateWithActiveGuidedNode.guideFeedback = true;
        let prevPageState = reducer(mockedInitStateWithActiveGuidedNode, {
            type: GO_TO_PREVIOUS_PAGE
        });
        expect(prevPageState.activeGuidedAnswerNode.length).toBe(0);

        mockedInitStateWithActiveGuidedNode.guideFeedback = false;

        prevPageState = reducer(mockedInitStateWithActiveGuidedNode, {
            type: GO_TO_PREVIOUS_PAGE
        });
        expect(prevPageState.guideFeedback).toBe(null);
    });

    it('Should go to all answers', () => {
        const goToAllAnswersState = reducer(getInitialState(), {
            type: GO_TO_ALL_ANSWERS
        });
        expect(goToAllAnswersState.guideFeedback).toEqual(null);
        expect(goToAllAnswersState.activeGuidedAnswerNode.length).toBe(0);
    });

    it('Should restart answer', () => {
        const restartAnswersState = reducer(getInitialState(), {
            type: RESTART_ANSWER
        });
        expect(restartAnswersState.activeGuidedAnswerNode).toStrictEqual([undefined]);
        expect(restartAnswersState.guideFeedback).toEqual(null);
    });

    it('Should go to home page', () => {
        const goToHomePageState = reducer(getInitialState(), {
            type: GO_TO_HOME_PAGE
        });
        expect(goToHomePageState.isHome).toEqual(true);
    });

    it('Should set GuideFeedback', () => {
        const feedback = false;
        const setGuideFeedback = reducer(getInitialState(), {
            type: GUIDE_FEEDBACK,
            payload: feedback
        });
        expect(setGuideFeedback.guideFeedback).toEqual(feedback);
    });

    it('Should set active tree', () => {
        const setActiveTreeState = reducer(getInitialState(), {
            type: SET_ACTIVE_TREE,
            payload: mockedGuidedAnswerTreeSearchResult.trees[0]
        });
        expect(setActiveTreeState.activeGuidedAnswer).toEqual(mockedGuidedAnswerTreeSearchResult.trees[0]);
    });

    it('Should set query', () => {
        const query = 'Major Tom to ground control';
        const setQueryState = reducer(getInitialState(), {
            type: SET_QUERY_VALUE,
            payload: query
        });
        expect(setQueryState.query).toEqual(query);
    });

    it('Should set beta features toggle', () => {
        const setToggleState = reducer(getInitialState(), {
            type: BETA_FEATURES,
            payload: true
        });
        expect(setToggleState.betaFeatures).toBe(true);
    });

    it('Should set product filters', () => {
        const setProductFiltersState = reducer(getInitialState(), {
            type: SET_PRODUCT_FILTERS,
            payload: ['P_one']
        });
        expect(setProductFiltersState.selectedProductFilters).toEqual(['P_one']);
    });

    it('Should set component filters', () => {
        const setComponentFiltersState = reducer(getInitialState(), {
            type: SET_COMPONENT_FILTERS,
            payload: ['C_one']
        });
        expect(setComponentFiltersState.selectedComponentFilters).toEqual(['C_one']);
    });

    it('Should reset selected filters', () => {
        const stateWithSelectedFilters = getInitialState();
        stateWithSelectedFilters.selectedProductFilters = ['P_one'];
        stateWithSelectedFilters.selectedComponentFilters = ['C_one'];

        const resetSelectedFiltersState = reducer(stateWithSelectedFilters, {
            type: RESET_FILTERS
        });
        expect(resetSelectedFiltersState.selectedProductFilters).toEqual([]);
        expect(resetSelectedFiltersState.selectedComponentFilters).toEqual([]);
    });

    it('Should restore the app state', () => {
        const initialState = getInitialState();
        const payload = JSON.parse(JSON.stringify(initialState));
        payload.activeGuidedAnswer = [mockedActiveGuidedAnswerNode];
        payload.guidedAnswerTreeSearchResult = mockedGuidedAnswerTreeSearchResult;
        payload.query = 'search query';
        expect(reducer(initialState, { type: RESTORE_STATE, payload })).toEqual(payload);
    });
});
