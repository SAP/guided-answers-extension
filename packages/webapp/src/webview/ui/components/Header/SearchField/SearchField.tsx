import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../types';
import { actions } from '../../../../state';
import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import { UIIconButton } from '../../UIComponentsLib/UIButton';
import { UiIcons } from '../../Icons';
import { UIDialog } from '../../UIComponentsLib/UIDialog';
import { UICheckbox } from '../../UIComponentsLib/UICheckbox';

let timer: NodeJS.Timeout;
/**
 *
 * @returns An input field
 */
export function SearchField() {
    const [isVisible, setVisible] = useState(false);
    const toggle = (): void => {
        setVisible(!isVisible);
    };
    const main = {
        ['.ms-TextField-wrapper > .ms-Label']: {
            margin: 0
        },
        height: '400px'
    };

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
                            actions.searchTree({ query: newValue });
                        }, 400);
                    }
                }}></VSCodeTextField>
            <UIIconButton
                id="undo-button-action"
                iconProps={{ iconName: UiIcons.Table }}
                onClick={toggle}
                primary
                title="Filter"
                style={{ width: '26px', height: '20px' }}></UIIconButton>
            <UIDialog
                isOpen={isVisible}
                isBlocking={true}
                title={'Filter Product'}
                acceptButtonText={'Apply Filter'}
                cancelButtonText={'Cancel'}
                styles={{
                    main
                }}
                onAccept={toggle}
                onCancel={toggle}
                onDismiss={toggle}>
                <VSCodeTextField
                    style={{ width: '100%' }}
                    value={appState.query}
                    readOnly={appState.loading}
                    placeholder="Search"
                    id="dialog-filter-field"></VSCodeTextField>
                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                    {['Component1', 'Component2', 'Component3', 'Component4', 'Component5'].map((c) => (
                        <li key={`${c}`} style={{ marginBottom: '10px' }}>
                            <UICheckbox label={c} />
                        </li>
                    ))}
                </ul>
            </UIDialog>
        </div>
    );
}
