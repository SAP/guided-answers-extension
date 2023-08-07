import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { HomeGrid } from '../../src/webview/ui/components/HomeGrid';

jest.mock('react-redux', () => ({
    useSelector: jest.fn()
}));

describe('<HomeGrid />', () => {
    afterEach(cleanup);

    it('Should render only Bookmarks', () => {
        (useSelector as jest.Mock).mockImplementation((selector) =>
            selector({
                bookmarks: {
                    'tree1-node1': {
                        tree: {
                            TREE_ID: 'tree1',
                            TITLE: 'Bookmark 1 Title',
                            DESCRIPTION: 'Bookmark 1 Description',
                            PRODUCT: 'Product 1, Product 2',
                            COMPONENT: 'Component 1, Component 2'
                        },
                        nodePath: [{ NODE_ID: 'node1', TITLE: 'Node 1' }]
                    }
                },
                lastVisitedGuides: [],
                quickFilters: []
            })
        );
        const { container } = render(<HomeGrid />);
        expect(container).toMatchSnapshot();
    });

    it('Should render only LastVisited', () => {
        (useSelector as jest.Mock).mockImplementation((selector) =>
            selector({
                bookmarks: {},
                lastVisitedGuides: [
                    {
                        tree: {
                            TREE_ID: '1',
                            TITLE: 'Bookmark 1 Title',
                            DESCRIPTION: 'Bookmark 1 Description',
                            PRODUCT: 'Product 1, Product 2',
                            COMPONENT: 'Component 1, Component 2'
                        },
                        nodePath: [{ NODE_ID: '1', TITLE: 'Node 1' }],
                        createdAt: 'time'
                    }
                ],
                quickFilters: []
            })
        );
        const { container } = render(<HomeGrid />);
        expect(container).toMatchSnapshot();
    });

    it('Should render only QuickFilters', () => {
        (useSelector as jest.Mock).mockImplementation((selector) =>
            selector({
                bookmarks: {},
                lastVisitedGuides: [],
                quickFilters: [
                    {
                        product: ['product 1'],
                        component: ['component 1']
                    }
                ]
            })
        );
        const { container } = render(<HomeGrid />);
        expect(container).toMatchSnapshot();
    });

    it('Should render all in 2 columns', () => {
        (useSelector as jest.Mock).mockImplementation((selector) =>
            selector({
                bookmarks: {
                    'tree1-node1': {
                        tree: {
                            TREE_ID: 'tree1',
                            TITLE: 'Bookmark 1 Title',
                            DESCRIPTION: 'Bookmark 1 Description',
                            PRODUCT: 'Product 1, Product 2',
                            COMPONENT: 'Component 1, Component 2'
                        },
                        nodePath: [{ NODE_ID: 'node1', TITLE: 'Node 1' }]
                    }
                },
                lastVisitedGuides: [
                    {
                        tree: {
                            TREE_ID: '1',
                            TITLE: 'Bookmark 1 Title',
                            DESCRIPTION: 'Bookmark 1 Description',
                            PRODUCT: 'Product 1, Product 2',
                            COMPONENT: 'Component 1, Component 2'
                        },
                        nodePath: [{ NODE_ID: '1', TITLE: 'Node 1' }],
                        createdAt: 'time'
                    }
                ],
                quickFilters: [
                    {
                        product: ['product 1'],
                        component: ['component 1']
                    }
                ]
            })
        );
        const { container } = render(<HomeGrid />);
        expect(container).toMatchSnapshot();
    });
});
