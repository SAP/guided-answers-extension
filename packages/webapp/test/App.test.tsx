import React from 'react';
import { App } from '../src/webview/ui/components/App';
import { render, cleanup } from '@testing-library/react';
import { initI18n } from '../src/webview/i18n';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { getInitialState, reducer } from '../src/webview/state/reducers';
import { AppState } from '../src/webview/types';
import { treeMock } from './__mocks__/treeMock';

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
    initI18n();
    afterEach(cleanup);
    it('Match snapshot of component <App/> in loading mode', () => {
        const { container } = render(
            <Provider store={mockStore(createState(getInitialState()))}>
                <App />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });

    it('Match snapshot of component <App/> in initial mode', () => {
        const initialState = getInitialState();
        initialState.loading = false;

        const { container } = render(
            <Provider store={mockStore(createState(initialState))}>
                <App />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });

    it('Match snapshot of component <App/> with results list', () => {
        const initialState = getInitialState();
        initialState.loading = false;
        initialState.guidedAnswerTreeSearchResult = {
            trees: [treeMock],
            resultSize: 1,
            productFilters: [{ PRODUCT: 'Product A', COUNT: 1 }],
            componentFilters: [{ COMPONENT: 'comp-a', COUNT: 1 }]
        };

        const { container } = render(
            <Provider store={mockStore(createState(initialState))}>
                <App />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });

    it('Match snapshot of component <App/> with a guide selected', () => {
        const stateWithActiveAnswer = getInitialState();

        stateWithActiveAnswer.activeGuidedAnswer = treeMock;
        stateWithActiveAnswer.activeGuidedAnswerNode.push({
            BODY: '<p>SAP Fiori Tools is a set of extensions for SAP Business Application Studio and Visual Studio Code</p>',
            EDGES: [
                { LABEL: 'Deployment', TARGET_NODE: 45996, ORD: 1 },
                { LABEL: 'Fiori Generator', TARGET_NODE: 48363, ORD: 2 }
            ],
            NODE_ID: 45995,
            QUESTION: 'I have a problem with',
            TITLE: 'SAP Fiori Tools'
        });

        const { container } = render(
            <Provider store={mockStore(createState(stateWithActiveAnswer))}>
                <App />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });
});
