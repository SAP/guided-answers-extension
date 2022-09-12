import type { ReactElement } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import { AppState } from '../../../types';
import type { GuidedAnswerTreeSearchHit } from '@sap/guided-answers-extension-types';
import { actions } from '../../../state';
import { GuidedAnswerNode } from '../GuidedAnswerNode';
import { Header } from '../Header';
import { NoAnswersFound } from '../NoAnswersFound';
import { FiltersRibbon } from '../Header/Filters';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import './App.scss';
import { initIcons } from '../UIComponentsLib/Icons';

initIcons();

/**
 * Filters the query results based on the selected filters.
 *
 * @param trees - results passed from global state
 * @param selectedProductFilters - selected product filters
 * @param selectedComponentFilters - selected component filters
 * @returns - returns a filtered list if filters have been selected
 */
const filterResults = (
    trees: GuidedAnswerTreeSearchHit[],
    selectedProductFilters: string[],
    selectedComponentFilters: string[]
) => {
    let filteredTrees = trees;
    if (selectedProductFilters.length > 0) {
        filteredTrees = (selectedComponentFilters.length > 0 ? filteredTrees : trees).filter((t) =>
            selectedProductFilters.some((f) => t.PRODUCT && t.PRODUCT.includes(f))
        );
    }

    if (selectedComponentFilters.length > 0) {
        filteredTrees = (selectedProductFilters.length > 0 ? filteredTrees : trees).filter((t) =>
            selectedComponentFilters.some((f) => t.COMPONENT && t.COMPONENT.includes(f))
        );
    }
    return filteredTrees;
};

/**
 * Start element for Guided Answers Extension app.
 *
 * @returns - react elements for this app
 */
export function App(): ReactElement {
    const appState = useSelector<AppState, AppState>((state) => state);

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
                        {filterResults(
                            appState.guidedAnswerTreeSearchResult.trees,
                            appState.selectedProductFilters,
                            appState.selectedComponentFilters
                        ).map((tree, index) => {
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
