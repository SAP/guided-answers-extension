import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../types';
import { actions } from '../../../../state';
import { UIIconButton } from '../../UIComponentsLib/UIButton';
import { UiIcons } from '../../UIComponentsLib/Icons';
import { UIDialog } from '../../UIComponentsLib/UIDialog';
import { UICheckbox } from '../../UIComponentsLib/UICheckbox';
import { VSCodeTextField } from '@vscode/webview-ui-toolkit/react';
import type { ProductFilter, ComponentFilter } from '@sap/guided-answers-extension-types';

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
    const [selectedProductFilters, setSelectedProductFilters] = useState(appState.selectedProductFilters);
    const [selectedComponentFilters, setSelectedComponentFilters] = useState(appState.selectedProductFilters);
    const isFilterProducts = filter === PRODUCTS;
    const sortProductFilters = (filters: ProductFilter[]) => {
        return filters.sort((a: ProductFilter, b: ProductFilter) => {
            return a.PRODUCT.localeCompare(b.PRODUCT, undefined, {
                numeric: true,
                sensitivity: 'base'
            });
        });
    };
    const main = {
        ['.ms-TextField-wrapper > .ms-Label']: {
            margin: 0
        },
        height: '400px'
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
        } else {
            actions.setComponentFilters(selectedComponentFilters);
        }
    };

    const toggleFilters = (type: string): void => {
        toggleVisibility(type);
        if (type === PRODUCTS) {
            setProductFilters(sortProductFilters(appState.guidedAnswerTreeSearchResult.productFilters));
        } else {
            setComponentFilters(appState.guidedAnswerTreeSearchResult.componentFilters);
        }
    };

    const resetFilter = (): void => {
        setQuery('');
        if (isFilterProducts) {
            actions.setProductFilters([]);
        } else {
            actions.setComponentFilters([]);
        }
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
                <li key={`${productFilter.PRODUCT}`} style={{ marginBottom: '10px' }}>
                    <UICheckbox
                        label={productFilter.PRODUCT}
                        checked={selectedProductFilters.includes(productFilter.PRODUCT)}
                        onChange={onChange(productFilter.PRODUCT)}
                    />
                </li>
            ))
        },
        Components: {
            title: 'Filter Components',
            visibility: isDialogVisible,
            apply: () => applyFilters(COMPONENTS),
            listItems: componentFilters.map((componentFilter: { COMPONENT: string }) => (
                <li key={`${componentFilter.COMPONENT}`} style={{ marginBottom: '10px' }}>
                    <UICheckbox
                        label={componentFilter.COMPONENT}
                        checked={selectedComponentFilters.includes(componentFilter.COMPONENT)}
                        onChange={onChange(componentFilter.COMPONENT)}
                    />
                </li>
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
                setComponentFilters(filters as ComponentFilter[]);
            }
        } else {
            setQuery('');
            setProductFilters(sortProductFilters(appState.guidedAnswerTreeSearchResult.productFilters));
            setComponentFilters(appState.guidedAnswerTreeSearchResult.componentFilters);
        }
    };

    return (
        <>
            {appState.betaFeatures && (
                <>
                    <UIIconButton
                        id="filter-products"
                        iconProps={{ iconName: UiIcons.Table }}
                        onClick={() => toggleFilters(PRODUCTS)}
                        primary
                        title="Filter Products"
                        className="filter-button"></UIIconButton>
                    <UIIconButton
                        id="filter-components"
                        iconProps={{ iconName: UiIcons.IdTag }}
                        onClick={() => toggleFilters(COMPONENTS)}
                        primary
                        title="Filter Components"
                        className="filter-button"></UIIconButton>
                    <UIDialog
                        dialogContentProps={{ title: filterType[filter].title }}
                        isOpen={filterType[filter].visibility}
                        isBlocking={true}
                        acceptButtonText={'Apply Filter'}
                        cancelButtonText={'Cancel'}
                        styles={{ main }}
                        onAccept={() => filterType[filter].apply()}
                        onCancel={resetFilter}
                        onDismiss={resetFilter}>
                        <VSCodeTextField
                            style={{ width: '100%' }}
                            value={query}
                            onInput={searchFilter}
                            readOnly={appState.loading}
                            placeholder="Search"
                            id="dialog-filter-field"></VSCodeTextField>
                        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>{filterType[filter].listItems}</ul>
                    </UIDialog>
                </>
            )}
        </>
    );
}
