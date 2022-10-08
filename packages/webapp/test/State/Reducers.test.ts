import { getInitialState, reducer } from '../../src/webview/state/reducers';
import {
    UPDATE_GUIDED_ANSWER_TREES,
    UPDATE_ACTIVE_NODE,
    UPDATE_LOADING,
    GO_TO_PREVIOUS_PAGE,
    GO_TO_ALL_ANSWERS,
    RESTART_ANSWER,
    SET_ACTIVE_TREE,
    SET_QUERY_VALUE,
    BETA_FEATURES,
    SET_PRODUCT_FILTERS,
    SET_COMPONENT_FILTERS,
    RESET_FILTERS
} from '@sap/guided-answers-extension-types';

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
    loading: true,
    query: '',
    searchResultCount: -1,
    guidedAnswerTreeSearchResult: {
        resultSize: -1,
        componentFilters: [],
        productFilters: [],
        trees: []
    },
    activeGuidedAnswerNode: [],
    betaFeatures: false,
    guideFeedback: null,
    selectedProductFilters: [],
    selectedComponentFilters: []
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

    it('Should return updated guide answer trees', () => {
        const answersWithDefaultState = reducer(undefined, {
            type: UPDATE_GUIDED_ANSWER_TREES,
            payload: mockedPayload
        });

        const answers = reducer(getInitialState(), {
            type: UPDATE_GUIDED_ANSWER_TREES,
            payload: mockedPayload
        });

        const expected = {
            loading: true,
            query: '',
            searchResultCount: -1,
            guidedAnswerTreeSearchResult: mockedGuidedAnswerTreeSearchResult,
            activeGuidedAnswerNode: [],
            betaFeatures: false,
            guideFeedback: null,
            selectedProductFilters: [],
            selectedComponentFilters: []
        };

        expect(answersWithDefaultState).toEqual(expected);
        expect(answers).toEqual(expected);
    });

    it('Should return the active node', () => {
        const activeNode = reducer(getInitialState(), {
            type: UPDATE_ACTIVE_NODE,
            payload: mockedActiveGuidedAnswerNode[0]
        });

        expect(activeNode).toEqual({
            loading: true,
            query: '',
            searchResultCount: -1,
            guidedAnswerTreeSearchResult: {
                resultSize: -1,
                componentFilters: [],
                productFilters: [],
                trees: []
            },
            activeGuidedAnswerNode: mockedActiveGuidedAnswerNode,
            guideFeedback: null,
            betaFeatures: false,
            selectedProductFilters: [],
            selectedComponentFilters: []
        });

        const mockedInitStateWithActiveGuidedNode: any = mockedInitState;
        mockedInitStateWithActiveGuidedNode.activeGuidedAnswerNode = mockedActiveGuidedAnswerNode;

        const hasActiveNode = reducer(mockedInitStateWithActiveGuidedNode, {
            type: UPDATE_ACTIVE_NODE,
            payload: mockedActiveGuidedAnswerNode[0]
        });

        expect(hasActiveNode).toEqual({
            loading: true,
            query: '',
            searchResultCount: -1,
            guidedAnswerTreeSearchResult: {
                resultSize: -1,
                componentFilters: [],
                productFilters: [],
                trees: []
            },
            activeGuidedAnswerNode: mockedActiveGuidedAnswerNode,
            betaFeatures: false,
            guideFeedback: null,
            selectedProductFilters: [],
            selectedComponentFilters: []
        });
    });

    it('Should return loading state', () => {
        const loadingState = reducer(getInitialState(), {
            type: UPDATE_LOADING,
            payload: true
        });
        expect(loadingState.loading).toBe(true);
    });

    it('Should go to previous page', () => {
        const prevPageState = reducer(getInitialState(), {
            type: GO_TO_PREVIOUS_PAGE
        });
        expect(prevPageState.activeGuidedAnswerNode.length).toBe(0);
    });

    it('Should go to all answers', () => {
        const goToAllAnswersState = reducer(getInitialState(), {
            type: GO_TO_ALL_ANSWERS
        });
        expect(goToAllAnswersState.activeGuidedAnswerNode.length).toBe(0);
    });

    it('Should restart answer', () => {
        const restartAnswersState = reducer(getInitialState(), {
            type: RESTART_ANSWER
        });
        expect(restartAnswersState.activeGuidedAnswerNode).toStrictEqual([undefined]);
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
});
