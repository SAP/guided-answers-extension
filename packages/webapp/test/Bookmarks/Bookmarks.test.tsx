import React from 'react';
import { render, screen, within } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { Bookmarks } from '../../src/webview/ui/components/Bookmarks';

jest.mock('react-redux', () => ({
    useSelector: jest.fn()
}));

describe('<Bookmarks />', () => {
    const mockBookmarks = {
        'bookmark-1': {
            tree: {
                TREE_ID: '1',
                TITLE: 'Bookmark 1 Title',
                DESCRIPTION: 'Bookmark 1 Description',
                PRODUCT: 'Product 1, Product 2',
                COMPONENT: 'Component 1, Component 2'
            },
            nodePath: [{ NODE_ID: '1', TITLE: 'Node 1' }]
        },
        'bookmark-2': {
            tree: {
                TREE_ID: '2',
                TITLE: 'Bookmark 2 Title',
                DESCRIPTION: 'Bookmark 2 Description',
                PRODUCT: 'Product 1, Product 2',
                COMPONENT: 'Component 1, Component 2'
            },
            nodePath: [{ NODE_ID: '2', TITLE: 'Node 2' }]
        }
    };

    beforeEach(() => {
        (useSelector as jest.Mock).mockImplementation((selector) => selector({ bookmarks: mockBookmarks }));
    });

    it('renders without crashing', () => {
        render(<Bookmarks />);
        expect(screen.getByText('Bookmarks')).toBeInTheDocument();
    });

    it('renders all bookmarks', () => {
        render(<Bookmarks />);
        expect(screen.getByText('Bookmark 1 Title - Node 1')).toBeInTheDocument();
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
});
