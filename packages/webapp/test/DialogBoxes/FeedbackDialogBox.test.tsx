import React from 'react';
import { FeedbackDialogBox } from '../../src/webview/ui/components/DialogBoxes/FeedbackDialogBox';
import { render, cleanup, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { AppState } from '../../src/webview/types';
import { getInitialState, reducer } from '../../src/webview/state/reducers';
import { actions } from '../../src/webview/state';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn().mockReturnValue({ feedbackStatus: true })
}));

jest.mock('../../src/webview/state', () => {
    return {
        actions: {
            feedbackStatus: jest.fn(),
            feedbackResponse: jest.fn(),
            sendFeedbackComment: jest.fn()
        }
    };
});

const createState = (initialState: AppState) => (actions: any) => actions.reduce(reducer, initialState);
const mockStore = configureMockStore();

describe('<FeedbackDialogBox />', () => {
    afterEach(cleanup);

    const initialState = createState(getInitialState());
    const store = mockStore(initialState);

    it('Should close FeedbackSendDialogBox component', () => {
        const { container } = render(
            <Provider store={store}>
                <FeedbackDialogBox />
            </Provider>
        );

        expect(container).toMatchSnapshot();

        //Test click event
        const element = screen.getByTestId('closeDialogBtn');
        fireEvent.click(element);
        expect(actions.feedbackStatus).toHaveBeenCalled();
    });

    it('Should test send button', () => {
        const { container } = render(
            <Provider store={store}>
                <FeedbackDialogBox />
            </Provider>
        );

        const textArea = screen.getByTestId('feedbackDialogTextArea') as HTMLInputElement;
        expect(textArea.value).toEqual('');
        expect(screen.getByTestId('sendFeedbackBtn').getAttribute('aria-disabled')).toBe('true');
        expect(screen.getByTestId('sendFeedbackBtn').getAttribute('data-is-focusable')).toBe('true');

        fireEvent.change(textArea, { target: { value: 'test' } });
        expect(screen.getByTestId('sendFeedbackBtn').getAttribute('aria-disabled')).toBe(null);
        expect(screen.getByTestId('sendFeedbackBtn').getAttribute('data-is-focusable')).toBe('true');
    });

    it('Should sennd feedback comment and feedback status', () => {
        const { container } = render(
            <Provider store={store}>
                <FeedbackDialogBox />
            </Provider>
        );

        //Test click event
        const textArea = screen.getByTestId('feedbackDialogTextArea') as HTMLInputElement;
        fireEvent.change(textArea, { target: { value: 'test' } });
        const element = screen.getByTestId('sendFeedbackBtn');
        fireEvent.click(element);
        expect(actions.feedbackResponse).toBeCalled();
        expect(actions.sendFeedbackComment).toBeCalled();
        expect(actions.feedbackStatus).toBeCalled();
    });
});
