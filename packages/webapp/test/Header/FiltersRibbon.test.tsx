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

const createState = (initialState: AppState) => (actions: any[]) => actions.reduce(reducer, initialState);
const mockStore = configureMockStore();

let state = {
    query: 'Fiori tools',
    selectedProductFilters: ['ProductFilter1, ProductFilter2'],
    selectedComponentFilters: ['ComponentFilter1', 'ComponentFilter2']
};

jest.mock('../../src/webview/state', () => {
    return {
        actions: {
            resetFilters: jest.fn(),
            searchTree: jest.fn()
        }
    };
});

jest.mock('react-redux', () => {
    const lib = jest.requireActual('react-redux');

    return {
        ...lib,
        useSelector: () => state
    };
});

describe('<FiltersRibbon />', () => {
    initI18n();
    afterEach(cleanup);

    const initialState = createState(getInitialState());
    const store = mockStore(initialState);

    it('Should render a FiltersRibbon component', () => {
        const { container } = render(
            <Provider store={store}>
                <FiltersRibbon />
            </Provider>
        );
        expect(container).toMatchSnapshot();

        const element = screen.getByTestId('clear-filters');
        fireEvent.click(element);

        expect(actions.resetFilters).toBeCalled();
        expect(actions.searchTree).toHaveBeenCalledWith({
            query: state.query,
            filters: {
                product: [],
                component: []
            },
            paging: {
                offset: 0,
                responseSize: undefined
            }
        });

        expect(actions.resetFilters).toHaveBeenCalledTimes(1);
        expect(actions.searchTree).toHaveBeenCalledTimes(1);
    });
});
