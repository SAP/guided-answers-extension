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
    const [isVisibleProducts, setVisibleProducts] = useState(false);
    const [isVisibleComponents, setVisibleComponents] = useState(false);
    const [filter, setFilterType] = useState('products');
    const [productFilters, setProductFilters] = useState(appState.guidedAnswerTreeSearchResult.productFilters);
    const [componentFilters, setComponentFilters] = useState(appState.guidedAnswerTreeSearchResult.componentFilters);
    const [query, setQuery] = useState('');
    const [selectedProductFilters, setSelectedProductFilters] = useState(appState.selectedProductFilters);
    const [selectedComponentFilters, setSelectedComponentFilters] = useState(appState.selectedProductFilters);
    const isFilterProducts = filter === 'products';

    const applyProductsFilter = (): void => {
        setFilterType('products');
        setQuery('');
        setProductFilters(appState.guidedAnswerTreeSearchResult.productFilters);
        actions.setProductFilters(selectedProductFilters);
        setVisibleProducts(!isVisibleProducts);
    };

    const applyComponentsFilter = (): void => {
        setFilterType('components');
        setQuery('');
        setComponentFilters(appState.guidedAnswerTreeSearchResult.componentFilters);
        actions.setComponentFilters(selectedComponentFilters);
        setVisibleComponents(!isVisibleComponents);
    };

    const toggleProductsFilter = (): void => {
        setFilterType('products');
        setVisibleProducts(!isVisibleProducts);
        setQuery('');
        setProductFilters(appState.guidedAnswerTreeSearchResult.productFilters);
    };

    const toggleComponentsFilter = (): void => {
        setFilterType('components');
        setVisibleComponents(!isVisibleComponents);
        setQuery('');
        setComponentFilters(appState.guidedAnswerTreeSearchResult.componentFilters);
    };

    const resetFilter = (): void => {
        setQuery('');
        if (isFilterProducts) {
            actions.setProductFilters([]);
            setVisibleProducts(!isVisibleProducts);
        } else {
            actions.setComponentFilters([]);
            setVisibleComponents(!isVisibleComponents);
        }
    };

    const main = {
        ['.ms-TextField-wrapper > .ms-Label']: {
            margin: 0
        },
        height: '400px'
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
        products: {
            title: 'Filter Products',
            visibility: isVisibleProducts,
            apply: applyProductsFilter,
            listItems: productFilters.map((productFilter: { PRODUCT: any }) => (
                <li key={`${productFilter.PRODUCT}`} style={{ marginBottom: '10px' }}>
                    <UICheckbox
                        label={productFilter.PRODUCT}
                        checked={selectedProductFilters.includes(productFilter.PRODUCT)}
                        onChange={onChange(productFilter.PRODUCT)}
                    />
                </li>
            ))
        },
        components: {
            title: 'Filter Components',
            visibility: isVisibleComponents,
            apply: applyComponentsFilter,
            listItems: componentFilters.map((componentFilter: { COMPONENT: any }) => (
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
        const query = e.target.value.toLowerCase();

        if (query.length >= 1) {
            setQuery(query);
            let filters: (ProductFilter | ComponentFilter)[] =
                appState.guidedAnswerTreeSearchResult[isFilterProducts ? 'productFilters' : 'componentFilters'];

            filters = filters.filter((f: ProductFilter | ComponentFilter) =>
                isFilterProducts
                    ? (f as ProductFilter).PRODUCT.toLowerCase().includes(query)
                    : (f as ComponentFilter).COMPONENT.toLowerCase().includes(query)
            );

            if (isFilterProducts) {
                setProductFilters(filters as ProductFilter[]);
            } else {
                setComponentFilters(filters as ComponentFilter[]);
            }
        } else {
            setQuery('');
            setProductFilters(appState.guidedAnswerTreeSearchResult.productFilters);
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
                        onClick={toggleProductsFilter}
                        primary
                        title="Filter Products"
                        style={{ width: '26px', height: '20px' }}></UIIconButton>
                    <UIIconButton
                        id="filter-components"
                        iconProps={{ iconName: UiIcons.Sections }}
                        onClick={toggleComponentsFilter}
                        primary
                        title="Filter Components"
                        style={{ width: '26px', height: '20px' }}></UIIconButton>
                    <UIDialog
                        dialogContentProps={{ title: filterType[filter].title }}
                        isOpen={filterType[filter].visibility}
                        isBlocking={true}
                        acceptButtonText={'Apply Filter'}
                        cancelButtonText={'Cancel'}
                        styles={{
                            main
                        }}
                        onAccept={filterType[filter].apply}
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
