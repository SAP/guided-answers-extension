import * as React from 'react';
import * as Enzyme from 'enzyme';
import type { IStyleFunction, ITextFieldStyleProps } from '@fluentui/react';
import { TextField } from '@fluentui/react';
import { UITextInput } from '../../src/webview/ui/components/UIComponentsLib/UIInput';

describe('<UIToggle />', () => {
    let wrapper: Enzyme.ReactWrapper<any>;

    beforeEach(() => {
        wrapper = Enzyme.mount(<UITextInput />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('Should render a UITextInput component', () => {
        expect(wrapper.find('.ms-TextField').length).toEqual(1);
    });

    it('Styles - default', () => {
        const styles = (wrapper.find(TextField).props().styles as IStyleFunction<{}, {}>)({}) as ITextFieldStyleProps;
        expect(styles).toMatchSnapshot();
    });
});
