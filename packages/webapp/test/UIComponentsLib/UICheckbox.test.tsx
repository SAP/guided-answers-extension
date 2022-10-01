import * as React from 'react';
import * as Enzyme from 'enzyme';
import type { ICheckboxStyles, IRawStyle, IStyleFunction } from '@fluentui/react';
import { Checkbox } from '@fluentui/react';
import { UICheckbox } from '../../../webapp/src/webview/ui/components/UIComponentsLib/UICheckbox';

describe('<UIToggle />', () => {
    let wrapper: Enzyme.ReactWrapper<any>;
    const globalClassNames = {
        root: 'ms-Checkbox',
        checkmark: 'ms-Checkbox-checkmark',
        error: 'ts-message-wrapper--error'
    };

    beforeEach(() => {
        wrapper = Enzyme.mount(<UICheckbox />);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('Should render a UIToggle component', () => {
        expect(wrapper.find(`.${globalClassNames.root}`).length).toEqual(1);
    });

    describe('Styles - validation message', () => {
        it('No message', () => {
            const styles = (wrapper.find(Checkbox).props().styles as IStyleFunction<{}, {}>)({}) as ICheckboxStyles;
            const rootStyles = styles.root as IRawStyle;
            expect(rootStyles[2]).toEqual(undefined);
            expect(wrapper.find(`.${globalClassNames.error}`).length).toEqual(0);
        });
    });

    describe('Styles', () => {
        it('Unchecked', () => {
            const styles = (wrapper.find(Checkbox).props().styles as IStyleFunction<{}, {}>)({}) as ICheckboxStyles;
            const rootStyles = styles.root as IRawStyle;
            // Check hover opacity
            expect(rootStyles[0][0][`:hover .${globalClassNames.checkmark}`].opacity).toEqual(0);
        });

        it('Checked', () => {
            const styles = (wrapper.find(Checkbox).props().styles as IStyleFunction<{}, {}>)({
                checked: true
            }) as ICheckboxStyles;
            const rootStyles = styles.root as IRawStyle;
            // Check hover opacity
            expect(rootStyles[0][0][`:hover .${globalClassNames.checkmark}`]).toEqual(undefined);
        });
    });
});