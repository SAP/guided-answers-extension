import React from 'react';
import { shallow } from 'enzyme';
import { GuidedAnswerNavPath } from '../src/webview/ui/components/GuidedAnswerNavPath';
import { initI18n } from '../src/webview/i18n';
import { actions } from '../src/webview/state';

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

describe('<GuidedAnswerNavPath />', () => {
    let wrapper: any;
    initI18n();
    beforeEach(() => {
        wrapper = shallow(<GuidedAnswerNavPath />);
    });

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    it('Should render a GuidedAnswerNavPath component', () => {
        const component = wrapper.html();
        expect(component).toMatchInlineSnapshot(
            `"<nav class="container"><div role="tree" class="ms-FocusZone css-101" data-focuszone-id="FocusZone0"><div class="timeline-block" role="treeitem"><button class="timeline-content timeline-content-bottom-border"><div class="timeline__path" title="SAP Fiori Tools"><span class="timeline-content-title-small bold-text">1</span><span class="timeline-content-title-large">SAP Fiori Tools</span></div></button></div></div></nav>"`
        );

        //Test click event
        wrapper.find('.timeline-content').simulate('click');
        expect(actions.updateActiveNode).toBeCalled();
    });

    it('Should render an empty GuidedAnswerNavPath component', () => {
        expect(wrapper.find('Fragment').length).toBe(1);
    });
});
