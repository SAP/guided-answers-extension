import React, { ReactElement } from 'react';
import { shallow } from 'enzyme';
import { GuidedAnswerNode, enhanceBodyHtml } from '../../src/webview/ui/components/GuidedAnswerNode';
import { initI18n } from '../../src/webview/i18n';

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

describe('<GuidedAnswerNode />', () => {
    let wrapper: any;
    initI18n();
    beforeEach(() => {
        wrapper = shallow(<GuidedAnswerNode />);
    });

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    it('Should render a GuidedAnswerNode component', () => {
        const component = wrapper.html();
        expect(component).toMatchInlineSnapshot(
            `"<section class=\\"guided-answer__node__body\\"><div id=\\"left\\" class=\\"column\\"></div><div id=\\"middle\\" class=\\"column\\"><h1>SAP Fiori Tools</h1><div id=\\"hr\\"></div><div class=\\"content\\"><p>SAP Fiori Tools is a set of extensions for SAP Business Application Studio and Visual Studio Code</p></div><p class=\\"guided-answer__node__question\\">I have a problem with</p><div class=\\"guided-answer__node\\"><div class=\\"guided-answer__node__edge\\">Deployment</div><div class=\\"guided-answer__node__edge\\">Fiori Generator</div></div></div></section>"`
        );
    });

    it('Should render an empty GuidedAnswerNode component', () => {
        expect(wrapper.find('Fragment').length).toBe(1);
    });

    it('Test helper functions', () => {
        const enhancedReactComponent = enhanceBodyHtml('<p id="enhancedHtml">This is a test paragraph</p>');
        function TestComponent(): ReactElement {
            return <div>{enhancedReactComponent}</div>;
        }

        wrapper = shallow(<TestComponent />);
        expect(wrapper.find('#enhancedHtml').text()).toBe('This is a test paragraph');
    });
});
