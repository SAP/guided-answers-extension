import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { actions } from '../../../state';
import { AppState } from '../../../types';
import i18next from 'i18next';
import { VscHome, VscRefresh, VscArrowLeft } from 'react-icons/vsc';
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
    const allAnswersButton = (
        <>
            <div
                className="guided-answer__header__navButtons"
                onClick={(): void => {
                    actions.goToAllAnswers();
                }}>
                <VscHome className="guided-answer__header__navButtons__content" />{' '}
                <span className="guided-answer__header__navButtons__content">{i18next.t('ALL_ANSWERS')}</span>
            </div>
        </>
    );
    const backButton = (
        <div
            className="guided-answer__header__navButtons"
            onClick={(): void => {
                actions.goToPreviousPage();
            }}>
            <VscArrowLeft className="guided-answer__header__navButtons__content" />
            <span className="guided-answer__header__navButtons__content">{i18next.t('STEP_BACK')}</span>
        </div>
    );

    const restartButton = (
        <div
            className="guided-answer__header__navButtons"
            onClick={(): void => {
                actions.restartAnswer();
            }}>
            <VscRefresh className="guided-answer__header__navButtons__content" />
            <span className="guided-answer__header__navButtons__content">{i18next.t('RESTART')}</span>
        </div>
    );
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
                    <div className="guided-answer__header__allAnswersButton">{allAnswersButton}</div>
                    {appState.activeGuidedAnswerNode.length > 1 && (
                        <div className="guided-answer__header__back-restart-buttons">
                            {backButton}
                            {restartButton}
                        </div>
                    )}
                </>
            ) : (
                <></>
            )}
        </div>
    );
}
