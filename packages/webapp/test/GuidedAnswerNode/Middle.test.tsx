import React, { ReactElement } from 'react';
import { shallow } from 'enzyme';
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
    TITLE: 'SAP Fiori Tools',
    COMMANDS: [
        {
            label: 'Label for command',
            description: 'Description for command',
            exec: {
                extensionId: 'terry.exxt',
                commandId: 'Knock kock',
                argument: { fsPath: 'whos/there/body/of' }
            }
        }
    ]
};

jest.mock('../../src/webview/state', () => {
    return {
        actions: {
            selectNode: jest.fn()
        }
    };
});

export function TestComponent(): ReactElement {
    return <span id="enhancedHtml">Test</span>;
}

describe('<Middle />', () => {
    let wrapper: any;
    initI18n();
    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    it('Should render a Middle component', () => {
        wrapper = shallow(<Middle activeNode={activeNodeMock} enhancedBody={null} />);
        const component = wrapper.html();
        expect(component).toMatchInlineSnapshot(
            `"<div id=\\"middle\\" class=\\"column\\"><div class=\\"body_container\\"><header>SAP Fiori Tools</header><div id=\\"hr\\"></div><div class=\\"ms-FocusZone css-101\\" data-focuszone-id=\\"FocusZone0\\"><div class=\\"content\\"><p>SAP Fiori Tools is a set of extensions for SAP Business Application Studio and Visual Studio Code</p></div></div><p class=\\"guided-answer__node__question\\">I have a problem with</p></div><div class=\\"ms-FocusZone css-101\\" data-focuszone-id=\\"FocusZone1\\"><div class=\\"guided-answer__node\\"><button class=\\"guided-answer__node__edge\\">Deployment</button><button class=\\"guided-answer__node__edge\\">Fiori Generator</button></div></div></div>"`
        );

        //Test click event
        //We have two edges
        wrapper.find('.guided-answer__node__edge').at(0).simulate('click');
        wrapper.find('.guided-answer__node__edge').at(1).simulate('click');
        expect(actions.selectNode).toBeCalled();
    });

    it('Should render a Middle component with enhancedBody', () => {
        wrapper = shallow(<Middle activeNode={activeNodeMock} enhancedBody={TestComponent()} />);
        expect(wrapper.find('#enhancedHtml').length).toBe(1);
    });
});
