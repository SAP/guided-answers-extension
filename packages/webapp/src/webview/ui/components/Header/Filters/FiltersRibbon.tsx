import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../../types';
import { actions } from '../../../../state';
import { UiIcons } from '../../UIComponentsLib/Icons';
import { UIActionButton } from '../../UIComponentsLib/UIButton/UIActionButton';

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
    };

    return (
        <>
            {hasFilters && (
                <p style={{ display: 'flex', alignItems: 'center' }}>
                    Searching in {hasProductsFilter ? 'Product' : ''}
                    {((hasProductsFilter && !hasComponentsFilter) || hasBothFilters) && <strong>&nbsp;</strong>}
                    <strong>
                        {selectedProductFilters && selectedProductFilters.map((pf: string) => pf).join(', ')}
                    </strong>
                    &nbsp;
                    {hasBothFilters ? 'and' : ''}
                    {hasBothFilters && <strong>&nbsp;</strong>}
                    {hasComponentsFilter ? 'Component' : ''}&nbsp;
                    <strong>
                        {selectedComponentFilters && selectedComponentFilters.map((cf: string) => cf).join(', ')}
                    </strong>
                    <UIActionButton
                        iconProps={{
                            iconName: UiIcons.Clear
                        }}
                        id="clear-filters"
                        onClick={resetFilters}
                        style={{ color: 'var(--vscode-textLink-foreground)', paddingLeft: '5px' }}>
                        Clear filters
                    </UIActionButton>
                </p>
            )}
        </>
    );
}
