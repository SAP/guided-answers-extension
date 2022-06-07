import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../types';
import { AllAnswersButton, BackButton, RestartButton } from './NavigationButtons';
import i18next from 'i18next';
import Logo from './sap-logo.svg';
import './Header.scss';

/**
 * Renders and returns the header section.
 *
 * @param props
 * @param props.showNavButons
 * @param props.showLogo
 * @returns - react element for header section
 */
export function Header(props: { showNavButons: boolean; showLogo: boolean }): ReactElement {
    const appState = useSelector<AppState, AppState>((state) => state);
    return (
        <div className="guided-answer__header">
            {props.showLogo === true ? (
                <div className="guided-answer__header__sub">
                    <span id="sap-logo">
                        <Logo />
                    </span>
                    <h1 className="guided-answer__header__title">{i18next.t('GUIDED_ANSWERS')}</h1>
                    <span className="guided-answer__header__subtitle">
                        {appState.activeGuidedAnswer ? ': ' + appState.activeGuidedAnswer.TITLE : ''}
                    </span>
                </div>
            ) : (
                ''
            )}
            {props.showNavButons === true ? (
                <>
                    <div className="guided-answer__header__allAnswersButton">
                        <AllAnswersButton />
                    </div>
                    {appState.activeGuidedAnswerNode.length > 1 && (
                        <div className="guided-answer__header__back-restart-buttons">
                            <BackButton />
                            <RestartButton />
                        </div>
                    )}
                </>
            ) : (
                <></>
            )}
        </div>
    );
}
