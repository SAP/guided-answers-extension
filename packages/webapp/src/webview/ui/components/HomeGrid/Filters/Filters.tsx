import React from 'react';
import type { ReactElement } from 'react';
import { UIIcon, UiIcons } from '@sap-ux/ui-components';
import { useSelector } from 'react-redux';
import type { AppState } from '../../../../types';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import { actions } from '../../../../state';
import type { FilterStack } from '@sap/guided-answers-extension-types';
import './Filters.scss';

/**
 * Shows list of Filters.
 *
 * @returns - react elements for Filters view
 */
export function Filters(): ReactElement {
    const autoFilters = useSelector<AppState, FilterStack[]>((state) => state.autoFilters);
    const customFilters = useSelector<AppState, FilterStack[]>((state) => state.customFilters);

    const renderFilter = (f: FilterStack) => (
        <li key={`tree-item-${f.product?.join('-')}-${f.component?.join('-')}`} className="guided-answer__filter">
            <button
                onClick={(): void => {
                    actions.updateNetworkStatus('LOADING');
                    actions.searchTree({ filters: f });
                }}>
                {f.product && (
                    <div>
                        Product: <strong>{f.product.join(', ')}</strong>
                    </div>
                )}
                {f.component && (
                    <div>
                        Component: <strong>{f.component.join(', ')}</strong>
                    </div>
                )}
            </button>
        </li>
    );

    return (
        <div>
            <h3 className="guided-answer__home-grid__section__title">
                <UIIcon iconName={UiIcons.Filter} />
                <span>Filters</span>
            </h3>
            <FocusZone direction={FocusZoneDirection.vertical} isCircularNavigation={true}>
                <ul className="guided-answer__home-grid__section__list" role="listbox">
                    {autoFilters.map(renderFilter)}
                    {customFilters.map(renderFilter)}
                </ul>
            </FocusZone>
        </div>
    );
}
