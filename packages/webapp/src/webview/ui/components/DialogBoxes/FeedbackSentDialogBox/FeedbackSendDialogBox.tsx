import React, { ReactElement, useState, useEffect } from 'react';
import './FeedbackSendDialogBox.scss';
import { Dialog, DialogType } from '@fluentui/react/lib/Dialog';
import i18next from 'i18next';
import { UIIcon } from '@sap-ux/ui-components';
import { UiIcons } from '../../UIComponentsLib/Icons';
import { AppState } from '../../../../types';
import { useSelector } from 'react-redux';
import { actions } from '../../../../state';

/**
 * The feedback dialog box appears that appears on api response.
 *
 * @returns the feedback send dialog box element
 */
export function FeedbackSendDialogBox(): ReactElement {
    const feedbackResponse = useSelector<AppState, boolean>((state) => state.feedbackResponse);
    const [isVisible, setVisible] = useState(feedbackResponse);
    useEffect(() => {
        setVisible(feedbackResponse);
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

    //Dialog box will transition out after being loaded
    setTimeout(() => {
        setVisible(false);
        actions.feedbackResponse(false);
    }, 2000);

    return (
        <>
            <Dialog hidden={!isVisible} dialogContentProps={dialogContentProps} modalProps={modalProps}>
                <UIIcon className="feedback-response-icon" iconName={UiIcons.Chat} />
            </Dialog>
        </>
    );
}
