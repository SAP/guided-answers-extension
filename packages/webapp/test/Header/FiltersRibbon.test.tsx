import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { initI18n } from '../../src/webview/i18n';
import { FiltersRibbon } from '../../src/webview/ui/components/Header/Filters/FiltersRibbon';
import { actions } from '../../src/webview/state';
import { Provider } from 'react-redux';
import { getInitialState, reducer } from '../../src/webview/state/reducers';
import { AppState } from '../../src/webview/types';
import configureMockStore from 'redux-mock-store';
import { screen } from '@testing-library/dom';
import { treeMock } from '../__mocks__/treeMock';

jest.mock('../../src/webview/state', () => {
    return {
        actions: {
            resetFilters: jest.fn(),
            searchTree: jest.fn()
        }
    };
});

const createState = (initialState: AppState) => (actions: any[]) => actions.reduce(reducer, initialState);
const mockStore = configureMockStore();

describe('<FiltersRibbon />', () => {
    initI18n();
    afterEach(cleanup);

    it('Should render a FiltersRibbon component', () => {
        const initialState = getInitialState();
        initialState.loading = false;
        initialState.query = 'Fiori tools';
        initialState.selectedProductFilters = ['Product A'];
        initialState.selectedComponentFilters = ['comp-a'];
        initialState.guidedAnswerTreeSearchResult = {
            trees: [treeMock],
            resultSize: 1,
            productFilters: [{ PRODUCT: 'Product A', COUNT: 1 }],
            componentFilters: [{ COMPONENT: 'comp-a', COUNT: 1 }]
        };

        const { container } = render(
            <Provider store={mockStore(createState(initialState))}>
                <FiltersRibbon />
            </Provider>
        );
        expect(container).toMatchSnapshot();

        const element = screen.getByTestId('clear-filters');
        fireEvent.click(element);

        expect(actions.resetFilters).toBeCalled();
        expect(actions.searchTree).toHaveBeenCalledWith({
            query: 'Fiori tools',
            filters: {
                product: [],
                component: []
            },
            paging: {
                offset: 0,
                responseSize: 20
            }
        });

        expect(actions.resetFilters).toHaveBeenCalledTimes(1);
        expect(actions.searchTree).toHaveBeenCalledTimes(1);
    });
});
