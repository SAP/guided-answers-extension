import type { ReactElement } from 'react';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import i18next from 'i18next';

import InfiniteScroll from 'react-infinite-scroll-component';
import { SpinnerSize } from '@fluentui/react';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import { initIcons, UILoader, UIIcon, UiIcons } from '@sap-ux/ui-components';

import type { AppState } from '../../../types';
import { actions } from '../../../state';

import { GuidedAnswerNode } from '../GuidedAnswerNode';
import { Header } from '../Header';
import { ErrorScreen } from '../ErrorScreen';
import { FiltersRibbon } from '../Header/Filters';
import { TreeItemBottomSection } from '../TreeItemBottomSection';
import { HomeGrid } from '../HomeGrid';

import './App.scss';

initIcons();

/**
 * Start element for Guided Answers Extension app.
 *
 * @returns - react elements for this app
 */
export function App(): ReactElement {
    const appState = useSelector<AppState, AppState>((state) => state);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => {
        const resultsContainer = document.getElementById('results-container');
        if (!resultsContainer) {
            return undefined;
        }
        // tree-item element height is ~100px, using 50px here to be on the safe side. Header uses ~300,  minimum page size is 5.
        const setPageSizeByContainerHeight = (pxHeight: number): void => {
            actions.setPageSize(Math.max(5, Math.ceil((pxHeight - 300) / 50)));
        };

        window.onresize = () => {
            setPageSizeByContainerHeight(window.innerHeight);
        };
        setPageSizeByContainerHeight(window.innerHeight);
        return undefined;
    }, []);

    useEffect(() => {
        const isMore =
            appState.guidedAnswerTreeSearchResult.trees.length < appState.guidedAnswerTreeSearchResult.resultSize;
        setHasMore(isMore);
    }, [appState.guidedAnswerTreeSearchResult.trees]);

    function fetchData() {
        if (hasMore) {
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
    }

    /**
     * Check if a tree is bookmarked.
     *
     * @param treeId - id of the tree
     * @param treeId.toString - id a string
     * @returns boolean
     */
    function isBookmark(treeId: { toString: () => string }): boolean {
        return !!Object.keys(appState.bookmarks).find((bookmarkKey) => bookmarkKey.startsWith(`${treeId}-`));
    }

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
        content =
            appState.guidedAnswerTreeSearchResult.resultSize === 0 ? (
                <ErrorScreen title={i18next.t('NO_ANSWERS_FOUND')} subtitle={i18next.t('PLEASE_MODIFY_SEARCH')} />
            ) : (
                <FocusZone direction={FocusZoneDirection.bidirectional} isCircularNavigation={true}>
                    <ul className="striped-list">
                        <InfiniteScroll
                            dataLength={appState.guidedAnswerTreeSearchResult.trees.length} //This is important field to render the next data
                            next={fetchData}
                            loader={<UILoader id="loading-indicator" size={SpinnerSize.large} />}
                            hasMore={hasMore}>
                            {appState.guidedAnswerTreeSearchResult.trees.map((tree) => {
                                return (
                                    <li key={`tree-item-${tree.TITLE}`} className="tree-item">
                                        <button
                                            className="guided-answer__tree"
                                            onClick={(): void => {
                                                actions.setActiveTree(tree);
                                                actions.selectNode(tree.FIRST_NODE_ID);
                                                document.body.focus();
                                            }}>
                                            <div className="guided-answer__tree__ul">
                                                <h3 className="guided-answer__tree__title">
                                                    {isBookmark(tree.TREE_ID) ? (
                                                        <UIIcon iconName={UiIcons.StarActive} />
                                                    ) : (
                                                        ''
                                                    )}{' '}
                                                    {tree.TITLE}
                                                </h3>
                                                <TreeItemBottomSection
                                                    description={tree.DESCRIPTION}
                                                    product={tree.PRODUCT}
                                                    component={tree.COMPONENT}
                                                />
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                        </InfiniteScroll>
                    </ul>
                </FocusZone>
            );
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
