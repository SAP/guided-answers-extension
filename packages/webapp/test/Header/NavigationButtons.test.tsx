import React from 'react';
import { shallow } from 'enzyme';
import { actions } from '../../src/webview/state';
import { AllAnswersButton, BackButton, RestartButton } from '../../src/webview/ui/components/Header/NavigationButtons';
import i18next from 'i18next';
import { initI18n } from '../../src/webview/i18n';

jest.mock('../../src/webview/state', () => {
    return {
        actions: {
            goToAllAnswers: jest.fn(),
            goToPreviousPage: jest.fn(),
            restartAnswer: jest.fn()
        }
    };
});
describe('<AllAnswersButton />', () => {
    let wrapper: any;
    initI18n();
    beforeEach(() => {
        wrapper = shallow(<AllAnswersButton />);
    });

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    it('Should render a AllAnswersButton component', () => {
        //Test UI rendering
        expect(wrapper.find('.guided-answer__header__navButtons').length).toBe(1);
        expect(wrapper.find('.guided-answer__header__navButtons').hasClass('home-icon')).toBe(true);
        expect(wrapper.find('.guided-answer__header__navButtons').props().onClick).toBeDefined();
        expect(wrapper.find('VscHome').length).toBe(1);
        expect(wrapper.find('.guided-answer__header__navButtons__content__text').hasClass('text-underline')).toBe(true);
        expect(wrapper.find('.guided-answer__header__navButtons__content__text').text()).toBe(i18next.t('ALL_ANSWERS'));

        //Test click event
        wrapper.find('.guided-answer__header__navButtons').simulate('click');
        expect(actions.goToAllAnswers).toBeCalled();
    });
});

describe('<BackButton />', () => {
    let wrapper: any;
    initI18n();
    beforeEach(() => {
        wrapper = shallow(<BackButton />);
    });

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    it('Should render a BackButton component', () => {
        //Test UI rendering
        expect(wrapper.find('.guided-answer__header__navButtons').length).toBe(1);
        expect(wrapper.find('.guided-answer__header__navButtons').props().onClick).toBeDefined();
        expect(wrapper.find('VscArrowLeft').length).toBe(1);
        expect(wrapper.find('.guided-answer__header__navButtons__content').at(1).hasClass('text-underline')).toBe(true);
        expect(wrapper.find('.guided-answer__header__navButtons__content').at(1).text()).toBe(i18next.t('STEP_BACK'));

        //Test click event
        wrapper.find('.guided-answer__header__navButtons').simulate('click');
        expect(actions.goToPreviousPage).toBeCalled();
    });
});

describe('<RestartButton />', () => {
    let wrapper: any;
    initI18n();
    beforeEach(() => {
        wrapper = shallow(<RestartButton />);
    });

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    it('Should render a RestartButton component', () => {
        //Test UI rendering
        expect(wrapper.find('.guided-answer__header__navButtons').length).toBe(1);
        expect(wrapper.find('.guided-answer__header__navButtons').props().onClick).toBeDefined();
        expect(wrapper.find('VscRefresh').length).toBe(1);
        expect(wrapper.find('.guided-answer__header__navButtons__content').at(1).hasClass('text-underline')).toBe(true);
        expect(wrapper.find('.guided-answer__header__navButtons__content').at(1).text()).toBe(i18next.t('RESTART'));

        //Test click event
        wrapper.find('.guided-answer__header__navButtons').simulate('click');
        expect(actions.restartAnswer).toBeCalled();
    });
});
