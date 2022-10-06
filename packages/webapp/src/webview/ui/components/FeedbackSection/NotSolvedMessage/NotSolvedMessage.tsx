import React, { ReactElement } from 'react';
import i18next from 'i18next';
import '../../GuidedAnswerNode/GuidedAnswerNode.scss';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';

const options = [
    { link: 'https://launchpad.support.sap.com/#/expertchat/create', text: 'Start an Expert Chat' },
    { link: 'https://launchpad.support.sap.com/#/expertchat/create', text: 'Schedule an Expert' },
    { link: 'https://launchpad.support.sap.com/#/expertchat/create', text: 'Open an Incident' },
    { link: 'https://launchpad.support.sap.com/#/expertchat/create', text: 'Ask the SAP Community' }
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
                    {options.map((btn, i) => (
                        <a key={i} className="guided-answer__node__edge" href={btn.link} role="button">
                            {btn.text}
                        </a>
                    ))}
                </FocusZone>
            </div>
        </div>
    );
}
