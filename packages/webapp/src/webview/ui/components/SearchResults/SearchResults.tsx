import type { ReactElement } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
import i18next from 'i18next';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import { SpinnerSize } from '@fluentui/react';
import { UILoader } from '@sap-ux/ui-components';
import { actions } from '../../../state';
import type { AppState } from '../../../types';
import { ErrorScreen } from '../ErrorScreen';
import { SearchResultsTree } from './SearchResultsTree';
import './SearchResults.scss';

/**
 * Search results screen for Guided Answers Extension app.
 *
 * @returns - react elements for the search results
 */
export function SearchResults(): ReactElement {
    const appState = useSelector<AppState, AppState>((state) => state);

    const fetchData = () => {
        if (appState.guidedAnswerTreeSearchResult.resultSize > appState.pageSize) {
            actions.searchTree({
                query: appState.query,
                filters: {
                    product: appState.selectedProductFilters,
                    component: appState.selectedComponentFilters
                },
                paging: {
                    responseSize: appState.pageSize,
                    offset: appState.guidedAnswerTreeSearchResult.trees.length
                }
            });
        }
    };

    return appState.guidedAnswerTreeSearchResult.resultSize === 0 ? (
        <ErrorScreen title={i18next.t('NO_ANSWERS_FOUND')} subtitle={i18next.t('PLEASE_MODIFY_SEARCH')} />
    ) : (
        <FocusZone direction={FocusZoneDirection.bidirectional} isCircularNavigation={true}>
            <ul className="striped-list" role="listbox">
                <InfiniteScroll
                    dataLength={appState.guidedAnswerTreeSearchResult.trees.length} //This is important field to render the next data
                    next={fetchData}
                    loader={<UILoader id="loading-indicator" size={SpinnerSize.large} />}
                    hasMore={
                        appState.guidedAnswerTreeSearchResult.trees.length <
                        appState.guidedAnswerTreeSearchResult.resultSize
                    }>
                    {appState.guidedAnswerTreeSearchResult.trees.map((tree) => (
                        <SearchResultsTree key={`tree-item-${tree.TITLE}`} tree={tree} />
                    ))}
                </InfiniteScroll>
            </ul>
        </FocusZone>
    );
}
