import React, { useEffect, useState } from 'react';
import { UISearchBox } from '@sap-ux/ui-components';
import type { ISearchBox } from '@fluentui/react';

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

    let searchInputRef: React.RefObject<ISearchBox>;

    const getSearchInputRef = (): React.RefObject<ISearchBox> => {
        searchInputRef = React.createRef();
        return searchInputRef;
    };

    const onClear = (): void => {
        if (activeSearch !== '') {
            setSearchTerm('');

            if (searchInputRef?.current) {
                searchInputRef?.current.focus();
            }
        }
    };

    const onSearch = (searchItem: string): void => {
        if (!/\S/.test(searchItem)) {
            searchItem = '';
        } else {
            searchItem = searchItem.trim();
        }

        if (activeSearch !== searchItem) {
            actions.setQueryValue(searchItem);
        } else {
            setSearchTerm(searchItem);
        }
    };

    useEffect(() => {
        if (activeScreen === 'HOME' && activeSearch === '') {
            setSearchTerm('');
        } else {
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
        <div className="guided-answer__header__searchField" id="search-field-container">
            <UISearchBox
                componentRef={getSearchInputRef()}
                className="tree-search-field"
                value={searchTerm}
                readOnly={networkStatus === 'LOADING'}
                placeholder="Search Guided Answers"
                id="search-field"
                onChange={(e, t) => setSearchTerm(t ?? '')}
                onClear={onClear}
                onSearch={onSearch}></UISearchBox>
            {activeScreen === 'SEARCH' && <Filters />}
        </div>
    );
};
