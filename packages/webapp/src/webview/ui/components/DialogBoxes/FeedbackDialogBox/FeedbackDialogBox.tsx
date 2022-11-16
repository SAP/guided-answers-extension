import React, { ReactElement, useState, useEffect, FormEvent } from 'react';
import './FeedbackDialogBox.scss';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import { TextField } from '@fluentui/react';
import { VscInfo } from 'react-icons/vsc';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../types';
import { actions } from '../../../../state';
import type { GuidedAnswerNodeId, GuidedAnswerTreeId } from '@sap/guided-answers-extension-types';
import i18next from 'i18next';

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
    const [isVisible, setVisible] = useState(feedbackStatus);
    const [feedback, setFeedback] = useState('');
    useEffect(() => {
        setVisible(feedbackStatus);
    }, [feedbackStatus]);

    const dialogContentProps = {
        type: DialogType.normal,
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
        if (newValue !== undefined) {
            setFeedback(newValue);
        }
    };

    return (
        <>
            <Dialog hidden={!isVisible} dialogContentProps={dialogContentProps} modalProps={modalProps}>
                <TextField
                    label={i18next.t('FEEDBACK_DIALOG_SUGGESTION')}
                    multiline
                    autoAdjustHeight
                    onChange={onChange}
                />
                <div className="privacy-notice">
                    <VscInfo className="info-icon" />
                    <p>{i18next.t('FEEDBACK_DIALOG_DISCLAIMER')}</p>
                </div>
                <DialogFooter>
                    <FocusZone direction={FocusZoneDirection.horizontal} className="button-container">
                        <PrimaryButton
                            className="primary-button"
                            text={i18next.t('SEND')}
                            onClick={() => {
                                actions.feedbackResponse(false);
                                actions.sendFeedbackComment({ treeId, nodeId, comment: feedback });
                                actions.feedbackStatus(false);
                            }}
                        />
                        <DefaultButton
                            className="close-button"
                            text={i18next.t('CLOSE')}
                            onClick={() => {
                                actions.feedbackStatus(false);
                            }}
                        />
                    </FocusZone>
                </DialogFooter>
            </Dialog>
        </>
    );
}
