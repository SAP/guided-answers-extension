import React from 'react';
import type { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import type { AppState } from '../../../types';
import {
    AllAnswersButton,
    BackButton,
    GeneralFeedbackButton,
    RestartButton,
    ShareButton,
    BookmarkButton
} from './NavigationButtons';
import { Logo } from './Logo';
import './Header.scss';
import { SearchField } from './SearchField';
import { FocusZone } from '@fluentui/react-focus';

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
    const verticalSearch = appState.betaFeatures && appState.isHome;
    return (
        <div
            className={`guided-answer__header ${verticalSearch ? 'vertical' : ''}`}
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
                    <FocusZone isCircularNavigation={true} className="guided-answer__header">
                        <div className="guided-answer__header__allAnswersButton">
                            <AllAnswersButton />
                        </div>

                        <div className="guided-answer__header__back-restart-buttons">
                            <BackButton />
                            <div className="guided-answer__header__restart-feedback-buttons">
                                {appState.activeGuidedAnswerNode.length > 1 && <RestartButton />}
                                {appState.guideFeedback !== false ? (
                                    <>
                                        {appState.activeGuidedAnswerNode.length > 1 && (
                                            <div className="guided-answer__header__divider"></div>
                                        )}
                                        <GeneralFeedbackButton />
                                        <>
                                            <div className="guided-answer__header__divider"></div>
                                            <ShareButton />
                                        </>
                                        <>
                                            <div className="guided-answer__header__divider"></div>
                                            <BookmarkButton />
                                        </>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>

                        <div className="guided-answer__header__spacer"></div>
                    </FocusZone>
                </>
            ) : (
                <></>
            )}
        </div>
    );
}
