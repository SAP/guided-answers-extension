import React from 'react';
import { actions } from '../../src/webview/state';
import { FeedbackSection } from '../../src/webview/ui/components/FeedbackSection/FeedbackSection';
import { initI18n } from '../../src/webview/i18n';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import configureMockStore from 'redux-mock-store';
import { getInitialState, reducer } from '../../src/webview/state/reducers';
import { AppState } from '../../src/webview/types';
import { Provider } from 'react-redux';
import { treeMock } from '../__mocks__/treeMock';

jest.mock('../../src/webview/state', () => {
    return {
        actions: {
            guideFeedback: jest.fn(),
            sendFeedbackOutcome: jest.fn()
        }
    };
});

const createState = (initialState: AppState) => (actions: any[]) => actions.reduce(reducer, initialState);
const mockStore = configureMockStore();

describe('Feedback Section component', () => {
    initI18n();
    afterEach(cleanup);

    const stateWithActiveAnswer = getInitialState();

    // When the FeedbackSection component is rendered we are checking for the below props in state
    stateWithActiveAnswer.activeGuidedAnswer = treeMock;
    stateWithActiveAnswer.activeGuidedAnswerNode.push({
        BODY: '<p>SAP Fiori Tools is a set of extensions for SAP Business Application Studio and Visual Studio Code</p>',
        EDGES: [
            { LABEL: 'Deployment', TARGET_NODE: 45996, ORD: 1 },
            { LABEL: 'Fiori Generator', TARGET_NODE: 48363, ORD: 2 }
        ],
        NODE_ID: 45995,
        QUESTION: 'I have a problem with',
        TITLE: 'SAP Fiori Tools'
    });

    const initialState = createState(stateWithActiveAnswer);
    const store = mockStore(initialState);

    it('Should render a FeedbackSection component', () => {
        const { container } = render(
            <Provider store={store}>
                <FeedbackSection />
            </Provider>
        );
        expect(container).toMatchSnapshot();
    });

    it('clicking on solved message should change state', () => {
        const { container } = render(
            <Provider store={store}>
                <FeedbackSection />
            </Provider>
        );
        const element = screen.getByTestId('solved-issue-button');
        fireEvent.click(element);
        expect(actions.guideFeedback).toHaveBeenCalled();
        expect(actions.sendFeedbackOutcome).toHaveBeenCalled();
    });

    it('clicking on not solved message should change state', () => {
        const { container } = render(
            <Provider store={store}>
                <FeedbackSection />
            </Provider>
        );
        const element = screen.getByTestId('not-solved-issue-button');
        fireEvent.click(element);
        expect(actions.guideFeedback).toHaveBeenCalled();
        expect(actions.sendFeedbackOutcome).toHaveBeenCalled();
    });
});
