import React from 'react';
import { shallow } from 'enzyme';
import { Logo } from '../../src/webview/ui/components/Header/Logo';
import i18next from 'i18next';
import { initI18n } from '../../src/webview/i18n';

describe('<Logo />', () => {
    let wrapper: any;
    initI18n();
    beforeEach(() => {
        wrapper = shallow(<Logo />);
    });

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    it('Should render a Logo component', () => {
        expect(wrapper.find('.guided-answer__header__logoAndTitle').length).toBe(1);
        expect(wrapper.find('.guided-answer__header__title').text()).toBe(i18next.t('GUIDED_ANSWERS'));
    });
});
