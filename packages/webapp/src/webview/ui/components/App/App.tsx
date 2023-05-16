import type { ReactElement } from 'react';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../types';
import { actions } from '../../../state';
import { GuidedAnswerNode } from '../GuidedAnswerNode';
import { Header } from '../Header';
import { ErrorScreen } from '../ErrorScreen';
import { FiltersRibbon } from '../Header/Filters';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import './App.scss';
import { initIcons, UILoader } from '@sap-ux/ui-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SpinnerSize } from '@fluentui/react';
import i18next from 'i18next';
import { VscStarFull } from 'react-icons/vsc';
import type { BookmarkPayload } from '@sap/guided-answers-extension-types';

initIcons();

/**
 * Start element for Guided Answers Extension app.
 *
 * @returns - react elements for this app
 */
export function App(): ReactElement {
    const appState = useSelector<AppState, AppState>((state) => state);
    const bookmarks = useSelector<AppState, BookmarkPayload[]>((state) => state.bookmarks);
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

    useEffect(() => {
        console.log('Bookmarks on init:', bookmarks);
    }, [bookmarks]);

    function fetchData() {
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
    }

    /**
     *
     * @param treeId
     * @param treeId.toString
     * @returns boolean
     */
    function isBookmark(treeId: { toString: () => string }): boolean {
        return appState.bookmarks.some(
            (bookmark: BookmarkPayload) => bookmark.activeGuidedAnswer?.TREE_ID === treeId && bookmark.status !== false
        );
    }

    let content;
    if (appState.networkStatus === 'LOADING') {
        content = <UILoader id="loading-indicator" size={SpinnerSize.large} />;
    } else if (appState.networkStatus === 'ERROR') {
        content = <ErrorScreen title={i18next.t('GUIDED_ANSWERS_UNAVAILABLE')} subtitle={i18next.t('TRY_LATER')} />;
    } else if (appState.activeGuidedAnswerNode.length > 0) {
        content = <GuidedAnswerNode />;
    } else if (
        bookmarks &&
        bookmarks.length > 0 &&
        appState.guidedAnswerTreeSearchResult.resultSize === -1 &&
        appState.query === '' &&
        bookmarks.some((bookmark) => bookmark.status !== false)
    ) {
        content = (
            <div>
                <h3>
                    <VscStarFull className="bookmark-icon-bookmarked" /> Bookmarks
                </h3>
                <FocusZone direction={FocusZoneDirection.bidirectional} isCircularNavigation={true}>
                    <ul className="striped-list-bookmarks" role="listbox">
                        {bookmarks
                            .filter((bookmark: BookmarkPayload) => bookmark.status !== false)
                            .map((bookmark: BookmarkPayload) => {
                                return (
                                    <li
                                        key={`tree-item-${bookmark.activeGuidedAnswerNode?.NODE_ID}`}
                                        className="tree-item"
                                        role="option">
                                        <button
                                            className="guided-answer__tree"
                                            onClick={(): void => {
                                                //@ts-ignore
                                                actions.setActiveTree(bookmark.activeGuidedAnswer);
                                                //@ts-ignore
                                                actions.selectNode(bookmark.activeGuidedAnswerNode.NODE_ID);
                                                document.body.focus();
                                            }}>
                                            <div className="guided-answer__tree__ul">
                                                <h3 className="guided-answer__tree__title">
                                                    {bookmark.activeGuidedAnswer?.TITLE}{' '}
                                                    {bookmark.activeGuidedAnswerNode?.NODE_ID ===
                                                    bookmark.activeGuidedAnswer?.FIRST_NODE_ID
                                                        ? ''
                                                        : `- ${bookmark.activeGuidedAnswerNode?.TITLE}`}
                                                </h3>
                                                <div className="bottom-section">
                                                    {bookmark.activeGuidedAnswer?.DESCRIPTION && (
                                                        <span className="guided-answer__tree__desc">
                                                            {bookmark.activeGuidedAnswer?.DESCRIPTION}
                                                        </span>
                                                    )}
                                                    <div
                                                        className="component-and-product-container"
                                                        style={{
                                                            marginTop: bookmark.activeGuidedAnswer?.DESCRIPTION
                                                                ? '10px'
                                                                : '0'
                                                        }}>
                                                        {bookmark.activeGuidedAnswer?.PRODUCT && (
                                                            <div className="guided-answer__tree__product">
                                                                <span className="bottom-title">Product: </span>
                                                                {bookmark.activeGuidedAnswer?.PRODUCT.split(
                                                                    ','
                                                                )[0].trim()}
                                                            </div>
                                                        )}
                                                        {bookmark.activeGuidedAnswer?.COMPONENT && (
                                                            <div className="guided-answer__tree__component">
                                                                <span className="bottom-title">Component: </span>
                                                                {bookmark.activeGuidedAnswer?.COMPONENT.split(
                                                                    ','
                                                                )[0].trim()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    </li>
                                );
                            })}
                    </ul>
                </FocusZone>
            </div>
        );
    } else if (appState.guidedAnswerTreeSearchResult.resultSize >= 0) {
        content =
            appState.guidedAnswerTreeSearchResult.resultSize === 0 ? (
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
                            {appState.guidedAnswerTreeSearchResult.trees.map((tree) => {
                                return (
                                    <li key={`tree-item-${tree.TITLE}`} className="tree-item" role="option">
                                        <button
                                            className="guided-answer__tree"
                                            onClick={(): void => {
                                                //@ts-ignore
                                                actions.setActiveTree(tree);
                                                actions.selectNode(tree.FIRST_NODE_ID);
                                                document.body.focus();
                                            }}>
                                            <div className="guided-answer__tree__ul">
                                                <h3 className="guided-answer__tree__title">
                                                    {isBookmark(tree.TREE_ID) ? (
                                                        <VscStarFull className="bookmark-icon-bookmarked" />
                                                    ) : (
                                                        ''
                                                    )}{' '}
                                                    {tree.TITLE}
                                                </h3>
                                                <div className="bottom-section">
                                                    {tree.DESCRIPTION && (
                                                        <span className="guided-answer__tree__desc">
                                                            {tree.DESCRIPTION}
                                                        </span>
                                                    )}
                                                    <div
                                                        className="component-and-product-container"
                                                        style={{ marginTop: tree.DESCRIPTION ? '10px' : '0' }}>
                                                        {tree.PRODUCT && (
                                                            <div className="guided-answer__tree__product">
                                                                <span className="bottom-title">Product: </span>
                                                                {tree.PRODUCT.split(',')[0].trim()}
                                                            </div>
                                                        )}
                                                        {tree.COMPONENT && (
                                                            <div className="guided-answer__tree__component">
                                                                <span className="bottom-title">Component: </span>
                                                                {tree.COMPONENT.split(',')[0].trim()}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
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
            <Header
                showSub={appState.activeGuidedAnswerNode.length === 0}
                showLogo={appState.activeGuidedAnswerNode.length === 0}
                showNavButons={appState.activeGuidedAnswerNode.length !== 0}
                showSearch={appState.activeGuidedAnswerNode.length === 0}
            />

            {appState.guidedAnswerTreeSearchResult.resultSize > 0 && appState.activeGuidedAnswerNode.length === 0 ? (
                <FiltersRibbon />
            ) : null}

            <main className="guided-answer__container" id="results-container">
                {content}
            </main>
        </div>
    );
}
