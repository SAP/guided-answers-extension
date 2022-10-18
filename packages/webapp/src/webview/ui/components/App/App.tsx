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
import { Pagination } from '@uifabric/experiments/lib/Pagination';

initIcons();

const range = (start: number, end: number) => {
    const foo = [];
    for (let i = start; i <= end; i++) {
        foo.push(i);
    }
    return foo;
};

/**
 * Start element for Guided Answers Extension app.
 *
 * @returns - react elements for this app
 */
export function App(): ReactElement {
    const appState = useSelector<AppState, AppState>((state) => state);
    const [selectedPageIndex, setSelectedPageIndex] = useState(0);
    const [currentPageResults, setCurrentPageResults] = useState([...Array(10).keys()]);

    const _onPageChange = (index: number): void => {
        // console.log('AAAAA', index, range(index * 10, index * 10 + 9));

        setCurrentPageResults(range(index * 10, index * 10 + 9));
        setSelectedPageIndex(index);

        console.log('AAAAA', index, range(index * 10, index * 10 + 9), currentPageResults);
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
                        {appState.guidedAnswerTreeSearchResult.trees.map((tree, index) => {
                            if (currentPageResults.includes(index)) {
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
                            }
                        })}
                    </ul>
                    <Pagination
                        selectedPageIndex={selectedPageIndex}
                        pageCount={Math.ceil(appState.guidedAnswerTreeSearchResult.trees.length / 10)}
                        itemsPerPage={10}
                        totalItemCount={appState.guidedAnswerTreeSearchResult.trees.length}
                        format={'buttons'}
                        previousPageAriaLabel={'previous page'}
                        nextPageAriaLabel={'next page'}
                        firstPageAriaLabel={'first page'}
                        lastPageAriaLabel={'last page'}
                        pageAriaLabel={'page'}
                        selectedAriaLabel={'selected'}
                        onPageChange={_onPageChange}
                    />
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
