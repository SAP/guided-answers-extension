import React from 'react';
import { FeedbackSentDialogBox } from '../../src/webview/ui/components/DialogBoxes/FeedbackSentDialogBox/FeedbackSentDialogBox';
import { render, cleanup } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import { AppState } from '../../src/webview/types';
import { getInitialState, reducer } from '../../src/webview/state/reducers';
import { actions } from '../../src/webview/state';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn().mockReturnValue({ feedbackResponse: true })
}));

jest.mock('../../src/webview/state', () => {
    return {
        actions: {
            feedbackResponse: jest.fn()
        }
    };
});

const createState = (initialState: AppState) => (actions: any) => actions.reduce(reducer, initialState);
const mockStore = configureMockStore();

describe('<FeedbackDialogBox />', () => {
    afterEach(cleanup);

    const initialState = createState(getInitialState());
    const store = mockStore(initialState);

    it('Should render a FeedbackSendDialogBox component', () => {
        const { container } = render(
            <Provider store={store}>
                <FeedbackSentDialogBox />
            </Provider>
        );
        expect(container).toMatchSnapshot();
        // jest.runAllTimers();
        // expect(actions.feedbackResponse).toHaveBeenCalled();
    });
});
