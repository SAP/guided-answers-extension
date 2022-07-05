import React from 'react';
import { shallow, render, mount } from 'enzyme';
import { FeedbackInterface } from '../src/webview/ui/components/FeedbackInterface';
import { initI18n } from '../src/webview/i18n';
import { Provider } from 'react-redux';
import { store } from '../src/webview/state';

describe('<FeedbackInterface />', () => {
    let wrapper: any;
    initI18n();
    beforeEach(() => {
        wrapper = shallow(<FeedbackInterface />);
    });

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    //TODO: Backfill tests
    it('Should render a FeedbackInterface component', () => {
        expect(wrapper.find('.solved-box').length).toBe(1);
        expect(wrapper.find('.not-solved-box').length).toBe(1);
    });
});
