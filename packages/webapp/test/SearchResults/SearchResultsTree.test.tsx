import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { useSelector } from 'react-redux';
import type { GuidedAnswerTreeSearchHit } from '@sap/guided-answers-extension-types';
import { actions } from '../../src/webview/state';
import { SearchResultsTree } from '../../src/webview/ui/components/SearchResults';

jest.mock('../../src/webview/state', () => ({
    actions: {
        setActiveTree: jest.fn(),
        selectNode: jest.fn(),
        expandSearchNodesForTree: jest.fn()
    }
}));

jest.mock('react-redux', () => ({
    useSelector: jest.fn()
}));

describe('<SearchResultsTree />', () => {
    afterEach(cleanup);

    it('renders without crashing', () => {
        (useSelector as jest.Mock).mockImplementation((selector) =>
            selector({
                bookmarks: { '1-12': {} },
                searchResultVisibleNodeCount: {
                    1: 1
                }
            })
        );
        const tree = {
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
        } as GuidedAnswerTreeSearchHit;

        const { container } = render(<SearchResultsTree tree={tree} />);
        expect(container).toMatchSnapshot();
    });

    it('opens tree', () => {
        (useSelector as jest.Mock).mockImplementation((selector) =>
            selector({
                bookmarks: {},
                searchResultVisibleNodeCount: {
                    1: 1
                }
            })
        );
        const tree = {
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
        } as GuidedAnswerTreeSearchHit;

        const { container } = render(<SearchResultsTree tree={tree} />);
        expect(container).toMatchSnapshot();
        fireEvent.click(screen.getByTestId('search-result-tree-button'));
        expect(actions.setActiveTree).toBeCalledWith(tree);
        expect(actions.selectNode).toBeCalledWith(11);
    });

    it('expands tree nodes', () => {
        (useSelector as jest.Mock).mockImplementation((selector) =>
            selector({
                bookmarks: {},
                searchResultVisibleNodeCount: {
                    1: 1
                }
            })
        );
        const tree = {
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
                    TITLE: 'Node title 1',
                    DETAIL: 'Node detail 1'
                },
                {
                    TREE_ID: 1,
                    NODE_ID: 13,
                    TITLE: 'Node title 2',
                    DETAIL: 'Node detail 2'
                }
            ]
        } as GuidedAnswerTreeSearchHit;

        const { container } = render(<SearchResultsTree tree={tree} />);
        expect(container).toMatchSnapshot();
        fireEvent.click(screen.getByTestId('search-result-tree-expand-button'));
        expect(actions.expandSearchNodesForTree).toBeCalledWith(1);
    });

    it('opens tree node', () => {
        (useSelector as jest.Mock).mockImplementation((selector) =>
            selector({
                bookmarks: {},
                searchResultVisibleNodeCount: {
                    1: 1
                }
            })
        );
        const tree = {
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
        } as GuidedAnswerTreeSearchHit;

        const { container } = render(<SearchResultsTree tree={tree} />);
        expect(container).toMatchSnapshot();
        fireEvent.click(screen.getByTestId('search-result-node-button'));
        expect(actions.setActiveTree).toBeCalledWith(tree);
        expect(actions.selectNode).toBeCalledWith(12);
    });
});
