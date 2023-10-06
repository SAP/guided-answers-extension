import React from 'react';
import { render, screen, cleanup } from '@testing-library/react';
import { fireEvent } from '@testing-library/dom';
import { useSelector } from 'react-redux';
import { actions } from '../../src/webview/state';
import { CollapseButtons } from '../../src/webview/ui/components/Header/CollapseButtons';

jest.mock('../../src/webview/state', () => ({
    actions: {
        expandAllSearchNodes: jest.fn(),
        collapseAllSearchNodes: jest.fn()
    }
}));

jest.mock('react-redux', () => ({
    useSelector: jest.fn()
}));

describe('<CollapseButtons />', () => {
    afterEach(cleanup);

    it('renders without crashing', () => {
        (useSelector as jest.Mock).mockImplementation((selector) =>
            selector({
                guidedAnswerTreeSearchResult: {
                    resultSize: 1
                }
            })
        );

        const { container } = render(<CollapseButtons />);
        expect(container).toMatchSnapshot();
    });

    it('renders without crashing, disabled buttons', () => {
        (useSelector as jest.Mock).mockImplementation((selector) =>
            selector({
                guidedAnswerTreeSearchResult: {
                    resultSize: 0
                }
            })
        );

        const { container } = render(<CollapseButtons />);
        expect(container).toMatchSnapshot();
    });

    it('expands all trees', () => {
        (useSelector as jest.Mock).mockImplementation((selector) =>
            selector({
                guidedAnswerTreeSearchResult: {
                    resultSize: 1
                }
            })
        );

        render(<CollapseButtons />);
        fireEvent.click(screen.getByTestId('expand-all-button'));
        expect(actions.expandAllSearchNodes).toBeCalledTimes(1);
    });

    it('collapse all trees', () => {
        (useSelector as jest.Mock).mockImplementation((selector) =>
            selector({
                guidedAnswerTreeSearchResult: {
                    resultSize: 1
                }
            })
        );

        render(<CollapseButtons />);
        fireEvent.click(screen.getByTestId('collapse-all-button'));
        expect(actions.collapseAllSearchNodes).toBeCalledTimes(1);
    });
});
