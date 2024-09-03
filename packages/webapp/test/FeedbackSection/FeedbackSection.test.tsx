import React from 'react';
import { actions } from '../../src/webview/state';
import { FeedbackSection } from '../../src/webview/ui/components/FeedbackSection/FeedbackSection';
import { initI18n } from '../../src/webview/i18n';
import { render, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import configureMockStore from 'redux-mock-store';
import { getInitialState, reducer } from '../../src/webview/state/reducers';
import { AppState } from '../../src/webview/types';
import { useSelector } from 'react-redux';
import { treeMock } from '../__mocks__/tree.mock';

const initialState = {
    ...getInitialState(),
    activeGuidedAnswer: treeMock,
    activeGuidedAnswerNode: [
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
    ]
};

jest.mock('../../src/webview/state', () => {
    return {
        actions: {
            guideFeedback: jest.fn(),
            sendFeedbackOutcome: jest.fn(),
            goToHomePage: jest.fn()
        }
    };
});

jest.mock('react-redux', () => ({
    useSelector: jest.fn()
}));

describe('Feedback Section component', () => {
    initI18n();
    afterEach(cleanup);

    it('Should render a FeedbackSection component', () => {
        (useSelector as jest.Mock).mockImplementation((fn) => fn(initialState));
        const { container } = render(<FeedbackSection />);
        expect(container).toMatchSnapshot();
    });

    it('clicking on solved message should change state', () => {
        (useSelector as jest.Mock).mockImplementation((fn) => fn(initialState));
        const { container } = render(<FeedbackSection />);
        const element = screen.getByTestId('solved-issue-button');
        fireEvent.click(element);
        expect(actions.guideFeedback).toHaveBeenCalled();
        expect(actions.sendFeedbackOutcome).toHaveBeenCalled();
    });

    it('clicking on not solved message should change state', () => {
        (useSelector as jest.Mock).mockImplementation((fn) => fn(initialState));
        const { container } = render(<FeedbackSection />);
        const element = screen.getByTestId('not-solved-issue-button');
        fireEvent.click(element);
        expect(actions.guideFeedback).toHaveBeenCalled();
        expect(actions.sendFeedbackOutcome).toHaveBeenCalled();
    });

    it('clicking on home button in dialog should go to home page', async () => {
        (useSelector as jest.Mock).mockImplementation((fn) => fn({ ...initialState, guideFeedback: true }));
        const { container } = render(<FeedbackSection />);
        fireEvent.click(screen.getByTestId('dialog-home-button'));
        expect(actions.goToHomePage).toHaveBeenCalled();
    });

    it('clicking on close button in dialog should close dialog', async () => {
        (useSelector as jest.Mock).mockImplementation((fn) => fn({ ...initialState, guideFeedback: true }));
        const { container } = render(<FeedbackSection />);
        fireEvent.click(screen.getByTestId('dialog-close-button'));
        expect(actions.guideFeedback).toHaveBeenCalled();
    });
});
