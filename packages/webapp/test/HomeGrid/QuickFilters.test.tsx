import React from 'react';
import { render, cleanup } from '@testing-library/react';
import { fireEvent, screen } from '@testing-library/dom';
import { useSelector } from 'react-redux';
import { actions } from '../../src/webview/state';
import { Filters } from '../../src/webview/ui/components/HomeGrid/Filters';

jest.mock('../../src/webview/state', () => ({
    actions: {
        searchTree: jest.fn(),
        updateNetworkStatus: jest.fn()
    }
}));

jest.mock('react-redux', () => ({
    useSelector: jest.fn()
}));

describe('<Filters />', () => {
    afterEach(cleanup);

    const mockAutoFilters = [
        {
            product: ['product 1'],
            component: ['component 1']
        }
    ];

    it('Should render AutoFilters component', () => {
        (useSelector as jest.Mock).mockImplementation((selector) => selector({ autoFilters: mockAutoFilters }));
        const { container } = render(<Filters />);
        expect(container).toMatchSnapshot();

        fireEvent.click(screen.getByRole('button'));
        expect(actions.updateNetworkStatus).toBeCalledWith('LOADING');
        expect(actions.searchTree).toBeCalled();
    });
});
