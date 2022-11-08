import React, { ReactElement, useState, useEffect } from 'react';
import './FeedbackSendDialogBox.scss';
import { Dialog, DialogType } from '@fluentui/react/lib/Dialog';
// import i18next from 'i18next';
// import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import { VscRefresh } from 'react-icons/vsc';
import { AppState } from '../../../../types';
import { useSelector } from 'react-redux';

/**
 *
 */
export function FeedbackSendDialogBox(): ReactElement {
    const feedbackResponse = useSelector<AppState, boolean>((state) => state.feedbackResponse);
    const [isVisible, setVisible] = useState(feedbackResponse);
    useEffect(() => {
        setVisible(feedbackResponse);
    }, [feedbackResponse]);

    const dialogContentProps = {
        type: DialogType.normal,
        title: 'Message sent',
        subText: 'Thanks for the feedback!'
    };

    const modalProps = {
        isDarkOverlay: true,
        className: `feedback-sent-dialog-box`
    };

    //Dialog box will transition out after being loaded
    setTimeout(() => {
        setVisible(false);
    }, 5000);

    return (
        <>
            <Dialog hidden={!isVisible} dialogContentProps={dialogContentProps} modalProps={modalProps}>
                <svg
                    className="feedback-response-icon"
                    viewBox="0 0 16 16"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 10H6V9H4.58578L3 10.5858V9H1V1H12V5H13V0H0V10H2V13L5 10Z" fill="#C5C5C5" />
                    <path
                        fill-rule="evenodd"
                        clip-rule="evenodd"
                        d="M16 6V13H14V16L11 13H7V6H16ZM13 12V13.5858L11.4142 12H8V7H15V12H13Z"
                        fill="#C5C5C5"
                    />
                </svg>
            </Dialog>
        </>
    );
}
