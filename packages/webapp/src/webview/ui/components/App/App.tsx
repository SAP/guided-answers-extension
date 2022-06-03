import type { ReactElement } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import { VscSearch } from 'react-icons/vsc';
import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { AppState } from '../../../types';
import { actions } from '../../../state';
import { GuidedAnswerNode } from '../GuidedAnswerNode';
import { Header } from '../Header';
import './App.scss';

let timer: NodeJS.Timeout;

/**
 * Start element for Guided Answers Extension app.
 *
 * @returns - react elements for this app
 */
export function App(): ReactElement {
    const appState = useSelector<AppState, AppState>((state) => state);

    let content;
    if (appState.activeGuidedAnswerNode.length > 0) {
        content = <GuidedAnswerNode />;
    } else if (appState.guidedAnswerTrees) {
        content = (
            <>
                <VSCodeTextField
                    className="tree-search-field"
                    value={appState.query}
                    placeholder="Search Guided Answers"
                    onInput={(e: any) => {
                        console.log(`Value changed`, e);
                        const newValue = e?.target?.value;
                        if (newValue !== undefined) {
                            clearTimeout(timer);
                            actions.setQueryValue(newValue);
                            timer = setTimeout(() => {
                                actions.searchTree(newValue);
                            }, 400);
                        }
                    }}>
                    <span slot="end" className="tree-search-icon">
                        <VscSearch />
                    </span>
                </VSCodeTextField>
                {appState.guidedAnswerTrees.map((tree, index) => {
                    return (
                        <div key={`tree-item-${index}`} className="tree-item">
                            <div
                                className="guided-answer__tree"
                                onClick={(): void => {
                                    actions.setActiveTree(tree);
                                    actions.selectNode(tree.FIRST_NODE_ID);
                                }}>
                                <ul className="guided-answer__tree__ul">
                                    <h3 className="guided-answer__tree__title">{tree.TITLE}</h3>
                                    {tree.DESCRIPTION && (
                                        <span className="guided-answer__tree__desc">{tree.DESCRIPTION}</span>
                                    )}
                                </ul>
                            </div>
                        </div>
                    );
                })}
            </>
        );
    }
    return (
        <div className="guided-answer">
            <Header
                showLogo={appState.activeGuidedAnswerNode.length === 0}
                showNavButons={appState.activeGuidedAnswerNode.length !== 0}
            />
            <main className="guided-answer__container">{content}</main>
        </div>
    );
}
