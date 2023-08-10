import React from 'react';
import { render, screen, within, cleanup } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { useSelector } from 'react-redux';
import { actions } from '../../src/webview/state';
import { Bookmarks } from '../../src/webview/ui/components/Bookmarks';

jest.mock('../../src/webview/state', () => ({
    actions: {
        updateBookmark: jest.fn(),
        setActiveTree: jest.fn(),
        updateActiveNode: jest.fn(),
        synchronizeBookmark: jest.fn()
    }
}));

jest.mock('react-redux', () => ({
    useSelector: jest.fn()
}));

jest.useFakeTimers().setSystemTime(new Date('2020-01-01'));

describe('<Bookmarks />', () => {
    const mockBookmarks = {
        'tree1-node1': {
            tree: {
                TREE_ID: 'tree1',
                TITLE: 'Bookmark 1 Title',
                DESCRIPTION: 'Bookmark 1 Description',
                PRODUCT: 'Product 1, Product 2',
                COMPONENT: 'Component 1, Component 2'
            },
            nodePath: [{ NODE_ID: 'node1', TITLE: 'Node 1' }]
        },
        'tree2-node1:node2': {
            tree: {
                TREE_ID: 'tree2',
                TITLE: 'Bookmark 2 Title',
                DESCRIPTION: 'Bookmark 2 Description',
                PRODUCT: 'Product 1, Product 2',
                COMPONENT: 'Component 1, Component 2'
            },
            nodePath: [
                { NODE_ID: 'node1', TITLE: 'Node 1' },
                { NODE_ID: 'node2', TITLE: 'Node 2' }
            ]
        }
    };

    afterEach(cleanup);
    beforeEach(() => {
        (useSelector as jest.Mock).mockImplementation((selector) => selector({ bookmarks: mockBookmarks }));
    });

    it('renders without crashing', () => {
        render(<Bookmarks />);
        expect(screen.getByText('Bookmarks')).toBeInTheDocument();
    });

    it('renders all bookmarks', () => {
        render(<Bookmarks />);
        expect(screen.getByText('Bookmark 1 Title')).toBeInTheDocument();
        expect(screen.getByText('Bookmark 2 Title - Node 2')).toBeInTheDocument();
    });

    it('renders the TreeItemBottomSection for each bookmark', () => {
        render(<Bookmarks />);
        const productContainers = screen.getAllByTestId('product-container');
        productContainers.forEach((container) => {
            const productTitle = within(container).getByText('Product:');
            expect(productTitle).toBeInTheDocument();

            const firstProduct = within(container).getByText('Product 1');
            expect(firstProduct).toBeInTheDocument();
        });
    });

    it('opens a bookmarked guide', () => {
        render(<Bookmarks />);

        fireEvent.click(screen.getAllByTestId('goto-bookmark-button')[1]);
        expect(actions.setActiveTree).toBeCalledTimes(1);
        expect(actions.updateActiveNode).toBeCalledTimes(2);
        expect(actions.synchronizeBookmark).toBeCalledTimes(1);
    });

    it('removes bookmark from the list', () => {
        render(<Bookmarks />);

        fireEvent.click(screen.getAllByTestId('bookmark-button')[0]);
        expect(actions.updateBookmark).toBeCalledWith({
            bookmarkKey: 'tree1-node1',
            bookmarks: {
                [Object.keys(mockBookmarks)[1]]: Object.values(mockBookmarks)[1]
            }
        });
    });

    it('adds bookmark from the list', () => {
        (useSelector as jest.Mock).mockImplementation((selector) =>
            selector({
                bookmarks: {
                    [Object.keys(mockBookmarks)[1]]: Object.values(mockBookmarks)[1]
                }
            })
        );
        jest.spyOn(JSON, 'parse').mockImplementationOnce(() => mockBookmarks);

        render(<Bookmarks />);

        fireEvent.click(screen.getAllByTestId('bookmark-button')[0]);
        expect(actions.updateBookmark).toBeCalledWith({
            bookmarkKey: 'tree1-node1',
            bookmarks: {
                [Object.keys(mockBookmarks)[0]]: {
                    ...Object.values(mockBookmarks)[0],
                    createdAt: '2020-01-01T00:00:00.000Z'
                },
                [Object.keys(mockBookmarks)[1]]: Object.values(mockBookmarks)[1]
            }
        });
    });
});
