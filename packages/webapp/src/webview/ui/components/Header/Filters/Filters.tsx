import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../types';
import { actions } from '../../../../state';
import { UiIcons } from '../../UIComponentsLib/Icons';
import { UIIconButton, UIDialog, UICheckbox, UITextInput } from '@sap-ux/ui-components';
import type { ProductFilter, ComponentFilter } from '@sap/guided-answers-extension-types';
import { Stack, IStackTokens } from '@fluentui/react';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';

import './Filters.scss';

/**
 * Sorts products array.
 *
 * @param filters A products array
 * @returns A sorted list of products
 */
export const sortProductFilters = (filters: ProductFilter[]) => {
    return filters.sort((a: ProductFilter, b: ProductFilter) => {
        return a.PRODUCT.localeCompare(b.PRODUCT, undefined, {
            numeric: true,
            sensitivity: 'base'
        });
    });
};

export const sortComponentFilters = (filters: ComponentFilter[]) => {
    type WithNoHyphens = {
        NOHYPHENS?: string;
    };
    type ComponentFilterWithNoHyphens = ComponentFilter & WithNoHyphens;

    const sorting = (a: ComponentFilterWithNoHyphens, b: ComponentFilterWithNoHyphens): any => {
        if (a.NOHYPHENS !== undefined && b.NOHYPHENS !== undefined) {
            return a.NOHYPHENS.localeCompare(b.NOHYPHENS, undefined, {
                numeric: true,
                sensitivity: 'base'
            });
        }
        return undefined;
    };

    return filters
        .map((f: ComponentFilter) => {
            let filter: ComponentFilterWithNoHyphens = f;
            filter.NOHYPHENS = f.COMPONENT.replace(/-/g, '');
            return filter;
        })
        .sort(sorting)
        .map((c: ComponentFilterWithNoHyphens): ComponentFilter => {
            delete c.NOHYPHENS;
            return c;
        });
};

/**
 *
 * @returns Filters for the header
 */
export function Filters() {
    const appState = useSelector<AppState, AppState>((state) => state);
    const PRODUCTS = 'Products';
    const COMPONENTS = 'Components';
    const [isDialogVisible, setDialogVisible] = useState(false);
    const [filter, setFilterType] = useState(PRODUCTS);
    const [productFilters, setProductFilters] = useState(appState.guidedAnswerTreeSearchResult.productFilters);
    const [componentFilters, setComponentFilters] = useState(appState.guidedAnswerTreeSearchResult.componentFilters);
    const [query, setQuery] = useState('');
    const [selectedProductFilters, setSelectedProductFilters] = useState([...appState.selectedProductFilters]);
    const [selectedComponentFilters, setSelectedComponentFilters] = useState([...appState.selectedProductFilters]);
    const isFilterProducts = filter === PRODUCTS;
    const main = {
        ['.ms-TextField-wrapper > .ms-Label']: {
            margin: 0
        },
        height: '400px'
    };

    const verticalGapStackTokens: IStackTokens = {
        childrenGap: 10,
        padding: '10px 0'
    };

    const toggleVisibility = (type: string): void => {
        if (type === PRODUCTS) {
            setFilterType(PRODUCTS);
        } else {
            setFilterType(COMPONENTS);
        }
        setQuery('');
        setDialogVisible(!isDialogVisible);
    };

    const applyFilters = (type: string): void => {
        toggleVisibility(type);
        if (type === PRODUCTS) {
            actions.setProductFilters(selectedProductFilters);
            actions.searchTree({
                query: appState.query,
                filters: {
                    product: selectedProductFilters,
                    component: selectedComponentFilters
                }
            });
        } else {
            actions.setComponentFilters(selectedComponentFilters);
            actions.searchTree({
                query: appState.query,
                filters: {
                    product: selectedProductFilters,
                    component: selectedComponentFilters
                }
            });
        }
    };

    const cancel = () => {
        setSelectedComponentFilters([...appState.selectedComponentFilters]);
        setSelectedProductFilters([...appState.selectedProductFilters]);
        setDialogVisible(false);
    };

    const toggleFilters = (type: string): void => {
        toggleVisibility(type);
        if (type === PRODUCTS) {
            setSelectedProductFilters(
                appState.guidedAnswerTreeSearchResult.productFilters
                    .filter((v) => selectedProductFilters.includes(v.PRODUCT))
                    .map((v) => v.PRODUCT)
            );
            setProductFilters(sortProductFilters(appState.guidedAnswerTreeSearchResult.productFilters));
        } else {
            setSelectedComponentFilters(
                appState.guidedAnswerTreeSearchResult.componentFilters
                    .filter((v) => selectedComponentFilters.includes(v.COMPONENT))
                    .map((v) => v.COMPONENT)
            );
            setComponentFilters(sortComponentFilters(appState.guidedAnswerTreeSearchResult.componentFilters));
        }
    };

    const resetFilter = (): void => {
        setQuery('');
        actions.searchTree({
            query: appState.query,
            filters: {
                product: appState.selectedProductFilters.length > 0 ? appState.selectedProductFilters : [],
                component: appState.selectedComponentFilters.length > 0 ? appState.selectedComponentFilters : []
            }
        });
        setDialogVisible(!isDialogVisible);
    };

    const onChange = (filter: string) => (ev?: any, checked?: boolean) => {
        if (isFilterProducts) {
            if (checked) {
                setSelectedProductFilters([...selectedProductFilters, filter]);
            } else {
                setSelectedProductFilters(selectedProductFilters.filter((e) => e !== filter));
            }
        } else if (checked) {
            setSelectedComponentFilters([...selectedComponentFilters, filter]);
        } else {
            setSelectedComponentFilters(selectedComponentFilters.filter((e) => e !== filter));
        }
    };

    useEffect(() => {
        setSelectedProductFilters(appState.selectedProductFilters);
        setSelectedComponentFilters(appState.selectedComponentFilters);
    }, [appState.selectedProductFilters, appState.selectedComponentFilters]);

    const filterType: any = {
        Products: {
            title: 'Filter Products',
            visibility: isDialogVisible,
            apply: () => applyFilters(PRODUCTS),
            listItems: productFilters.map((productFilter: { PRODUCT: string }) => (
                <UICheckbox
                    key={`${productFilter.PRODUCT}`}
                    label={productFilter.PRODUCT}
                    checked={selectedProductFilters.includes(productFilter.PRODUCT)}
                    onChange={onChange(productFilter.PRODUCT)}
                />
            ))
        },
        Components: {
            title: 'Filter Components',
            visibility: isDialogVisible,
            apply: () => applyFilters(COMPONENTS),
            listItems: componentFilters.map((componentFilter: { COMPONENT: string }) => (
                <UICheckbox
                    key={`${componentFilter.COMPONENT}`}
                    label={componentFilter.COMPONENT}
                    checked={selectedComponentFilters.includes(componentFilter.COMPONENT)}
                    onChange={onChange(componentFilter.COMPONENT)}
                />
            ))
        }
    };

    const searchFilter = (e: any) => {
        const query = e.target.value;

        if (query.length >= 1) {
            setQuery(query);
            let filters: (ProductFilter | ComponentFilter)[] =
                appState.guidedAnswerTreeSearchResult[isFilterProducts ? 'productFilters' : 'componentFilters'];

            filters = filters.filter((f: ProductFilter | ComponentFilter) =>
                isFilterProducts
                    ? (f as ProductFilter).PRODUCT.toLowerCase().includes(query.toLowerCase())
                    : (f as ComponentFilter).COMPONENT.toLowerCase().includes(query.toLowerCase())
            );

            if (isFilterProducts) {
                setProductFilters(sortProductFilters(filters as ProductFilter[]));
            } else {
                setComponentFilters(sortComponentFilters(filters as ComponentFilter[]));
            }
        } else {
            setQuery('');
            setProductFilters(sortProductFilters(appState.guidedAnswerTreeSearchResult.productFilters));
            setComponentFilters(sortComponentFilters(appState.guidedAnswerTreeSearchResult.componentFilters));
        }
    };

    return (
        <>
            <div id="filters">
                <FocusZone
                    direction={FocusZoneDirection.horizontal}
                    isCircularNavigation={true}
                    style={{ display: 'flex' }}>
                    <UIIconButton
                        id="filter-products"
                        iconProps={{ iconName: UiIcons.Table }}
                        onClick={() => toggleFilters(PRODUCTS)}
                        disabled={appState.guidedAnswerTreeSearchResult.productFilters.length === 0}
                        className={`filter-button ${selectedProductFilters.length > 0 ? 'filter-button-selected' : ''}`}
                        primary
                        title="Filter Products"></UIIconButton>
                    <UIIconButton
                        id="filter-components"
                        iconProps={{ iconName: UiIcons.IdTag }}
                        onClick={() => toggleFilters(COMPONENTS)}
                        disabled={appState.guidedAnswerTreeSearchResult.componentFilters.length === 0}
                        primary
                        title="Filter Components"
                        className={`filter-button ${
                            selectedComponentFilters.length > 0 ? 'filter-button-selected' : ''
                        }`}></UIIconButton>
                </FocusZone>
                <UIDialog
                    className="dialog-filter"
                    dialogContentProps={{ title: filterType[filter].title }}
                    isOpen={filterType[filter].visibility}
                    isBlocking={true}
                    acceptButtonText={'Apply Filter'}
                    cancelButtonText={'Cancel'}
                    styles={{ main }}
                    onAccept={() => filterType[filter].apply()}
                    onCancel={cancel}
                    onDismiss={resetFilter}>
                    <UITextInput placeholder="Search" value={query} onChange={searchFilter} />
                    <FocusZone
                        direction={FocusZoneDirection.domOrder}
                        isCircularNavigation={true}
                        style={{ overflowY: 'scroll', height: '90%', padding: 0, marginTop: '10px' }}>
                        <Stack tokens={verticalGapStackTokens} style={{ margin: '0px 4px' }}>
                            {filterType[filter].listItems}
                        </Stack>{' '}
                    </FocusZone>
                </UIDialog>
            </div>
        </>
    );
}
