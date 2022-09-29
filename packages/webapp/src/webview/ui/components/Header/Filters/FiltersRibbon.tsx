import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../types';
import { actions } from '../../../../state';
import { VscClose } from 'react-icons/vsc';
import './FiltersRibbon.scss';

/**
 *
 * @returns FiltersRibbon
 */
export function FiltersRibbon() {
    const appState = useSelector<AppState, AppState>((state) => state);
    const selectedProductFilters = appState.selectedProductFilters || [];
    const selectedComponentFilters = appState.selectedComponentFilters || [];
    const hasProductsFilter = selectedProductFilters.length > 0;
    const hasComponentsFilter = selectedComponentFilters.length > 0;
    const hasFilters = hasProductsFilter || hasComponentsFilter;
    const hasBothFilters = hasProductsFilter && hasComponentsFilter;
    const resetFilters = () => {
        actions.resetFilters();
        actions.searchTree({
            query: appState.query,
            filters: {
                product: [],
                component: []
            }
        });
    };

    return (
        <>
            {hasFilters && (
                <div style={{ display: 'flex', alignItems: 'center', flexFlow: 'wrap' }}>
                    Searching in {hasProductsFilter ? 'Product' : ''}
                    {((hasProductsFilter && !hasComponentsFilter) || hasBothFilters) && <strong>&nbsp;</strong>}
                    <strong>
                        {selectedProductFilters && selectedProductFilters.map((pf: string) => pf).join(', ')}
                    </strong>
                    {hasBothFilters && <strong>&nbsp; and &nbsp;</strong>}
                    {hasComponentsFilter && !hasProductsFilter && <strong>&nbsp;</strong>}
                    {hasComponentsFilter ? 'Component' : ''}&nbsp;
                    <strong>
                        {selectedComponentFilters && selectedComponentFilters.map((cf: string) => cf).join(', ')}
                    </strong>
                    {hasBothFilters && <strong>&nbsp;</strong>}
                    {/* <button className="clear-filters clear-filters-icon" onClick={resetFilters} title="Clear filters">
                        <VscClose className="clear-filters__content" />{' '}
                        <span className="text-underline">Clear filters</span>
                    </button> */}
                    <button className="clear-filters" onClick={resetFilters} title="Clear filters">
                        <VscClose className="clear-filters__content" />{' '}
                        <span className="clear-filters__content__text text-underline">Clear filters</span>
                    </button>
                </div>
            )}
        </>
    );
}
