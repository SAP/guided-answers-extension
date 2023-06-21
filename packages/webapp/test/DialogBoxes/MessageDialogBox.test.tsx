import React from 'react';
import i18next from 'i18next';
import { MessageDialogBox } from '../../src/webview/ui/components/DialogBoxes/MessageDialogBox';
import { render, cleanup } from '@testing-library/react';
import { initI18n } from '../../src/webview/i18n';

describe('<MessageDialogBox />', () => {
    initI18n();
    afterEach(cleanup);

    it('Should render a MessageDialogBox component', () => {
        const { container } = render(
            <MessageDialogBox
                dialogTitle={i18next.t('THANKS')}
                dialogText={i18next.t('THANK_YOU_TEXT')}
                dialogVisible={true}
                primaryButtonAction={jest.fn()}
                defaultButtonAction={jest.fn()}
                stylingClassName="solved-message-dialog"
            />
        );
        expect(container).toMatchSnapshot();
    });
});
