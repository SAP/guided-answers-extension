import React, { ReactElement } from 'react';
import { shallow } from 'enzyme';
import { HTML_ENHANCEMENT_DATA_ATTR_MARKER } from '@sap/guided-answers-extension-types';
import { GuidedAnswerNode } from '../../src/webview/ui/components/GuidedAnswerNode';
import { initI18n } from '../../src/webview/i18n';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest
        .fn()
        .mockReturnValue({ activeGuidedAnswerNode: [] })
        .mockReturnValueOnce([
            {
                BODY: `<p>SAP Fiori Tools is a set of extensions for SAP Business Application Studio and Visual Studio Code <span ${HTML_ENHANCEMENT_DATA_ATTR_MARKER}="%7B%22label%22%3A%22Archive%20Project%22%2C%22description%22%3A%22Run%20command%20to%20archive%20a%20Fiori%20tools%20project%20from%20current%20workspace%22%2C%22exec%22%3A%7B%22extensionId%22%3A%22sapse.sap-ux-application-modeler-extension%22%2C%22commandId%22%3A%22sap.ux.environmentcheck.archiveProject%22%7D%7D">Fiori: Archive Project</span></p>`,
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
            `"<section class="guided-answer__node__body"><div id="left" class="column"></div><div id="middle" class="column"><div class="body_container"><header>SAP Fiori Tools</header><div id="hr"></div><div class="ms-FocusZone css-109" data-focuszone-id="FocusZone0"><p>SAP Fiori Tools is a set of extensions for SAP Business Application Studio and Visual Studio Code <button title="Run command to archive a Fiori tools project from current workspace" class="enhancement-link">Fiori: Archive Project</button></p></div><p class="guided-answer__node__question">I have a problem with</p></div><div role="listbox" class="ms-FocusZone css-109" data-focuszone-id="FocusZone1"><div class="guided-answer__node"><button role="option" class="guided-answer__node__edge">Deployment</button><button role="option" class="guided-answer__node__edge">Fiori Generator</button></div></div><span class="ms-layer"></span><span class="ms-layer"></span></div></section>"`
        );
    });

    it('Should render an empty GuidedAnswerNode component', () => {
        expect(wrapper.find('Fragment').length).toBe(1);
    });
});
