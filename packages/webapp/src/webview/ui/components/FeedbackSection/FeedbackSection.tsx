import React, { ReactElement } from 'react';
import NotSolved from './images/not-solved.svg';
import Solved from './images/solved.svg';
import i18next from 'i18next';
import { actions } from '../../../state';
import './FeedbackSection.scss';
import { SolvedMessage } from '../SolvedMessage';

/**
 * @returns - react element with the feedback section
 */
export function FeedbackSection(): ReactElement {
    return (
        <div className="feedback-container">
            <h3>{i18next.t('PLEASE_TELL_US_IF_THIS_ANSWER_WAS_HELPFUL')}</h3>
            <div className="feedback-subcontainer">
                <div
                    className="feedback-box solved-hover"
                    onClick={(): void => {
                        actions.guideFeedback(true);
                    }}>
                    <Solved />
                    <h3>{i18next.t('THIS_SOLVED_MY_ISSUE')}</h3>
                </div>
                <div
                    className="feedback-box not-solved-hover"
                    style={{ border: '2px solid var(--vscode-terminal-ansiRed)' }}
                    onClick={(): void => {
                        actions.guideFeedback(false);
                    }}>
                    <NotSolved />
                    <h3>{i18next.t('THIS_DID_NOT_SOLVED_MY_ISSUE')}</h3>
                </div>
            </div>
            <SolvedMessage />
        </div>
    );
}
