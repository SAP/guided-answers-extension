import React, { useCallback, useEffect, useState } from 'react';
import type { FC } from 'react';
import type { ChangeEvent } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { UISearchBox } from '@sap-ux/ui-components';

import { fetchTreesData } from '../../../../features/Trees/Trees.utils';
import { useAppSelector } from '../../../../state/hooks';
import { actions } from '../../../../state/store';
import {
    getSearchQuery,
    getNetworkStatus,
    getActiveScreen,
    getProductFilters,
    getComponentFilters
} from '../../../../state/reducers';
import { Filters } from '../Filters';

const SEARCH_TIMEOUT = 250;

/**
 *
 * @returns An input field
 */
export const SearchField: FC = (): JSX.Element => {
    const dispatch = useDispatch();

    const networkStatus: string = useAppSelector(getNetworkStatus);
    const productFilters: string[] = useAppSelector(getProductFilters);
    const componentFilters: string[] = useAppSelector(getComponentFilters);
    const activeScreen: string = useAppSelector(getActiveScreen);
    const activeSearch: string = useSelector(getSearchQuery);

    const [searchTerm, setSearchTerm] = useState<string>(activeSearch);

    const onClear = (): void => {
        if (activeSearch !== '') {
            actions.setQueryValue('');
        }
    };

    const onChange = (_?: ChangeEvent<HTMLInputElement> | undefined, newSearchTerm = ''): void => {
        if (!/\S/.test(newSearchTerm)) {
            newSearchTerm = '';
        }
        if (activeSearch !== newSearchTerm) {
            actions.setQueryValue(newSearchTerm);
        }
    };

    const onSearch = (searchItem: string): void => {
        if (!/\S/.test(searchItem)) {
            searchItem = '';
        }
        if (activeSearch !== searchItem) {
            dispatch(actions.setQueryValue(searchItem));
        }
    };

    useEffect(() => {
        if (activeSearch !== searchTerm) {
            setSearchTerm(activeSearch);

            fetchTreesData(
                activeSearch,
                {
                    product: productFilters,
                    component: componentFilters
                },
                {
                    responseSize: 20, //appState.pageSize,
                    offset: 0
                }
            );
        }
    }, [activeSearch]);

    return (
        <div className="guided-answer__header__searchField">
            <UISearchBox
                className="tree-search-field"
                defaultValue={searchTerm}
                readOnly={networkStatus === 'LOADING'}
                placeholder="Search Guided Answers"
                id="search-field"
                onClear={onClear}
                onChange={onChange}
                onSearch={onSearch}></UISearchBox>
            {activeScreen === 'SEARCH' && <Filters />}
        </div>
    );
};
