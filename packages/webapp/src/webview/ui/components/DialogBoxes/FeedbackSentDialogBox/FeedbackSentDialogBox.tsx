import React, { ReactElement, useState, useEffect } from 'react';
import './FeedbackSendDialogBox.scss';
import { DialogType } from '@fluentui/react/lib/Dialog';
import i18next from 'i18next';
import { UIIcon, UiIcons, UIDialog } from '@sap-ux/ui-components';
import { AppState } from '../../../../types';
import { useSelector } from 'react-redux';
import { actions } from '../../../../state';

/**
 * The feedback dialog box appears that appears on api response.
 *
 * @returns the feedback send dialog box element
 */
export function FeedbackSentDialogBox(): ReactElement {
    const feedbackResponse = useSelector<AppState, boolean>((state) => state.feedbackResponse);
    const [isVisible, setVisible] = useState(feedbackResponse);
    useEffect(() => {
        setVisible(feedbackResponse);

        //Dialog box will transition out after being loaded
        const timer = setTimeout(() => {
            setVisible(false);
            actions.feedbackResponse(false);
        }, 4000);
        return () => {
            clearTimeout(timer);
        };
    }, [feedbackResponse]);

    const dialogContentProps = {
        type: DialogType.normal,
        title: i18next.t('FEEDBACK_SENT_DIALOG_TITLE'),
        subText: i18next.t('FEEDBACK_SENT_DIALOG_SUBTEXT')
    };

    const modalProps = {
        isDarkOverlay: true,
        className: `feedback-sent-dialog-box`
    };

    return (
        <>
            <UIDialog hidden={!isVisible} dialogContentProps={dialogContentProps} modalProps={modalProps}>
                <UIIcon className="feedback-response-icon" iconName={UiIcons.MessageSent} />
            </UIDialog>
        </>
    );
}
