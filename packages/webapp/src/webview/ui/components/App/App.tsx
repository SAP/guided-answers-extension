import type { ReactElement } from 'react';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../types';
import { actions } from '../../../state';
import { GuidedAnswerNode } from '../GuidedAnswerNode';
import { Header } from '../Header';
import { NoAnswersFound } from '../NoAnswersFound';
import { FiltersRibbon } from '../Header/Filters';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import './App.scss';
import { initIcons, UILoader } from '@sap-ux/ui-components';
import InfiniteScroll from 'react-infinite-scroll-component';
import { SpinnerSize } from '@fluentui/react';
import { RelevantNode } from '../RelevantNode';

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

    let content;
    if (appState.loading) {
        content = <UILoader id="loading-indicator" size={SpinnerSize.large} />;
    } else if (appState.activeGuidedAnswerNode.length > 0) {
        content = <GuidedAnswerNode />;
    } else if (appState.guidedAnswerTreeSearchResult.resultSize >= 0) {
        content =
            appState.guidedAnswerTreeSearchResult.resultSize === 0 ? (
                <NoAnswersFound />
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
                                        <div>
                                            <button
                                                className="guided-answer__tree"
                                                style={{ borderBottom: '1px solid var(--vscode-editorWidget-border)' }}
                                                onClick={(): void => {
                                                    actions.setActiveTree(tree);
                                                    actions.selectNode(tree.FIRST_NODE_ID);
                                                    document.body.focus();
                                                }}>
                                                <div className="guided-answer__tree__ul" style={{ width: '100%' }}>
                                                    <h3 className="guided-answer__tree__title">{tree.TITLE}</h3>
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
                                            <RelevantNode
                                                title="This is just a header1"
                                                description="This is ia description for a relevant node1"
                                            />
                                            <RelevantNode
                                                title="This is just a header2"
                                                description="This is ia description for a relevant node2"
                                            />
                                        </div>
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
