import { treeMock } from '../__mocks__/treeMock';
import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { initI18n } from '../../src/webview/i18n';
import { Provider } from 'react-redux';
import { getInitialState, reducer } from '../../src/webview/state/reducers';
import { AppState } from '../../src/webview/types';
import configureMockStore from 'redux-mock-store';
import { screen } from '@testing-library/dom';
import {
    Filters,
    sortProductFilters,
    sortComponentFilters
} from '../../src/webview/ui/components/Header/Filters/Filters';

const createState = (initialState: AppState) => (actions: any[]) => actions.reduce(reducer, initialState);
const mockStore = configureMockStore();

jest.mock('../../src/webview/state', () => {
    return {
        actions: {
            setProductFilters: jest.fn(),
            setComponentFilters: jest.fn(),
            searchTree: jest.fn()
        }
    };
});

describe('<Filters />', () => {
    initI18n();
    afterEach(cleanup);
    it('Should render a Filters component', () => {
        const { container } = render(
            <Provider store={mockStore(createState(getInitialState()))}>
                <Filters />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });

    it('Should render a Filters component - Open products filter dialog', () => {
        const initialState = getInitialState();
        initialState.networkStatus = 'OK';
        initialState.guidedAnswerTreeSearchResult = {
            trees: [treeMock],
            resultSize: 1,
            productFilters: [{ PRODUCT: 'Product A', COUNT: 1 }],
            componentFilters: [{ COMPONENT: 'comp-a', COUNT: 1 }]
        };

        const { container } = render(
            <Provider store={mockStore(createState(initialState))}>
                <Filters />
            </Provider>
        );

        const element = screen.getByTestId('filter-products');
        fireEvent.click(element);

        expect(container).toMatchSnapshot();

        expect(
            sortProductFilters([
                { PRODUCT: 'Product B', COUNT: 1 },
                { PRODUCT: 'Product A', COUNT: 1 }
            ])
        ).toEqual([
            { PRODUCT: 'Product A', COUNT: 1 },
            { PRODUCT: 'Product B', COUNT: 1 }
        ]);

        expect(
            sortComponentFilters([
                { COMPONENT: 'LOD-BPM-WFS', COUNT: 1 },
                { COMPONENT: 'CA-UX-IDE', COUNT: 2 },
                { COMPONENT: 'BI-BIP-DEP', COUNT: 1 },
                { COMPONENT: 'BI-BIP-INV', COUNT: 1 },
                { COMPONENT: 'EP-PIN-AI', COUNT: 1 },
                { COMPONENT: 'GRC-SAC-ARQ', COUNT: 1 }
            ])
        ).toEqual([
            { COMPONENT: 'BI-BIP-DEP', COUNT: 1 },
            { COMPONENT: 'BI-BIP-INV', COUNT: 1 },
            { COMPONENT: 'CA-UX-IDE', COUNT: 2 },
            { COMPONENT: 'EP-PIN-AI', COUNT: 1 },
            { COMPONENT: 'GRC-SAC-ARQ', COUNT: 1 },
            { COMPONENT: 'LOD-BPM-WFS', COUNT: 1 }
        ]);
    });

    it('Should render a Filters component - Open components filter dialog', () => {
        const initialState = getInitialState();
        initialState.networkStatus = 'OK';
        initialState.guidedAnswerTreeSearchResult = {
            trees: [treeMock],
            resultSize: 1,
            productFilters: [{ PRODUCT: 'Product A', COUNT: 1 }],
            componentFilters: [{ COMPONENT: 'comp-a', COUNT: 1 }]
        };

        const { container } = render(
            <Provider store={mockStore(createState(initialState))}>
                <Filters />
            </Provider>
        );

        const element = screen.getByTestId('filter-components');
        fireEvent.click(element);

        expect(container).toMatchSnapshot();
    });
});
