import React, { ReactElement, useState, useEffect } from 'react';
import './FeedbackSendDialogBox.scss';
import { Dialog, DialogType } from '@fluentui/react/lib/Dialog';
// import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
// import i18next from 'i18next';
// import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import { VscRefresh } from 'react-icons/vsc';
import { AppState } from '../../../../types';
import { useSelector } from 'react-redux';

/**
 *
 */
export function FeedbackSendDialogBox(): ReactElement {
    const feedbackResponse = useSelector<AppState, boolean>((state) => state.feedbackStatus);
    const [isVisible, setVisible] = useState(feedbackResponse);
    useEffect(() => {
        setVisible(feedbackResponse);
    }, [feedbackResponse]);

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

    //Dialog box will transition out after being loaded
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
