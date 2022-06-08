import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../types';
import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { actions } from '../../../state';
import { AllAnswersButton, BackButton, RestartButton } from './NavigationButtons';
import i18next from 'i18next';
import Logo from './sap-logo.svg';
import './Header.scss';

let timer: NodeJS.Timeout;

/**
 * Renders and returns the header section.
 *
 * @param props Props for Header component
 * @param props.showNavButons Show/Hide navigation buttons
 * @param props.showLogo Show/Hide SAP logo
 * @param props.showSearch Show/Hide Search field
 * @returns - react element for header section
 */
export function Header(props: { showNavButons: boolean; showLogo: boolean; showSearch: boolean }): ReactElement {
    const appState = useSelector<AppState, AppState>((state) => state);
    return (
        <div className="guided-answer__header">
            {props.showLogo === true ? (
                <div className="guided-answer__header__sub">
                    <div className="guided-answer__header__logoAndTitle">
                        <span id="sap-logo">
                            <Logo />
                        </span>
                        <h1 className="guided-answer__header__title">{i18next.t('GUIDED_ANSWERS')}</h1>
                    </div>
                    {props.showSearch === true ? (
                        <div className="guided-answer__header__searchField">
                            <VSCodeTextField
                                className="tree-search-field"
                                value={appState.query}
                                placeholder="Search Guided Answers"
                                onInput={(e: any) => {
                                    console.log(`Value changed`, e);
                                    const newValue = e?.target?.value;
                                    if (newValue !== undefined) {
                                        clearTimeout(timer);
                                        actions.setQueryValue(newValue);
                                        timer = setTimeout(() => {
                                            actions.searchTree(newValue);
                                        }, 400);
                                    }
                                }}></VSCodeTextField>
                        </div>
                    ) : (
                        ''
                    )}
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
