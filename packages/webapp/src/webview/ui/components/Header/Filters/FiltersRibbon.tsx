import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import i18next from 'i18next';
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

    const isSaved = appState.customFilters.find((f) => {
        return (
            (f.component ?? []).toString() === selectedComponentFilters.toString() &&
            (f.product ?? []).toString() === selectedProductFilters.toString()
        );
    });

    const clearFilters = () => {
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

    const saveFilters = () => {
        actions.updateCustomFilters([
            ...appState.customFilters,
            {
                component: selectedComponentFilters.length ? undefined : selectedComponentFilters,
                product: selectedProductFilters.length ? undefined : selectedProductFilters
            }
        ]);
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

    return hasFilters ? (
        <div className="guided-answer__header__filter-ribbon">
            <p className="guided-answer__header__filter-ribbon__text">
                Searching in {hasProductsFilter ? 'Product' : ''}
                {((hasProductsFilter && !hasComponentsFilter) || hasBothFilters) && <strong>&nbsp;</strong>}
                <strong>{selectedProductFilters?.join(', ')}</strong>
                {hasBothFilters && <span>&nbsp; and &nbsp;</span>}
                {hasComponentsFilter && !hasProductsFilter && <strong>&nbsp;</strong>}
                {hasComponentsFilter ? 'Component' : ''}&nbsp;
                <strong>{selectedComponentFilters?.join(', ')}</strong>
                {hasBothFilters && <strong>&nbsp;</strong>}
            </p>

            <div className="guided-answer__header__divider"></div>
            <button
                id="clear-filters"
                className="guided-answer__header__button"
                onClick={clearFilters}
                title={i18next.t('CLEAR')}>
                <UIIcon iconName={UiIcons.Close} />
                <span className="guided-answer__header__button__text">{i18next.t('CLEAR')}</span>
            </button>
            {!isSaved && (
                <button
                    id="save-filters"
                    className="guided-answer__header__button"
                    onClick={saveFilters}
                    title={i18next.t('SAVE')}>
                    <UIIcon iconName={UiIcons.Save} />
                    <span className="guided-answer__header__button__text">{i18next.t('SAVE')}</span>
                </button>
            )}
        </div>
    ) : (
        <></>
    );
}
