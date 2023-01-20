import React from 'react';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { Right } from '../../src/webview/ui/components/GuidedAnswerNode/Right';
import { actions } from '../../src/webview/state';
import { initI18n } from '../../src/webview/i18n';

jest.mock('../../src/webview/state', () => {
    return {
        actions: {
            executeCommand: jest.fn()
        }
    };
});

describe('<Right />', () => {
    initI18n();
    const activeGuidedAnswerNodeMock = [
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
    ];
    afterEach(cleanup);

    it('Should render a Right component without command', () => {
        const { container } = render(<Right activeNode={activeGuidedAnswerNodeMock[0]} />);
        expect(container).toMatchSnapshot();
    });

    it('Should render a Right component', () => {
        const activeNodeMock: any = activeGuidedAnswerNodeMock[0];
        activeNodeMock.COMMANDS = [
            {
                label: 'Label for command',
                description: 'Description for command',
                exec: {
                    extensionId: 'terry.exxt',
                    commandId: 'Knock kock',
                    argument: { fsPath: 'whos/there/body/of' }
                }
            }
        ];
        const { container } = render(<Right activeNode={activeNodeMock} />);
        expect(container).toMatchSnapshot();

        //Test click event
        const element = screen.getByTestId('guided-answer__node__command');
        fireEvent.click(element);
        expect(actions.executeCommand).toBeCalled();
    });
});
