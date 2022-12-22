import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { SearchField } from '../../src/webview/ui/components/Header/SearchField';
import { initI18n } from '../../src/webview/i18n';
import { actions } from '../../src/webview/state';

jest.useFakeTimers();
jest.spyOn(global, 'setTimeout');

jest.mock('../../src/webview/state', () => {
    return {
        actions: {
            searchTree: jest.fn(),
            setQueryValue: jest.fn()
        }
    };
});

jest.mock('@vscode/webview-ui-toolkit/react', () => ({
    VSCodeTextField: () => (
        <>
            <input type="text" data-testid="search-field" />
        </>
    )
}));

jest.mock('react-redux', () => {
    const lib = jest.requireActual('react-redux');
    return {
        ...lib,
        useSelector: jest.fn().mockReturnValue({
            activeGuidedAnswerNode: [],
            guidedAnswerTreeSearchResult: {
                trees: [
                    {
                        AVAILABILITY: 'PUBLIC',
                        DESCRIPTION: 'This is a troubleshooting guide to solve the issues while using SAP Fiori tools',
                        FIRST_NODE_ID: 45995,
                        TITLE: 'SAP Fiori tools',
                        TREE_ID: 3046,
                        PRODUCT: 'Product A, Product B',
                        COMPONENT: 'comp-a, comp-b'
                    }
                ],
                resultSize: 1,
                productFilters: [],
                componentFilters: []
            },
            query: 'fiori tools',
            guideFeedback: true,
            selectedProductFilters: ['ProductFilter1, ProductFilter2'],
            selectedComponentFilters: ['ComponentFilter1', 'ComponentFilter2']
        })
    };
});

describe('<SearchField />', () => {
    initI18n();
    afterEach(cleanup);

    it('Should render a SearchField component', () => {
        const { container } = render(<SearchField />);
        expect(container).toMatchSnapshot();

        //Test click event
        const element = screen.getByTestId('search-field');
        fireEvent.input(element, { target: { value: 'Fiori Tools' } });
        expect(setTimeout).toHaveBeenCalledTimes(1);
    });
});
