import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../types';
import { AllAnswersButton, BackButton, RestartButton } from './NavigationButtons';
import { Logo } from './Logo';
import './Header.scss';
import { SearchField } from './SearchField';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';

/**
 * Renders and returns the header section.
 *
 * @param props Props for Header component
 * @param props.showSub Show/Hide subsection of the Header
 * @param props.showNavButons Show/Hide navigation buttons
 * @param props.showLogo Show/Hide SAP logo
 * @param props.showSearch Show/Hide Search field
 * @returns - react element for header section
 */
export function Header(props: {
    showSub: boolean;
    showNavButons: boolean;
    showLogo: boolean;
    showSearch: boolean;
}): ReactElement {
    const appState = useSelector<AppState, AppState>((state) => state);
    return (
        <header>
            <div
                className="guided-answer__header"
                style={{ paddingBottom: props.showNavButons === true ? '0' : '20px' }}>
                {props.showSub === true ? (
                    <>
                        <div className="guided-answer__header__sub">
                            {!!props.showLogo && <Logo />}
                            {!!props.showSearch && <SearchField />}
                        </div>{' '}
                    </>
                ) : (
                    <></>
                )}

                {props.showNavButons === true ? (
                    <>
                        <FocusZone isCircularNavigation={true} role="grid" className="guided-answer__header">
                            <div className="guided-answer__header__allAnswersButton">
                                <AllAnswersButton />
                            </div>

                            <div className="guided-answer__header__back-restart-buttons">
                                <BackButton />
                                {appState.activeGuidedAnswerNode.length > 1 && <RestartButton />}
                            </div>
                        </FocusZone>
                    </>
                ) : (
                    <></>
                )}
            </div>
        </header>
    );
}
