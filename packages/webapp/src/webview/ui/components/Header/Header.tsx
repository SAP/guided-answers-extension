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
 * @returns - react element for header section
 */
export function Header(): ReactElement {
    const appState = useSelector<AppState, AppState>((state) => state);
    const verticalSearch = appState.betaFeatures && appState.activeScreen === 'HOME';
    return (
        <div
            className={`guided-answer__header ${verticalSearch ? 'vertical' : ''}`}
            style={{ paddingBottom: appState.activeScreen === 'NODE' ? '0' : '20px' }}>
            {appState.activeScreen === 'NODE' ? (
                <FocusZone isCircularNavigation={true} className="guided-answer__header">
                    <div className="guided-answer__header__allAnswersButton">
                        <AllAnswersButton />
                    </div>

                    <div className="guided-answer__header__back-restart-buttons">
                        <BackButton />
                        <div className="guided-answer__header__restart-feedback-buttons">
                            {appState.activeGuidedAnswerNode.length > 1 && <RestartButton />}
                            {appState.guideFeedback !== false && (
                                <>
                                    {appState.activeGuidedAnswerNode.length > 1 && (
                                        <div className="guided-answer__header__divider"></div>
                                    )}
                                    <GeneralFeedbackButton />
                                    <div className="guided-answer__header__divider"></div>
                                    <ShareButton />
                                    <div className="guided-answer__header__divider"></div>
                                    <BookmarkButton />
                                </>
                            )}
                        </div>
                    </div>

                    <div className="guided-answer__header__spacer"></div>
                </FocusZone>
            ) : (
                <div className="guided-answer__header__sub">
                    <Logo />
                    <SearchField />
                </div>
            )}
        </div>
    );
}
