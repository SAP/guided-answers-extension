import React, { ReactElement } from 'react';
import NotSolved from './images/not-solved.svg';
import Solved from './images/solved.svg';
import i18next from 'i18next';
// import SolvedHover from './images/solved-hover.svg';
// import NotSolvedHover from './images/not-solved-hover.svg';
import './FeedbackInterface.scss';

export function FeedbackInterface(): ReactElement {
    return (
        <div className="feedback-container">
            <h3>Please tell us if this answer was helpful</h3>
            <div className="feedback-subcontainer">
                <div className="solved-issue">
                    <div className="solved-box">
                        <Solved />
                        <h3>{i18next.t('THIS_SOLVED_MY_ISSUE')}</h3>
                    </div>
                </div>
                <div className="did-not-issue">
                    <div className="not-solved-box">
                        <NotSolved />
                        <h3>{i18next.t('THIS_DID_NOT_SOLVED_MY_ISSUE')}</h3>
                    </div>
                </div>
            </div>
        </div>
    );
}
