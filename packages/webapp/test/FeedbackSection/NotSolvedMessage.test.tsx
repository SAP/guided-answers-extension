import React from 'react';
import { shallow } from 'enzyme';
import { actions } from '../../src/webview/state';
import { initI18n } from '../../src/webview/i18n';
import NotSolvedMessage from '../../src/webview/ui/components/FeedbackSection/NotSolvedMessage/NotSolvedMessage';

jest.mock('../../src/webview/state', () => {
    return {
        actions: {
            goToAllAnswers: jest.fn()
        }
    };
});

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn().mockReturnValue({ guideFeedback: null })
}));

describe('<NotSolvedMessage/>', () => {
    let wrapper: any;
    initI18n();
    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    it('Should render a NotSolvedMessage Component', () => {
        wrapper = shallow(<NotSolvedMessage />);
        const component = wrapper.html();
        expect(component).toMatchInlineSnapshot(
            `"<div id="middle" class="column"><h1>Issue is not resolved</h1><div id="hr"></div><div class="guided-answer__node__question"><p><strong>We are sorry to hear that your issue is not yet resolved.</strong></p><p style="font-weight:400">There are several options for getting further assistance:</p></div><div class="guided-answer__node"><div class="ms-FocusZone css-101 guided-answer__node" data-focuszone-id="FocusZone0"><div class="guided-answer__node"><a class="guided-answer__node__edge" href="https://launchpad.support.sap.com/#/expertchat/create" role="button">Start an Expert Chat</a></div><div class="guided-answer__node"><a class="guided-answer__node__edge" href="https://launchpad.support.sap.com/#/sae" role="button">Schedule an Expert</a></div><div class="guided-answer__node"><a class="guided-answer__node__edge" href="https://launchpad.support.sap.com/#/incident/create" role="button">Open an Incident</a></div><div class="guided-answer__node"><a class="guided-answer__node__edge" href="https://answers.sap.com/index.html" role="button">Ask the SAP Community</a></div><div class="guided-answer__node"><button class="guided-answer__node__edge">Search for another Guided Answer</button></div></div></div></div>"`
        );
    });
});
