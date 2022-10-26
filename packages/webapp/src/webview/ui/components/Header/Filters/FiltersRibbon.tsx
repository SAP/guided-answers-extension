import React, { useState, useEffect } from 'react';
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
    const [selectedProductFilters, setSelectedProductFilters] = useState(appState.selectedProductFilters);
    const [selectedComponentFilters, setSelectedComponentFilters] = useState(appState.selectedProductFilters);
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
            },
            paging: {
                responseSize: appState.pageSize,
                offset: 0
            }
        });
    };

    useEffect(() => {
        setSelectedProductFilters(
            appState.guidedAnswerTreeSearchResult.productFilters
                .filter((v: { PRODUCT: string }) => appState.selectedProductFilters.includes(v.PRODUCT))
                .map((v: { PRODUCT: any }) => v.PRODUCT)
        );
        setSelectedComponentFilters(
            appState.guidedAnswerTreeSearchResult.componentFilters
                .filter((v: { COMPONENT: string }) => appState.selectedComponentFilters.includes(v.COMPONENT))
                .map((v: { COMPONENT: any }) => v.COMPONENT)
        );
    }, [appState.selectedProductFilters, appState.selectedComponentFilters]);

    return (
        <>
            {hasFilters && (
                <div style={{ lineHeight: '18px' }}>
                    Searching in {hasProductsFilter ? 'Product' : ''}
                    {((hasProductsFilter && !hasComponentsFilter) || hasBothFilters) && <strong>&nbsp;</strong>}
                    <strong>
                        {selectedProductFilters && selectedProductFilters.map((pf: string) => pf).join(', ')}
                    </strong>
                    {hasBothFilters && <span>&nbsp; and &nbsp;</span>}
                    {hasComponentsFilter && !hasProductsFilter && <strong>&nbsp;</strong>}
                    {hasComponentsFilter ? 'Component' : ''}&nbsp;
                    <strong>
                        {selectedComponentFilters && selectedComponentFilters.map((cf: string) => cf).join(', ')}
                    </strong>
                    {hasBothFilters && <strong>&nbsp;</strong>}
                    <button className="clear-filters" onClick={resetFilters} title="Clear filters">
                        <VscClose className="clear-filters__content" />{' '}
                        <span className="clear-filters__content__text text-underline">Clear filters</span>
                    </button>
                </div>
            )}
        </>
    );
}
