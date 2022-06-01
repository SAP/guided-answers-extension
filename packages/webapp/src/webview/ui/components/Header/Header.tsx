import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { actions } from '../../../state';
import { AppState } from '../../../types';
import Logo from './sap-logo.svg';
import { VSCodeButton } from '@vscode/webview-ui-toolkit/react';
import './Header.scss';

/**
 * Renders and returns the header section.
 *
 * @param props
 * @param props.showNavButon
 * @param props.showLogo
 * @returns - react element for header section
 */
export function Header(props: { showNavButon: boolean; showLogo: boolean }): ReactElement {
    const appState = useSelector<AppState, AppState>((state) => state);
    const backButton =
        props.showNavButon === true ? (
            <VSCodeButton
                className="guided-answer__header__goback"
                onClick={(): void => {
                    actions.goToPreviousPage();
                }}>
                Go back
            </VSCodeButton>
        ) : (
            <></>
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
            {backButton}
        </div>
    );
}
