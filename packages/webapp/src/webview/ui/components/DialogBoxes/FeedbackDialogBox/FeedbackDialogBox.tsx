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

export function FeedbackDialogBox(props: {}): ReactElement {
    const treeId = useSelector<AppState, GuidedAnswerTreeId>((state) => state.activeGuidedAnswer!.TREE_ID);
    const nodeId = useSelector<AppState, GuidedAnswerNodeId>((state) => state.activeGuidedAnswerNode[0].NODE_ID);
    const feedbackStatus = useSelector<AppState, boolean>((state) => state.feedbackStatus);
    const [isVisible, setVisible] = useState(feedbackStatus);
    const [feedback, setFeedback] = useState('');
    useEffect(() => {
        setVisible(feedbackStatus);
    }, [feedbackStatus]);

    const dialogContentProps = {
        type: DialogType.normal,
        title: 'Is this content helpful?',
        subText: 'If you have suggestions on how to improve this content we would love to hear them!'
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
                <TextField label="Your Suggestion" multiline autoAdjustHeight onChange={onChange} />
                <div className="privacy-notice">
                    <VscInfo className="info-icon" />
                    <p>Your feedback is anonymous, we do not collect any personal data.</p>
                </div>
                <DialogFooter>
                    <FocusZone direction={FocusZoneDirection.horizontal} className="button-container">
                        <PrimaryButton
                            className="primary-button"
                            text={'Send'}
                            onClick={() => {
                                actions.sendFeedbackComment({ treeId, nodeId, comment: feedback });
                                actions.feedbackStatus(false);
                            }}
                        />
                        <DefaultButton
                            className="default-button"
                            text={'Close'}
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
