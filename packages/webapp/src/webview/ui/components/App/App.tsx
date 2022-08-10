import type { ReactElement } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import { AppState } from '../../../types';
import { actions } from '../../../state';
import { GuidedAnswerNode } from '../GuidedAnswerNode';
import { Header } from '../Header';
import { NoAnswersFound } from '../NoAnswersFound';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import './App.scss';
import { initIcons } from '../Icons';

initIcons();

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
                    <ul className="striped-list">
                        {appState.guidedAnswerTreeSearchResult.trees.map((tree, index) => {
                            return (
                                <li key={`tree-item-${index}`} className="tree-item">
                                    <button
                                        className="guided-answer__tree"
                                        onClick={(): void => {
                                            actions.setActiveTree(tree);
                                            actions.selectNode(tree.FIRST_NODE_ID);
                                            (document.body as HTMLElement).focus();
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
                                                <div className="comonent-and-product-container">
                                                    {tree.PRODUCT && (
                                                        <div className="guided-answer__tree__product">
                                                            <span className="bottom-title"> Product: </span>
                                                            {tree.PRODUCT}
                                                        </div>
                                                    )}
                                                    {tree.COMPONENT && (
                                                        <div className="guided-answer__tree__component">
                                                            <span className="bottom-title">Component:</span>
                                                            {tree.COMPONENT}
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
