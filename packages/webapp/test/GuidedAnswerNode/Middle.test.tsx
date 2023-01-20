import { treeMock } from '../__mocks__/treeMock';
import React, { ReactElement } from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { Middle } from '../../src/webview/ui/components/GuidedAnswerNode/Middle';
import { actions } from '../../src/webview/state';
import { initI18n } from '../../src/webview/i18n';

const activeNodeMock = {
    BODY: '<p>SAP Fiori Tools is a set of extensions for SAP Business Application Studio and Visual Studio Code</p>',
    EDGES: [
        { LABEL: 'Deployment', TARGET_NODE: 45996, ORD: 1 },
        { LABEL: 'Fiori Generator', TARGET_NODE: 48363, ORD: 2 }
    ],
    NODE_ID: 45995,
    QUESTION: 'I have a problem with',
    TITLE: 'SAP Fiori Tools'
};

jest.mock('../../src/webview/state', () => {
    return {
        actions: {
            selectNode: jest.fn()
        }
    };
});

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn().mockReturnValue({
        activeGuidedAnswerNode: [],
        guidedAnswerTreeSearchResult: {
            trees: [treeMock],
            resultSize: 1,
            productFilters: [],
            componentFilters: []
        },
        query: 'fiori tools',
        guideFeedback: true
    })
}));

export function TestComponent(): ReactElement {
    return <span id="enhancedHtml">Test</span>;
}

describe('<Middle />', () => {
    initI18n();
    afterEach(cleanup);

    it('Should render a Middle component', () => {
        const { container, getAllByTestId } = render(<Middle activeNode={activeNodeMock} enhancedBody={null} />);
        expect(container).toMatchSnapshot();

        const edgeBtn = getAllByTestId('edge_button')[0];
        fireEvent.click(edgeBtn);
        expect(actions.selectNode).toBeCalled();
    });

    it('Should render a Middle component with enhancedBody', () => {
        const { container } = render(<Middle activeNode={activeNodeMock} enhancedBody={TestComponent()} />);
        expect(container).toMatchSnapshot();
    });
});
