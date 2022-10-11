import React from 'react';
import { mount, shallow } from 'enzyme';
import i18next from 'i18next';
import { MessageDialogBox } from '../src/webview/ui/components/MessageDialogBox/MessageDialogBox';

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

    // it('Should call function when default button is pressed', () => {
    //     const defaultButtonFunction = jest.fn();
    //     wrapper.find('.default-button').simulate('click');
    //     expect(defaultButtonFunction.mock.calls.length).toEqual(1);
    // });

    // it('Should call function when primary button is pressed', () => {
    //     const defaultButtonFunction = jest.fn();
    //     const primaryButtonFunction = jest.fn();
    //     let wrapper = mount(
    //         <MessageDialogBox
    //             dialogTitle={i18next.t('THANKS')}
    //             dialogText={i18next.t('THANK_YOU_TEXT')}
    //             dialogVisible={true}
    //             primaryButtonAction={defaultButtonFunction}
    //             defaultButtonAction={primaryButtonFunction}
    //             stylingClassName="solved-message-dialog"
    //         />
    //     );

    //     wrapper.find('.primary-button').first().simulate('click');
    //     expect(primaryButtonFunction.mock.calls.length).toEqual(1);
    // });

    // check if message dialog box exists - snapshot - DONE
    // are the props passed correct or do I need to import action to pass a real function - OK
    //test if functions are triggered when primary button and default button is clicked
});
