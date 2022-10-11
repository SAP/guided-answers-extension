import React from 'react';
import { shallow } from 'enzyme';
import { FeedbackSection } from '../src/webview/ui/components/FeedbackSection/FeedbackSection';
import { initI18n } from '../src/webview/i18n';
import { actions } from '../src/webview/state';

jest.mock('../src/webview/state', () => {
    return {
        actions: {
            guideFeedback: jest.fn(),
            sendFeedbackOutcome: jest.fn()
        }
    };
});

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest
        .fn()
        .mockReturnValue({ guideFeedback: null })
        .mockReturnValueOnce({ guideFeedback: true })
        .mockReturnValueOnce({ guideFeedback: false })
}));

describe('Feedback Section component', () => {
    let wrapper: any;
    initI18n();
    beforeEach(() => {
        wrapper = shallow(<FeedbackSection />);
    });

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    it('render component Feedback Section', () => {
        let component = wrapper.html();
        expect(component).toMatchInlineSnapshot(
            `"<div class="feedback-container"><h3>Please tell us if this answer was helpful</h3><div class="ms-FocusZone css-108 feedback-subcontainer" role="tree" data-focuszone-id="FocusZone0"><button class="feedback-box solved-hover"><svg></svg><h3>This solved my issue</h3></button><button class="feedback-box not-solved-hover" style="border:2px solid var(--vscode-terminal-ansiRed)"><svg></svg><h3>This did not solve my issue</h3></button></div></div>"`
        );
    });

    it('clicking on solved message should change state', () => {
        wrapper.find('.feedback-box').at(0).simulate('click');
        expect(actions.guideFeedback).toBeCalled();
    });

    it('clicking on not solved message should change state', () => {
        wrapper.find('.not-solved-hover').simulate('click');
        expect(actions.guideFeedback).toBeCalled();
    });

    it('The intial guideFeedback state is null', () => {
        // expect(useSelector).toBe(null); <-- Not sure about this? I think you want to test the state?
    });

    // test if box exists - snapshot
    // test if message dialog box apperas
    // test if notSolved componnt shows if not solved is clicked
    // Add snapshots for boxes
});
