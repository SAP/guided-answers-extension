import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { useSelector } from 'react-redux';
import type { GuidedAnswerTreeSearchHit } from '@sap/guided-answers-extension-types';
import { SearchResults } from '../../src/webview/ui/components/SearchResults';

jest.mock('../../src/webview/state', () => ({
    actions: {
        searchTree: jest.fn()
    }
}));

jest.mock('react-redux', () => ({
    useSelector: jest.fn()
}));

describe('<SearchResults />', () => {
    afterEach(cleanup);

    it('renders without crashing', () => {
        (useSelector as jest.Mock).mockImplementation((selector) =>
            selector({
                query: 'query',
                selectedProductFilters: [],
                selectedComponentFilters: [],
                guidedAnswerTreeSearchResult: {
                    resultSize: 2,
                    trees: [
                        {
                            TITLE: 'Tree title',
                            DESCRIPTION: 'Tree description',
                            PRODUCT: 'product',
                            COMPONENT: 'component',
                            TREE_ID: 1,
                            FIRST_NODE_ID: 11,
                            ACTIONS: [
                                {
                                    TREE_ID: 1,
                                    NODE_ID: 12,
                                    TITLE: 'Node title',
                                    DETAIL: 'Node detail'
                                }
                            ]
                        } as GuidedAnswerTreeSearchHit,
                        {
                            TITLE: 'Tree title 2',
                            DESCRIPTION: 'Tree description 2',
                            PRODUCT: 'product',
                            COMPONENT: 'component',
                            TREE_ID: 2,
                            FIRST_NODE_ID: 21,
                            ACTIONS: [
                                {
                                    TREE_ID: 2,
                                    NODE_ID: 22,
                                    TITLE: 'Node title',
                                    DETAIL: 'Node detail'
                                }
                            ]
                        } as GuidedAnswerTreeSearchHit
                    ]
                },
                pageSize: 5,
                bookmarks: { '1-12': {} },
                searchResultVisibleNodeCount: {
                    1: 1
                }
            })
        );

        const { container } = render(<SearchResults />);
        expect(container).toMatchSnapshot();
    });

    it('renders without crashing, no results', () => {
        (useSelector as jest.Mock).mockImplementation((selector) =>
            selector({
                query: 'query',
                selectedProductFilters: [],
                selectedComponentFilters: [],
                guidedAnswerTreeSearchResult: {
                    resultSize: 0,
                    trees: []
                },
                pageSize: 5,
                bookmarks: { '1-12': {} },
                searchResultVisibleNodeCount: {}
            })
        );

        const { container } = render(<SearchResults />);
        expect(container).toMatchSnapshot();
    });
});
