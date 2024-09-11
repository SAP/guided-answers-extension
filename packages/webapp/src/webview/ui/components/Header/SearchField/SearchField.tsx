import React, { useCallback } from 'react';
import debounce from 'lodash/debounce';
import { useSelector } from 'react-redux';
import { UISearchBox } from '@sap-ux/ui-components';
import i18next from 'i18next';

import type { AppState } from '../../../../types';
import { actions } from '../../../../state';
import { Filters } from '../Filters';

const SEARCH_TIMEOUT = 300;

/**
 * SearchField component renders a search input field with debounce functionality.
 * It interacts with the Redux state to manage search queries and filters.
 *
 * @returns {React.JSX.Element} The rendered search field component.
 */
export const SearchField: React.FC = (): React.JSX.Element => {
    const appState = useSelector<AppState, AppState>((state) => state);

    /**
     * Fetches the search results for the given search term and filters.
     *
     * @param {string} value - The search term.
     * @param {string[]} productFilters - The selected product filters.
     * @param {string[]} componentFilter - The selected component filters.
     * @param {number} pageSize - The number of results per page.
     */
    const getTreesForSearchTerm = (
        value: string,
        productFilters: string[],
        componentFilter: string[],
        pageSize: number
    ): void => {
        actions.searchTree({
            query: value,
            filters: {
                product: productFilters,
                component: componentFilter
            },
            paging: {
                responseSize: pageSize,
                offset: 0
            }
        });
    };

    /**
     * Debounces the search input to avoid excessive API calls.
     *
     * @param {string} newSearchTerm - The new search term entered by the user.
     * @param {string[]} productFilters - The selected product filters.
     * @param {string[]} componentFilter - The selected component filters.
     * @param {number} pageSize - The number of results per page.
     */
    const debounceSearch = useCallback(
        debounce(
            (newSearchTerm: string, productFilters: string[], componentFilter: string[], pageSize: number) =>
                getTreesForSearchTerm(newSearchTerm, productFilters, componentFilter, pageSize),
            SEARCH_TIMEOUT
        ),
        []
    );

    /**
     * Clears the search input and triggers a debounced search with empty values.
     */
    const onClearInput = (): void => {
        actions.setQueryValue('');
        debounceSearch('', appState.selectedProductFilters, appState.selectedComponentFilters, appState.pageSize);
    };

    /**
     * Handles changes to the search input, updating the query value and triggering a debounced search.
     *
     * @param {React.ChangeEvent<HTMLInputElement>} [_] - The change event from the input field.
     * @param {string} [newSearchTerm] - The new search term entered by the user.
     */
    const onChangeInput = (_?: React.ChangeEvent<HTMLInputElement> | undefined, newSearchTerm: string = ''): void => {
        actions.setQueryValue(newSearchTerm);
        debounceSearch(
            newSearchTerm,
            appState.selectedProductFilters,
            appState.selectedComponentFilters,
            appState.pageSize
        );
    };

    return (
        <div className="guided-answer__header__searchField" id="search-field-container">
            <UISearchBox
                className="tree-search-field"
                value={appState.query}
                placeholder={i18next.t('SEARCH_GUIDED_ANSWERS')}
                id="search-field"
                onClear={onClearInput}
                onChange={onChangeInput}></UISearchBox>
            {appState.activeScreen === 'SEARCH' && <Filters />}
        </div>
    );
};
