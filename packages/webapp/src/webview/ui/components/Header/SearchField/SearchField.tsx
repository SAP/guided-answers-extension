import React from 'react';
import { useSelector } from 'react-redux';
import type { AppState } from '../../../../types';
import { actions } from '../../../../state';
import { UISearchBox } from '@sap-ux/ui-components';

import { Filters } from '../Filters';

let timer: NodeJS.Timeout;
/**
 *
 * @returns An input field
 */
export function SearchField() {
    const appState = useSelector<AppState, AppState>((state) => state);
    const onSearchClear = (): void => {
        actions.setQueryValue('');
    };
    return (
        <div className="guided-answer__header__searchField">
            <UISearchBox
                className="tree-search-field"
                value={appState.query}
                readOnly={appState.networkStatus === 'LOADING'}
                placeholder="Search Guided Answers"
                id="search-field"
                onClear={onSearchClear}
                onChange={(e: any) => {
                    const newValue = e?.target?.value;
                    if (newValue !== undefined) {
                        clearTimeout(timer);
                        actions.setQueryValue(newValue);
                        timer = setTimeout(() => {
                            actions.searchTree({
                                query: newValue,
                                filters: {
                                    product: [],
                                    component: []
                                },
                                paging: {
                                    responseSize: appState.pageSize,
                                    offset: 0
                                }
                            });
                        }, 100);
                    }
                }}></UISearchBox>
            <Filters />
        </div>
    );
}
