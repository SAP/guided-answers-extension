import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import NotSolved from './images/not-solved.svg';
import Solved from './images/solved.svg';
import i18next from 'i18next';
import { actions } from '../../../state';
import './FeedbackSection.scss';
import { MessageDialogBox } from '../DialogBoxes/MessageDialogBox';
import type { AppState } from '../../../types';
import type { GuidedAnswerNodeId, GuidedAnswerTreeId } from '@sap/guided-answers-extension-types';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';

/**
 * @returns - react element with the feedback section
 */
export function FeedbackSection(): ReactElement {
    const treeId = useSelector<AppState, GuidedAnswerTreeId>((state) => state.activeGuidedAnswer!.TREE_ID);
    const nodeId = useSelector<AppState, GuidedAnswerNodeId>((state) => state.activeGuidedAnswerNode[0].NODE_ID);
    let guideFeedback = useSelector<AppState, boolean | null>((state) => state.guideFeedback);
    return (
        <div className="feedback-container">
            <h3>{i18next.t('PLEASE_TELL_US_IF_THIS_ANSWER_WAS_HELPFUL')}</h3>
            <FocusZone direction={FocusZoneDirection.horizontal} className="feedback-subcontainer" role="tree">
                <button
                    className="feedback-box solved-hover"
                    onClick={(): void => {
                        actions.guideFeedback(true);
                        actions.sendFeedbackOutcome({ treeId, nodeId, solved: true });
                    }}>
                    <Solved />
                    <h3>{i18next.t('THIS_SOLVED_MY_ISSUE')}</h3>
                </button>
                <button
                    className="feedback-box not-solved-hover"
                    style={{ border: '2px solid var(--vscode-terminal-ansiRed)' }}
                    onClick={(): void => {
                        actions.guideFeedback(false);
                        actions.sendFeedbackOutcome({ treeId, nodeId, solved: false });
                    }}>
                    <NotSolved />
                    <h3>{i18next.t('THIS_DID_NOT_SOLVED_MY_ISSUE')}</h3>
                </button>
            </FocusZone>
            <MessageDialogBox
                dialogTitle={i18next.t('THANKS')}
                dialogText={i18next.t('THANK_YOU_TEXT')}
                dialogVisible={guideFeedback === true ? true : false}
                primaryButtonAction={() => actions.goToAllAnswers()}
                defaultButtonAction={() => actions.guideFeedback(null)}
                stylingClassName="solved-message-dialog"
            />
        </div>
    );
}
