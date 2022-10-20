import React, { ReactElement } from 'react';
import i18next from 'i18next';
import '../../GuidedAnswerNode/GuidedAnswerNode.scss';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import { actions } from '../../../../state';

const options = [
    { link: 'https://launchpad.support.sap.com/#/expertchat/create', text: 'START_AN_EXPERT_CHAT' },
    { link: 'https://launchpad.support.sap.com/#/sae', text: 'SCHUEDULE_AN_EXPERT' },
    { link: 'https://launchpad.support.sap.com/#/incident/create', text: 'OPEN_AN_INCIDENT' },
    { link: 'https://answers.sap.com/index.html', text: 'ASK_THE_SAP_COMMUNITY' }
];

/**
 * @returns not solved message element
 */
export default function NotSolvedMessage(): ReactElement {
    return (
        <div id="middle" className="column">
            <h1>{i18next.t('ISSUE_IS_NOT_RESOLVED')}</h1>
            <div id="hr"></div>
            <div className="guided-answer__node__question">
                <p>
                    <strong>{i18next.t('WE_ARE_SORRY_TO_HEAR_THAT_YOUR_ISSUE_IS_NOT_YET_RESOLVED')}</strong>
                </p>
                <p style={{ fontWeight: 400 }}>
                    {i18next.t('THERE_ARE_SEVERAL_OPTIONS_FOR_GETTING_FURTHER_ASSISTANCE')}
                </p>
            </div>
            <div className="guided-answer__node">
                <FocusZone
                    direction={FocusZoneDirection.vertical}
                    className="guided-answer__node"
                    isCircularNavigation={true}>
                    {options.map((btn, i, key) => (
                        <div className="guided-answer__node" key={i}>
                            <a key={i} className="guided-answer__node__edge" href={btn.link} role="button">
                                {i18next.t(btn.text)}
                            </a>
                        </div>
                    ))}
                    <div className="guided-answer__node">
                        <button
                            className="guided-answer__node__edge"
                            onClick={(): void => {
                                actions.goToAllAnswers();
                            }}>
                            {i18next.t('SEARCH_FOR_ANOTHER_GUIDED_ANSWER')}
                        </button>
                    </div>
                </FocusZone>
            </div>
        </div>
    );
}
