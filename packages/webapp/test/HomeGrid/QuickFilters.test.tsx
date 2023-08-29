import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
import { useSelector } from 'react-redux';
import { actions } from '../../src/webview/state';
import { QuickFilters } from '../../src/webview/ui/components/HomeGrid/QuickFilters';

jest.mock('../../src/webview/state', () => ({
    actions: {
        searchTree: jest.fn(),
        updateNetworkStatus: jest.fn()
    }
}));

jest.mock('react-redux', () => ({
    useSelector: jest.fn()
}));

describe('<QuickFilters />', () => {
    afterEach(cleanup);

    const mockQuickFilters = [
        {
            product: ['product 1'],
            component: ['component 1']
        }
    ];

    it('Should render QuickFilters component', () => {
        (useSelector as jest.Mock).mockImplementation((selector) => selector({ quickFilters: mockQuickFilters }));
        const { container } = render(<QuickFilters />);
        expect(container).toMatchSnapshot();

        fireEvent.click(screen.getByRole('button'));
        expect(actions.updateNetworkStatus).toBeCalledWith('LOADING');
        expect(actions.searchTree).toBeCalled();
    });
});
