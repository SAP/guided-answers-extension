import * as React from 'react';
import * as Enzyme from 'enzyme';
import type { IButtonProps } from '@fluentui/react';
import { IconButton } from '@fluentui/react';
import { UIIconButton } from '../../src/webview/ui/components/UIComponentsLib/UIButton/UIIconButton';

describe('<UIIconButton />', () => {
    let wrapper: Enzyme.ReactWrapper<IButtonProps>;

    beforeEach(() => {
        wrapper = Enzyme.mount(<UIIconButton>Dummy</UIIconButton>);
    });

    afterEach(() => {
        wrapper.unmount();
    });

    it('Should render a UIIconButton component', () => {
        expect(wrapper.find('.ms-Button').length).toEqual(1);
    });

    it('Styles - primary', () => {
        wrapper.setProps({
            primary: true
        });
        const styles = wrapper.find(IconButton).props().styles;
        expect(styles?.root).toMatchInlineSnapshot(
            {},
            `
            Object {
              "backgroundColor": "transparent",
              "borderRadius": 4,
              "boxSizing": "content-box",
              "height": 16,
              "minWidth": "initial",
              "padding": 3,
              "selectors": Object {
                ".ms-Fabric--isFocusVisible &:focus:after": Object {
                  "outline": "1px solid var(--vscode-focusBorder)",
                },
              },
              "width": 16,
            }
        `
        );
    });

    it('Styles - secondary', () => {
        wrapper.setProps({
            primary: false
        });
        const styles = wrapper.find(IconButton).props().styles;
        expect(styles?.root).toMatchInlineSnapshot(
            {},
            `
            Object {
              "backgroundColor": "transparent",
              "borderRadius": 4,
              "boxSizing": "content-box",
              "height": 16,
              "minWidth": "initial",
              "padding": 3,
              "selectors": Object {
                ".ms-Fabric--isFocusVisible &:focus:after": Object {
                  "outline": "1px solid var(--vscode-focusBorder)",
                },
              },
              "width": 16,
            }
        `
        );
    });
});
