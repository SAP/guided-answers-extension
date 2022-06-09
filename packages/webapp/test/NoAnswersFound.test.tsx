import React from 'react';
import { shallow } from 'enzyme';
import { NoAnswersFound } from '../src/webview/ui/components/NoAnswersFound';

describe('<NoAnswersFound />', () => {
    let wrapper: any;

    beforeEach(() => {
        wrapper = shallow(<NoAnswersFound />);
    });

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    it('Should render a NoAnswersFound component', () => {
        expect(wrapper.find('.error-screen').length).toBe(1);
        expect(wrapper.find('.error-screen__object__title').text()).toBe('No answers found');
        expect(wrapper.find('.error-screen__object__subtitle').text()).toBe('Please modfiy search');
    });
});
