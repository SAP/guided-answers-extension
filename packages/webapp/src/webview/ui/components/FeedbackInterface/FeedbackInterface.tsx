import React, { ReactElement } from 'react';
import NotSolved from './images/not-solved.svg';
import Solved from './images/solved.svg';
import i18next from 'i18next';
import { actions } from '../../../state';
import './FeedbackInterface.scss';
import { SolvedMessage } from '../SolvedMessage';

export function FeedbackInterface(): ReactElement {
    return (
        <div className="feedback-container">
            <h3>{i18next.t('PLEASE_TELL_US_IF_THIS_ANSWER_WAS_HELPFUL')}</h3>
            <div className="feedback-subcontainer">
                <div
                    className="solved-box"
                    onClick={(): void => {
                        actions.guideFeedback(true);
                    }}>
                    <Solved />
                    <h3>{i18next.t('THIS_SOLVED_MY_ISSUE')}</h3>
                </div>
                <div
                    className="not-solved-box"
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
