import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { actions } from '../../../state';
import { AppState } from '../../../types';
import { VscHome, VscArrowSmallLeft, VscRefresh, VscArrowLeft } from 'react-icons/vsc';
import Logo from './sap-logo.svg';
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
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
                <span className="guided-answer__header__navButtons__content">All answers</span>
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
            <span className="guided-answer__header__navButtons__content">Step back</span>
        </div>
    );

    const restartButton = (
        <div
            className="guided-answer__header__navButtons"
            onClick={(): void => {
                actions.restartAnswer();
            }}>
            <VscRefresh className="guided-answer__header__navButtons__content" />
            <span className="guided-answer__header__navButtons__content">Restart</span>
        </div>
    );
    return (
        <div className="guided-answer__header">
            {props.showLogo === true ? (
                <div className="guided-answer__header__sub">
                    <span id="sap-logo">
                        <Logo />
                    </span>
                    <h1 className="guided-answer__header__title">Guided Answers</h1>
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
