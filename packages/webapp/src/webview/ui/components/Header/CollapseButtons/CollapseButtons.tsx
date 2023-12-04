import React from 'react';
import i18next from 'i18next';
import { useSelector } from 'react-redux';
import { UIIconButton, UiIcons } from '@sap-ux/ui-components';
import { actions } from '../../../../state';
import type { AppState } from '../../../../types';

/**
 *
 * @returns Collapse buttons for the header
 */
export function CollapseButtons() {
    const appState = useSelector<AppState, AppState>((state) => state);

    return (
        <>
            <UIIconButton
                id="expand-all-button"
                className="guided-answer__header__navButtons"
                style={{ marginTop: 0 }}
                iconProps={{ iconName: UiIcons.ExpandNodes }}
                title={i18next.t('EXPAND_ALL_TREES')}
                disabled={appState.guidedAnswerTreeSearchResult.resultSize <= 0}
                onClick={() => actions.expandAllSearchNodes()}
                primary></UIIconButton>
            <UIIconButton
                id="collapse-all-button"
                className="guided-answer__header__navButtons"
                style={{ marginTop: 0 }}
                iconProps={{ iconName: UiIcons.ContractNodes }}
                title={i18next.t('COLLAPSE_ALL_TREES')}
                disabled={appState.guidedAnswerTreeSearchResult.resultSize <= 0}
                onClick={() => actions.collapseAllSearchNodes()}
                primary></UIIconButton>
        </>
    );
}
