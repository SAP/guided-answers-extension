import React from 'react';
import { shallow } from 'enzyme';
import { FeedbackSection } from '../src/webview/ui/components/FeedbackSection/FeedbackSection';

jest.mock('react-redux', () => ({
    ...jest.requireActual('react-redux'),
    useSelector: jest
        .fn()
        .mockReturnValue({ guideFeedback: null })
        .mockReturnValueOnce({ guideFeedback: true })
        .mockReturnValueOnce({ guideFeedback: false })
}));

jest.mock('../src/webview/state', () => {
    return {
        actions: {
            guideFeedback: jest.fn()
        }
    };
});

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
        expect(component).toMatchInlineSnapshot();
    });

    it('clicking on solved message should change state', () => {
        wrapper.find('.feedback-box').simulate('click');
        expect(actions.guideFeedback).toBeCalled();
    });

    it('clicking on not solved message should change state', () => {
        wrapper.find('solved-hover').simulate('click');
        expect(actions.guideFeedback).toBeCalled();
    });

    it('The intial guideFeedback state is null', () => {
        expect(useSelector).toBe(null);
    });

    // test if box exists - snapshot
    // test if message dialog box apperas
    // test if notSolved componnt shows if not solved is clicked
    // Add snapshots for boxes
});
