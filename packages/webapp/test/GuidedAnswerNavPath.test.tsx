import React from 'react';
import { GuidedAnswerNavPath } from '../src/webview/ui/components/GuidedAnswerNavPath';
import { initI18n } from '../src/webview/i18n';
import { actions } from '../src/webview/state';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import configureMockStore from 'redux-mock-store';
import { getInitialState, reducer } from '../src/webview/state/reducers';
import { AppState } from '../src/webview/types';
import { Provider } from 'react-redux';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest
        .fn()
        .mockReturnValue({ activeGuidedAnswerNode: [] })
        .mockReturnValueOnce([
            {
                BODY: '<p>SAP Fiori Tools is a set of extensions for SAP Business Application Studio and Visual Studio Code</p>',
                EDGES: [
                    { LABEL: 'Deployment', TARGET_NODE: 45996, ORD: 1 },
                    { LABEL: 'Fiori Generator', TARGET_NODE: 48363, ORD: 2 }
                ],
                NODE_ID: 45995,
                QUESTION: 'I have a problem with',
                TITLE: 'SAP Fiori Tools'
            }
        ])
}));

jest.mock('../src/webview/state', () => {
    return {
        actions: {
            updateActiveNode: jest.fn()
        }
    };
});

const createState = (initialState: AppState) => (actions: any[]) => actions.reduce(reducer, initialState);
const mockStore = configureMockStore();

describe('<GuidedAnswerNavPath />', () => {
    initI18n();
    afterEach(cleanup);

    const initialState = createState(getInitialState());
    const store = mockStore(initialState);

    it('Should render a GuidedAnswerNavPath component', () => {
        const { container } = render(
            <Provider store={store}>
                <GuidedAnswerNavPath />
            </Provider>
        );
        expect(container).toMatchSnapshot();

        //Test click event
        const element = screen.getByTestId('timeline-content');
        fireEvent.click(element);
        expect(actions.updateActiveNode).toBeCalled();
    });

    it('Should render an empty GuidedAnswerNavPath component', () => {
        const { container } = render(
            <Provider store={store}>
                <GuidedAnswerNavPath />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });
});
