import React from 'react';
import { shallow } from 'enzyme';
import { actions } from '../src/webview/state';
import { FeedbackSection } from '../src/webview/ui/components/FeedbackSection/FeedbackSection';
import { guideFeedback, sendFeedbackComment, sendFeedbackOutcome } from '@sap/guided-answers-extension-types';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest.fn().mockReturnValue({ guideFeedback: null })
}));

jest.mock('../src/webview/state', () => {
    return {
        actions: {
            guideFeedback: jest.fn(),
            sendFeedbackOutcome: jest.fn()
        }
    };
});

describe('Feedback Section component', () => {
    let wrapper: any;
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
            `"<div class="feedback-container"><h3></h3><div class="ms-FocusZone css-108 feedback-subcontainer" role="tree" data-focuszone-id="FocusZone0"><button class="feedback-box solved-hover"><svg></svg><h3></h3></button><button class="feedback-box not-solved-hover" style="border:2px solid var(--vscode-terminal-ansiRed)"><svg></svg><h3></h3></button></div></div>"`
        );
    });

    it('clicking on solved message should change state', () => {
        wrapper.find('.feedback-box').at(0).simulate('click');
        expect(actions.guideFeedback).toBeCalled();
    });

    it('clicking on not solved message should change state', () => {
        wrapper.find('.feedback-box').at(1).simulate('click');
        expect(actions.guideFeedback).toBeCalled();
    });

    // it('The intial guideFeedback state is null', () => {
    //     expect(guideFeedback).toBe(null);
    // });

    // test if box exists - snapshot
    // test if message dialog box apperas
    // test if notSolved componnt shows if not solved is clicked
    // Add snapshots for boxes
});
