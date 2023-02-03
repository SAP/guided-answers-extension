import React, { ReactElement, useState, useEffect, FormEvent, useCallback } from 'react';
import './FeedbackDialogBox.scss';
import { DialogFooter } from '@fluentui/react/lib/Dialog';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import { VscInfo } from 'react-icons/vsc';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../types';
import { actions } from '../../../../state';
import type { GuidedAnswerNodeId, GuidedAnswerTreeId } from '@sap/guided-answers-extension-types';
import i18next from 'i18next';
import { UIDefaultButton, UIDialog, UITextInput } from '@sap-ux/ui-components';

/**
 * The feedback dialog box for submitting comments.
 *
 * @returns the feedback dialog box element
 */
export function FeedbackDialogBox(): ReactElement {
    const treeId = useSelector<AppState, GuidedAnswerTreeId>((state) => state.activeGuidedAnswer!.TREE_ID);
    const nodeId = useSelector<AppState, GuidedAnswerNodeId>(
        (state) => state.activeGuidedAnswerNode[state.activeGuidedAnswerNode.length - 1].NODE_ID
    );
    const feedbackStatus = useSelector<AppState, boolean>((state) => state.feedbackStatus);
    const container = document.querySelector('.feedback-section-dialog');
    const [isVisible, setVisible] = useState(feedbackStatus);
    const [feedback, setFeedback] = useState('');
    const [textFieldhasValue, setTextFieldhasValue] = useState(true);

    useEffect(() => {
        setVisible(feedbackStatus);
        if (feedbackStatus === false) {
            container?.classList.toggle('.dialog-exit');
        }
    }, [feedbackStatus]);

    const dialogContentProps = {
        title: i18next.t('FEEDBACK_DIALOG_TITLE'),
        subText: i18next.t('FEEDBACK_DIALOG_SUBTEXT')
    };

    const modalProps = {
        isDarkOverlay: true,
        className: `feedback-section-dialog`
    };

    const onChange = (
        event: FormEvent<HTMLInputElement | HTMLTextAreaElement>,
        newValue?: string | undefined
    ): void => {
        if (newValue !== undefined && newValue !== '') {
            setFeedback(newValue);
            setTextFieldhasValue(false);
        } else {
            setTextFieldhasValue(true);
        }
    };

    return (
        <>
            <UIDialog modalProps={modalProps} isOpen={isVisible} title={dialogContentProps.title}>
                <p className="ms-Dialog-subText">{i18next.t('FEEDBACK_DIALOG_SUBTEXT')}</p>
                <UITextInput
                    id="feedbackDialogTextArea"
                    label={i18next.t('FEEDBACK_DIALOG_SUGGESTION')}
                    multiline
                    style={{ height: '85px' }}
                    onChange={onChange}
                />
                <div className="privacy-notice">
                    <VscInfo className="info-icon" />
                    <p>{i18next.t('FEEDBACK_DIALOG_DISCLAIMER')}</p>
                </div>
                <DialogFooter>
                    <FocusZone direction={FocusZoneDirection.horizontal} className="button-container">
                        <UIDefaultButton
                            primary
                            text={i18next.t('SEND')}
                            disabled={textFieldhasValue}
                            id="sendFeedbackBtn"
                            onClick={() => {
                                actions.feedbackResponse(false);
                                actions.sendFeedbackComment({ treeId, nodeId, comment: feedback });
                                actions.feedbackStatus(false);
                            }}
                        />
                        <UIDefaultButton
                            text={i18next.t('CLOSE')}
                            id="closeDialogBtn"
                            onClick={() => {
                                actions.feedbackStatus(false);
                            }}
                        />
                    </FocusZone>
                </DialogFooter>
            </UIDialog>
        </>
    );
}
