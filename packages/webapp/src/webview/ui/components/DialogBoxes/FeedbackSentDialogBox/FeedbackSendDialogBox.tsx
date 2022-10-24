import React, { ReactElement, useState, useEffect } from 'react';
import './FeedbackSendDialogBox.scss';
import { Dialog, DialogType } from '@fluentui/react/lib/Dialog';
// import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
// import i18next from 'i18next';
// import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import { VscRefresh } from 'react-icons/vsc';

/**
 *
 */
export function FeedbackSendDialogBox(props: { dialogVisible: boolean }): ReactElement {
    const [isVisible, setVisible] = useState(props.dialogVisible);
    useEffect(() => {
        setVisible(props.dialogVisible);
    }, [props.dialogVisible]);

    const dialogContentProps = {
        type: DialogType.normal,
        title: 'Message Sent',
        subText: 'Thanks for the feedback!'
    };

    const modalProps = {
        isDarkOverlay: true,
        className: `feedbackSentDialogBox`
    };

    console.log('feedback send dialog visible');

    setTimeout(() => {
        setVisible(false);
    }, 10000);

    return (
        <>
            <Dialog hidden={isVisible} dialogContentProps={dialogContentProps} modalProps={modalProps}>
                <VscRefresh />
            </Dialog>
        </>
    );
}
