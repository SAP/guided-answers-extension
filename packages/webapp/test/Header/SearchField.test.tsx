import { treeMock } from '../__mocks__/treeMock';
import React from 'react';
import { useSelector } from 'react-redux';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { SearchField } from '../../src/webview/ui/components/Header/SearchField';
import { initI18n } from '../../src/webview/i18n';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

jest.mock('../../src/webview/state', () => {
    return {
        actions: {
            searchTree: jest.fn(),
            setQueryValue: jest.fn(),
            parseUrl: jest.fn()
        }
    };
});

jest.mock('react-redux', () => ({
    useSelector: jest.fn()
}));

describe('<SearchField />', () => {
    const mockState = {
        activeGuidedAnswerNode: [],
        guidedAnswerTreeSearchResult: {
            trees: [treeMock],
            resultSize: 1,
            productFilters: [],
            componentFilters: []
        },
        query: 'fiori tools',
        guideFeedback: true,
        selectedProductFilters: ['ProductFilter1, ProductFilter2'],
        selectedComponentFilters: ['ComponentFilter1', 'ComponentFilter2'],
        activeScreen: 'SEARCH'
    };

    initI18n();
    afterEach(cleanup);

    it('Should render a SearchField component, on search screen', () => {
        (useSelector as jest.Mock).mockImplementation((selector) => selector(mockState));

        const { container } = render(<SearchField />);
        expect(container).toMatchSnapshot();

        //Test click event
        const element = screen.getByTestId('search-field');
        fireEvent.input(element, { target: { value: 'Fiori Tools' } });
        expect(setTimeout).toHaveBeenCalledTimes(2);
    });

    it('Should render a SearchField component, on home screen', () => {
        (useSelector as jest.Mock).mockImplementation((selector) => selector({ ...mockState, activeScreen: 'HOME' }));

        const { container } = render(<SearchField />);
        expect(container).toMatchSnapshot();
    });
});
