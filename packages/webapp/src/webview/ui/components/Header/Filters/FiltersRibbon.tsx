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
    const selectedProductFilters = appState.guidedAnswerTreeSearchResult.selectedProductFilters || [];
    const selectedComponentFilters = appState.guidedAnswerTreeSearchResult.selectedComponentFilters || [];
    const hasProductsFilter = selectedProductFilters.length > 0;
    const hasComponentsFilter = selectedComponentFilters.length > 0;
    const hasFilters = hasProductsFilter || hasComponentsFilter;
    const hasBothFilters = hasProductsFilter && hasComponentsFilter;

    return (
        <>
            {hasFilters && (
                <p style={{ display: 'flex', alignItems: 'center' }}>
                    Searching in: {`${hasProductsFilter ? 'Product' : ''}`}{' '}
                    <strong>
                        {selectedProductFilters && selectedProductFilters.map((pf: string) => pf).join(', ')}{' '}
                    </strong>
                    {hasBothFilters ? 'and ' : ''}
                    {`${hasComponentsFilter ? 'Component' : ''}`}{' '}
                    <strong>
                        {selectedComponentFilters && selectedComponentFilters.map((cf: string) => cf).join(', ')}
                    </strong>
                    <UIActionButton
                        iconProps={{
                            iconName: UiIcons.Clear
                        }}
                        style={{ color: 'var(--vscode-textLink-foreground)', paddingLeft: '10px' }}>
                        Clear filters
                    </UIActionButton>
                </p>
            )}
        </>
    );
}
