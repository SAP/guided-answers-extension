import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { AppState } from '../../../../types';
import { actions } from '../../../../state';
import { UIIcon, UiIcons } from '@sap-ux/ui-components';
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
                responseSize: 20, //appState.pageSize,
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
                <div style={{ lineHeight: '18px', marginTop: '1px' }}>
                    Searching in {hasProductsFilter ? 'Product' : ''}
                    {((hasProductsFilter && !hasComponentsFilter) || hasBothFilters) && <strong>&nbsp;</strong>}
                    <strong>{selectedProductFilters?.map((pf: string) => pf).join(', ')}</strong>
                    {hasBothFilters && <span>&nbsp; and &nbsp;</span>}
                    {hasComponentsFilter && !hasProductsFilter && <strong>&nbsp;</strong>}
                    {hasComponentsFilter ? 'Component' : ''}&nbsp;
                    <strong>{selectedComponentFilters?.map((cf: string) => cf).join(', ')}</strong>
                    {hasBothFilters && <strong>&nbsp;</strong>}
                    <button id="clear-filters" className="clear-filters" onClick={resetFilters} title="Clear filters">
                        <UIIcon iconName={UiIcons.Close} />
                        <span>Clear filters</span>
                    </button>
                </div>
            )}
        </>
    );
}
