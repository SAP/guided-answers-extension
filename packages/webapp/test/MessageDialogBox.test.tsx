import React from 'react';
import { shallow } from 'enzyme';
import i18next from 'i18next';
import { MessageDialogBox } from '../src/webview/ui/components/DialogBoxes/MessageDialogBox';

describe('<MessageDialogBox />', () => {
    let wrapper: any;

    beforeEach(() => {
        const defaultButtonFunction = jest.fn();
        const primaryButtonFunction = jest.fn();
        wrapper = shallow(
            <MessageDialogBox
                dialogTitle={i18next.t('THANKS')}
                dialogText={i18next.t('THANK_YOU_TEXT')}
                dialogVisible={true}
                primaryButtonAction={defaultButtonFunction}
                defaultButtonAction={primaryButtonFunction}
                stylingClassName="solved-message-dialog"
            />
        );
    });

    afterEach(() => {
        jest.clearAllMocks();
        wrapper.unmount();
    });

    it('Should render MessageDialogBox component', () => {
        let component = wrapper.html();
        console.log(component);

        expect(component).toMatchInlineSnapshot(`"<span class="ms-layer"></span>"`);
    });
});
