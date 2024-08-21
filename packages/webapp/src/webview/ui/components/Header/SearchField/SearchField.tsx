import React, { useCallback } from 'react';
import type { ChangeEvent } from 'react';
import { useSelector } from 'react-redux';

import { UISearchBox } from '@sap-ux/ui-components';

import type { AppState } from '../../../../types';
import { actions } from '../../../../state';
import { Filters } from '../Filters';

const SEARCH_TIMEOUT = 250;

/**
 *
 * @returns An input field
 */
export function SearchField() {
    const appState = useSelector<AppState, AppState>((state) => state);

    const debounce = (fn: Function, delay = SEARCH_TIMEOUT) => {
        let timeoutId: ReturnType<typeof setTimeout>;
        return function (this: any, ...args: any[]) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => fn.apply(this, args), delay);
        };
    };

    const debounceSearch = useCallback(
        debounce(
            (newSearchTerm: string, productFilters: string[], componentFilters: string[]) =>
                actions.searchTree({
                    query: newSearchTerm,
                    filters: {
                        product: productFilters,
                        component: componentFilters
                    },
                    paging: {
                        responseSize: appState.pageSize,
                        offset: 0
                    }
                }),
            SEARCH_TIMEOUT
        ),
        []
    );

    const onClearSearchTerm = (): void => {
        actions.setQueryValue('');
        debounceSearch('', [], []);
    };

    const onChangeSearchTerm = (_?: ChangeEvent<HTMLInputElement> | undefined, newSearchTerm = ''): void => {
        actions.setQueryValue(newSearchTerm);
        debounceSearch(newSearchTerm, appState.selectedProductFilters, appState.selectedComponentFilters);
    };

    return (
        <div className="guided-answer__header__searchField">
            <UISearchBox
                className="tree-search-field"
                value={appState.query}
                readOnly={appState.networkStatus === 'LOADING'}
                placeholder="Search Guided Answers"
                id="search-field"
                onClear={onClearSearchTerm}
                onChange={onChangeSearchTerm}></UISearchBox>
            {appState.activeScreen === 'SEARCH' && <Filters />}
        </div>
    );
}
