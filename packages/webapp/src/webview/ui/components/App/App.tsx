import type { ReactElement } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import { VSCodeProgressRing } from '@vscode/webview-ui-toolkit/react';
import { AppState } from '../../../types';
import { actions } from '../../../state';
import { GuidedAnswerNode } from '../GuidedAnswerNode';
import { Header } from '../Header';
import { NoAnswersFound } from '../NoAnswersFound';
import './App.scss';

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
    } else if (appState.guidedAnswerTrees) {
        content =
            appState.searchResultCount === 0 ? (
                <NoAnswersFound />
            ) : (
                <ul className="striped-list">
                    {appState.guidedAnswerTrees.map((tree, index) => {
                        return (
                            <li key={`tree-item-${index}`} className="tree-item">
                                <div
                                    className="guided-answer__tree"
                                    onClick={(): void => {
                                        actions.setActiveTree(tree);
                                        actions.selectNode(tree.FIRST_NODE_ID);
                                    }}>
                                    <div className="guided-answer__tree__ul">
                                        <h3
                                            className="guided-answer__tree__title"
                                            style={{ marginTop: tree.DESCRIPTION ? '0' : '10px' }}>
                                            {tree.TITLE}
                                        </h3>
                                        {tree.DESCRIPTION && (
                                            <span className="guided-answer__tree__desc">{tree.DESCRIPTION}</span>
                                        )}
                                    </div>
                                </div>
                            </li>
                        );
                    })}
                </ul>
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
