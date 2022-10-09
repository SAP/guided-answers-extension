import React from 'react';
import { shallow } from 'enzyme';
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
    let wrapper: any;
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

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    it('Should render a Right component without command', () => {
        wrapper = shallow(<Right activeNode={activeGuidedAnswerNodeMock[0]} />);
        const component = wrapper.html();
        expect(component).toMatchInlineSnapshot(
            `"<div id="right" class="column"><div class="guided-answer__node__commands"><div class="ms-FocusZone css-101" data-focuszone-id="FocusZone0"></div></div></div>"`
        );
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
        wrapper = shallow(<Right activeNode={activeNodeMock} />);
        const component = wrapper.html();
        expect(component).toMatchInlineSnapshot(
            `"<div id="right" class="column"><div class="guided-answer__node__commands"><div class="ms-FocusZone css-101" data-focuszone-id="FocusZone1"><div class="guided-answer__node__command"><div class="guided-answer__node__command__header"><div class="guided-answer__node__command__header__label">Label for command</div></div><button class="guided-answer__node__command__description">Description for command</button></div></div></div></div>"`
        );

        //Test click event
        wrapper.find('.guided-answer__node__command__description').simulate('click');
        expect(actions.executeCommand).toBeCalled();
    });
});
