import React from 'react';
import { App } from '../src/webview/ui/components/App';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import {
    updateLoading,
    updateGuidedAnswerTrees,
    setActiveTree,
    selectNode,
    updateActiveNode
} from '@sap/guided-answers-extension-types';
import { getInitialState, reducer } from '../src/webview/state/reducers';
import { AppState } from '../src/webview/types';

jest.mock('@vscode/webview-ui-toolkit/react', () => ({
    VSCodeTextField: () => (
        <>
            <div>SearchField</div>
        </>
    ),
    VSCodeProgressRing: () => (
        <>
            <div>Loading icon</div>
        </>
    )
}));

jest.mock('../src/webview/state', () => {
    return {
        actions: {
            setActiveTree: jest.fn(),
            selectNode: jest.fn(),
            setPageSize: jest.fn(),
            setQueryValue: jest.fn(),
            searchTree: jest.fn(),
            resetFilters: jest.fn()
        }
    };
});

const createState = (initialState: AppState) => (actions: any[]) => actions.reduce(reducer, initialState);
const mockStore = configureMockStore();

describe('<App />', () => {
    const initialState = createState(getInitialState());
    const store = mockStore(initialState);

    it('Match snapshot of component <App/> in loading mode', () => {
        const { container } = render(
            <Provider store={store}>
                <App />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });

    it('Match snapshot of component <App/> in initial mode', () => {
        store.dispatch(updateLoading(false));

        const { container } = render(
            <Provider store={store}>
                <App />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });

    it('Match snapshot of component <App/> with results list', () => {
        const result = {
            trees: [
                {
                    AVAILABILITY: 'PUBLIC',
                    DESCRIPTION: 'This is a troubleshooting guide to solve the issues while using SAP Fiori tools',
                    FIRST_NODE_ID: 45995,
                    TITLE: 'SAP Fiori tools',
                    SCORE: 0.1,
                    TREE_ID: 3046,
                    PRODUCT: 'Product A',
                    COMPONENT: 'comp-a'
                }
            ],
            resultSize: 1,
            productFilters: [{ PRODUCT: 'Product A', COUNT: 1 }],
            componentFilters: [{ COMPONENT: 'comp-a', COUNT: 1 }]
        };
        store.dispatch(updateLoading(false));
        store.dispatch(updateGuidedAnswerTrees(result));

        const { container } = render(
            <Provider store={store}>
                <App />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });

    it('Match snapshot of component <App/> with a guide selected', () => {
        const tree = {
            AVAILABILITY: 'PUBLIC',
            DESCRIPTION: 'This is a troubleshooting guide to solve the issues while using SAP Fiori tools',
            FIRST_NODE_ID: 45995,
            TITLE: 'SAP Fiori tools',
            SCORE: 0.1,
            TREE_ID: 3046,
            PRODUCT: 'Product A',
            COMPONENT: 'comp-a'
        };

        store.dispatch(setActiveTree(tree));
        store.dispatch(selectNode(tree.FIRST_NODE_ID));
        store.dispatch(
            updateActiveNode({
                BODY: '<p>SAP Fiori Tools is a set of extensions for SAP Business Application Studio and Visual Studio Code</p>',
                EDGES: [
                    { LABEL: 'Deployment', TARGET_NODE: 45996, ORD: 1 },
                    { LABEL: 'Fiori Generator', TARGET_NODE: 48363, ORD: 2 }
                ],
                NODE_ID: 45995,
                QUESTION: 'I have a problem with',
                TITLE: 'SAP Fiori Tools'
            })
        );
        const { container } = render(
            <Provider store={store}>
                <App />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });
});
