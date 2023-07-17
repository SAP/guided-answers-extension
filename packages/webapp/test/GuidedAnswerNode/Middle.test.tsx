import { treeMock } from '../__mocks__/treeMock';
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { Middle } from '../../src/webview/ui/components/GuidedAnswerNode/Middle';
import { actions } from '../../src/webview/state';
import { initI18n } from '../../src/webview/i18n';

let activeNodeMock = {
    BODY: '<p>SAP Fiori Tools is a set of extensions for SAP Business Application Studio and Visual Studio Code</p>',
    EDGES: [
        { LABEL: 'Deployment', TARGET_NODE: 45996, ORD: 1 },
        { LABEL: 'Fiori Generator', TARGET_NODE: 48363, ORD: 2 }
    ],
    NODE_ID: 45995,
    QUESTION: 'I have a problem with',
    TITLE: 'SAP Fiori Tools'
};

let initialState = {
    guidedAnswerTreeSearchResult: {
        trees: [treeMock],
        resultSize: 1,
        productFilters: [],
        componentFilters: []
    },
    query: 'fiori tools',
    activeGuidedAnswer: treeMock,
    activeGuidedAnswerNode: [activeNodeMock],
    lastVisitedGuides: []
};

jest.mock('../../src/webview/state', () => {
    return {
        actions: {
            selectNode: jest.fn(),
            updateLastVisitedGuide: jest.fn()
        }
    };
});

jest.mock('react-redux', () => ({
    useSelector: jest.fn()
}));

export function TestComponent(): ReactElement {
    return <span id="enhancedHtml">Test</span>;
}

describe('<Middle />', () => {
    initI18n();
    afterEach(cleanup);

    it('Should render a Middle component', () => {
        (useSelector as jest.Mock).mockReturnValue({ ...initialState, guideFeedback: true });

        const { container } = render(<Middle activeNode={activeNodeMock} enhancedBody={null} />);
        expect(container).toMatchSnapshot();

        const edgeBtn = screen.getAllByTestId('edge_button')[0];
        fireEvent.click(edgeBtn);
        expect(actions.selectNode).toBeCalled();
        expect(actions.updateLastVisitedGuide).toBeCalled();
    });

    it('Should render a Middle component with enhancedBody', () => {
        (useSelector as jest.Mock).mockReturnValue({ ...initialState, guideFeedback: true });

        const { container } = render(<Middle activeNode={activeNodeMock} enhancedBody={TestComponent()} />);
        expect(container).toMatchSnapshot();
    });

    it('Should render a Middle component with NotSolvedMessage', () => {
        (useSelector as jest.Mock).mockReturnValue({ ...initialState, guideFeedback: false });

        const { container } = render(<Middle activeNode={activeNodeMock} enhancedBody={null} />);
        expect(container).toMatchSnapshot();
    });

    it('Should render a Middle component with FeedbackDialogBox', () => {
        (useSelector as jest.Mock).mockReturnValue({ ...initialState, guideFeedback: true });

        const { container } = render(<Middle activeNode={activeNodeMock} enhancedBody={null} />);
        expect(container).toMatchSnapshot();
    });

    it('Should render a empty Middle component', () => {
        (useSelector as jest.Mock).mockReturnValue({ ...initialState, activeGuidedAnswer: undefined });

        const { container } = render(<Middle activeNode={activeNodeMock} enhancedBody={null} />);
        expect(container).toMatchSnapshot();
    });
});
