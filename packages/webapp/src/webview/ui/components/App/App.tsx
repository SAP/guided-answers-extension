import type { ReactElement } from 'react';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import { AppState } from '../../../types';
import { actions } from '../../../state';
import { GuidedAnswerNode } from '../GuidedAnswerNode';
import { Header } from '../Header';
import { NoAnswersFound } from '../NoAnswersFound';
import { FiltersRibbon } from '../Header/Filters';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import './App.scss';
import { initIcons } from '../UIComponentsLib/Icons';
import InfiniteScroll from 'react-infinite-scroll-component';

initIcons();

/**
 * Start element for Guided Answers Extension app.
 *
 * @returns - react elements for this app
 */
export function App(): ReactElement {
    const appState = useSelector<AppState, AppState>((state) => state);
    // const [currentOffset, setCurrentOffset] = useState(0);
    // console.log('EEEEE', appState.guidedAnswerTreeSearchResult.resultSize);

    const [hasMore, setHasMore] = useState(true);
    const [guidedAnswerTreeSearchResultTrees, setGuidedAnswerTreeSearchResultTrees] = useState(
        appState.guidedAnswerTreeSearchResult.trees
    );

    useEffect(() => {
        console.log('A1', guidedAnswerTreeSearchResultTrees);
        console.log('A2', appState.guidedAnswerTreeSearchResult.trees);

        setGuidedAnswerTreeSearchResultTrees([
            ...guidedAnswerTreeSearchResultTrees,
            ...appState.guidedAnswerTreeSearchResult.trees
        ]);
    }, [appState.guidedAnswerTreeSearchResult.trees]);

    let currentOffset = 0;
    const fetchData = () => {
        console.log(
            'Scroll!0',
            appState.guidedAnswerTreeSearchResult.resultSize,
            currentOffset,
            appState.guidedAnswerTreeSearchResult.resultSize >= currentOffset
        );
        currentOffset = currentOffset + 20;
        console.log(
            'Scroll!1',
            appState.guidedAnswerTreeSearchResult.resultSize,
            currentOffset,
            appState.guidedAnswerTreeSearchResult.resultSize >= currentOffset
        );
        // setCurrentOffset(offset);

        if (appState.guidedAnswerTreeSearchResult.resultSize > 20) {
            actions.searchTree({
                query: appState.query,
                filters: {
                    product: appState.selectedProductFilters,
                    component: appState.selectedComponentFilters
                },
                paging: {
                    responseSize: 20,
                    offset: currentOffset
                }
            });
            console.log(
                'Scroll!2',
                appState.guidedAnswerTreeSearchResult.resultSize,
                currentOffset,
                appState.guidedAnswerTreeSearchResult.resultSize >= currentOffset
            );
            if (appState.guidedAnswerTreeSearchResult.resultSize >= currentOffset) {
                setHasMore(true);
            } else {
                setHasMore(false);
            }
        }
    };
    let content;
    if (appState.loading) {
        content = <VSCodeProgressRing id="loading-indicator" />;
    } else if (appState.activeGuidedAnswerNode.length > 0) {
        content = <GuidedAnswerNode />;
    } else if (appState.guidedAnswerTreeSearchResult.resultSize >= 0) {
        content =
            appState.guidedAnswerTreeSearchResult.resultSize === 0 ? (
                <NoAnswersFound />
            ) : (
                <FocusZone direction={FocusZoneDirection.bidirectional} isCircularNavigation={true}>
                    <FiltersRibbon />
                    <ul className="striped-list" role="listbox">
                        <InfiniteScroll
                            dataLength={100} //This is important field to render the next data
                            next={fetchData}
                            loader={<h4>Loading...</h4>}
                            hasMore={hasMore}
                            endMessage={
                                <p style={{ textAlign: 'center' }}>
                                    <b>Yay! You have seen it all</b>
                                </p>
                            }>
                            {guidedAnswerTreeSearchResultTrees.map((tree, index) => {
                                return (
                                    <li key={`tree-item-${index}`} className="tree-item" role="option">
                                        <button
                                            className="guided-answer__tree"
                                            onClick={(): void => {
                                                actions.setActiveTree(tree);
                                                actions.selectNode(tree.FIRST_NODE_ID);
                                                document.body.focus();
                                            }}>
                                            <div className="guided-answer__tree__ul">
                                                <h3
                                                    className="guided-answer__tree__title"
                                                    style={{ marginTop: tree.DESCRIPTION ? '0' : '10px' }}>
                                                    {tree.TITLE}
                                                </h3>
                                                <div className="bottom-section">
                                                    {tree.DESCRIPTION && (
                                                        <span className="guided-answer__tree__desc">
                                                            {tree.DESCRIPTION}
                                                        </span>
                                                    )}
                                                    <div className="component-and-product-container">
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
            <main className="guided-answer__container">{content}</main>
        </div>
    );
}
