import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
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

/**
 *
 * @returns An input field
 */
export const SearchField: React.FC = (): JSX.Element => {
    const networkStatus: string = useAppSelector(getNetworkStatus);
    const productFilters: string[] = useAppSelector(getProductFilters);
    const componentFilters: string[] = useAppSelector(getComponentFilters);
    const activeScreen: string = useAppSelector(getActiveScreen);
    const activeSearch: string = useAppSelector(getSearchQuery);

    const [searchTerm, setSearchTerm] = useState<string>(activeSearch);
    const [uuidKey, setUuidKey] = useState<any>(uuidv4);

    const onClear = (): void => {
        if (activeSearch !== '') {
            actions.setQueryValue('');
        }
    };

    const onSearch = (searchItem: string): void => {
        if (!/\S/.test(searchItem)) {
            searchItem = '';
        }
        if (activeSearch !== searchItem) {
            actions.setQueryValue(searchItem);
        }
    };

    useEffect(() => {
        if (activeScreen === 'HOME' && activeSearch === '') {
            setSearchTerm('');
            setUuidKey(uuidv4);
        } else if (activeSearch !== searchTerm) {
            setSearchTerm(activeSearch);
            fetchTreesData(
                activeSearch,
                {
                    product: productFilters,
                    component: componentFilters
                },
                {
                    responseSize: 20,
                    offset: 0
                }
            );
        }
    }, [activeSearch]);

    return (
        <div className="guided-answer__header__searchField" id="search-field-container" key={uuidKey}>
            <UISearchBox
                className="tree-search-field"
                defaultValue={searchTerm}
                readOnly={networkStatus === 'LOADING'}
                placeholder="Search Guided Answers"
                id="search-field"
                onClear={onClear}
                onSearch={onSearch}></UISearchBox>
            {activeScreen === 'SEARCH' && <Filters />}
        </div>
    );
};
