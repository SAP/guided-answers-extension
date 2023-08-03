import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
import { useSelector } from 'react-redux';
import { LastVisited } from '../../src/webview/ui/components/LastVisited';
import { actions } from '../../src/webview/state';

jest.mock('../../src/webview/state', () => ({
    actions: {
        setActiveTree: jest.fn(),
        updateActiveNode: jest.fn()
    }
}));

jest.mock('react-redux', () => ({
    useSelector: jest.fn()
}));

describe('<LastVisited />', () => {
    afterEach(cleanup);

    const mockLastVisited = [
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
        },
        {
            tree: {
                TREE_ID: '2',
                TITLE: 'Bookmark 2 Title',
                DESCRIPTION: 'Bookmark 2 Description',
                PRODUCT: 'Product 1, Product 2',
                COMPONENT: 'Component 1, Component 2'
            },
            nodePath: [{ NODE_ID: '2', TITLE: 'Node 2' }],
            createdAt: 'time2'
        }
    ];

    it('Should render LastVisited component', () => {
        (useSelector as jest.Mock).mockImplementation((selector) => selector({ lastVisitedGuides: mockLastVisited }));
        const { container } = render(<LastVisited />);
        expect(container).toMatchSnapshot();

        const btn = screen.getAllByTestId('last-visited-button')[0];
        fireEvent.click(btn);
        expect(actions.setActiveTree).toBeCalledTimes(1);
        expect(actions.updateActiveNode).toBeCalledTimes(1);
    });

    it('Should render LastVisited component with no data', () => {
        (useSelector as jest.Mock).mockImplementation((selector) => selector({ lastVisitedGuides: [] }));
        const { container } = render(<LastVisited />);
        expect(container).toMatchSnapshot();
    });
});
