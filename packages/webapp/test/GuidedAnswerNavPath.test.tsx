import React from 'react';
import { shallow, render, mount } from 'enzyme';
import { GuidedAnswerNavPath } from '../src/webview/ui/components/GuidedAnswerNavPath';
import { initI18n } from '../src/webview/i18n';
import { Provider } from 'react-redux';
import { store } from '../src/webview/state';

describe('<GuidedAnswerNavPath />', () => {
    let wrapper: any;
    initI18n();
    beforeEach(() => {
        wrapper = shallow(
            <Provider store={store}>
                <GuidedAnswerNavPath />
            </Provider>
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    //TODO: Backfill tests
    it('Should render a GuidedAnswerNavPath component', () => {
        expect(wrapper.find('GuidedAnswerNavPath').length).toBe(1);
    });
});
