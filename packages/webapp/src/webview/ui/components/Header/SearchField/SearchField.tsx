import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../types';
import { actions } from '../../../../state';
import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react';

let timer: NodeJS.Timeout;
/**
 *
 * @returns An input field
 */
export function SearchField() {
    const appState = useSelector<AppState, AppState>((state) => state);
    return (
        <div className="guided-answer__header__searchField">
            <VSCodeTextField
                className="tree-search-field"
                value={appState.query}
                readOnly={appState.loading}
                placeholder="Search Guided Answers"
                id="search-field"
                onInput={(e: any) => {
                    const newValue = e?.target?.value;
                    if (newValue !== undefined) {
                        clearTimeout(timer);
                        actions.setQueryValue(newValue);
                        timer = setTimeout(() => {
                            actions.searchTree(newValue);
                        }, 400);
                    }
                }}></VSCodeTextField>
        </div>
    );
}
