import type { ReactElement } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import { VscSearch } from 'react-icons/vsc';
import { VSCodeButton, VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { AppState } from '../../types';
import './App.scss';
import { actions } from '../../state';
import { GuidedAnswerNode } from './GuidedAnswerNode';

import Logo from './sap-logo.svg';

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
    const backButton =
        appState.activeGuidedAnswerNode.length > 0 ? (
            <VSCodeButton
                className="guided-answer__header__goback"
                onClick={(): void => {
                    actions.goToPreviousPage();
                }}>
                Go back
            </VSCodeButton>
        ) : (
            <></>
        );
    return (
        <div className="guided-answer">
            <div className="guided-answer__header">
                <div className="guided-answer__header__sub">
                    <span id="sap-logo">
                        <Logo />
                    </span>
                    <h1 className="guided-answer__header__title">Guided Answers</h1>
                    <span className="guided-answer__header__subtitle">
                        {appState.activeGuidedAnswer ? ': ' + appState.activeGuidedAnswer.TITLE : ''}
                    </span>
                </div>
                {backButton}
            </div>
            <main className="guided-answer__container">{content}</main>
        </div>
    );
}
