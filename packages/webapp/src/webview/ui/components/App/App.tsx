import type { ReactElement } from 'react';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { AppState } from '../../../types';
import { actions } from '../../../state';
import { GuidedAnswerNode } from '../GuidedAnswerNode';
import { Header } from '../Header';
import { ErrorScreen } from '../ErrorScreen';
import { FiltersRibbon } from '../Header/Filters';
import { initIcons, UILoader } from '@sap-ux/ui-components';
import { SpinnerSize } from '@fluentui/react';
import i18next from 'i18next';
import { HomeGrid } from '../HomeGrid';
import { SearchResults } from '../SearchResults';
import './App.scss';

initIcons();

/**
 * Start element for Guided Answers Extension app.
 *
 * @returns - react elements for this app
 */
export function App(): ReactElement {
    const appState = useSelector<AppState, AppState>((state) => state);
    useEffect(() => {
        const resultsContainer = document.getElementById('results-container');
        if (!resultsContainer) {
            return undefined;
        }
        //tree-item element height is ~100px, using 50px here to be on the safe side.
        const setPageSizeByContainerHeight = (pxHeight: number): void => {
            actions.setPageSize(Math.ceil(pxHeight / 50));
        };
        const resizeObserver = new ResizeObserver((entries: ResizeObserverEntry[]) => {
            const containerEntry = entries.find((entry) => entry?.target?.id === 'results-container');
            if (containerEntry) {
                setPageSizeByContainerHeight(containerEntry.contentRect.height);
            }
        });
        // Set initial page size
        setPageSizeByContainerHeight(resultsContainer.clientHeight);
        resizeObserver.observe(resultsContainer);
        return () => {
            if (resizeObserver) {
                resizeObserver.unobserve(resultsContainer);
            }
        };
    }, []);

    let content;
    if (appState.networkStatus === 'LOADING') {
        content = <UILoader id="loading-indicator" size={SpinnerSize.large} />;
    } else if (appState.networkStatus === 'ERROR') {
        content = <ErrorScreen title={i18next.t('GUIDED_ANSWERS_UNAVAILABLE')} subtitle={i18next.t('TRY_LATER')} />;
    } else if (appState.activeScreen === 'NODE') {
        content = <GuidedAnswerNode />;
    } else if (appState.activeScreen === 'HOME') {
        content = <HomeGrid />;
    } else {
        content = <SearchResults />;
    }
    return (
        <div className="guided-answer">
            <Header />

            {appState.activeScreen === 'SEARCH' && <FiltersRibbon />}

            <main className="guided-answer__container" id="results-container">
                {content}
            </main>
        </div>
    );
}
