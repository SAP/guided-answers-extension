import React from 'react';
import { shallow } from 'enzyme';
import { NoAnswersFound } from '../src/webview/ui/components/NoAnswersFound';
import i18next from 'i18next';
import { initI18n } from '../src/webview/i18n';

describe('<NoAnswersFound />', () => {
    let wrapper: any;
    initI18n();
    beforeEach(() => {
        wrapper = shallow(<NoAnswersFound />);
    });

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    it('Should render a NoAnswersFound component', () => {
        expect(wrapper.find('.error-screen').length).toBe(1);
        expect(wrapper.find('.error-screen__object__title').text()).toBe(i18next.t('NO_ANSWERS_FOUND'));
        expect(wrapper.find('.error-screen__object__subtitle').text()).toBe(i18next.t('PLEASE_MODIFY_SEARCH'));
    });
});
