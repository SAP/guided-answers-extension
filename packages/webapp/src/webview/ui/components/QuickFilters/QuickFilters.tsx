import React from 'react';
import type { ReactElement } from 'react';
import { VscFilter } from 'react-icons/vsc';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import { actions } from '../../../state';
import type { GuidedAnswersQueryFilterOptions } from '@sap/guided-answers-extension-types';
import './QuickFilters.scss';

/**
 * Shows list of Quick Filters.
 *
 * @returns - react elements for QuickFilters view
 */
export function QuickFilters(): ReactElement {
    const filters: GuidedAnswersQueryFilterOptions[] = [
        { component: ['CA-UX-IDE', 'CA-FE-FLP-EU', 'CA-FE-FLP-DT', 'CA-FE-FAL', 'CA-UI2-INT-BE', 'CA-UI2-INT-FE', 'CA-UI2-THD'] }
    ];
    return (
        <div>
            <h3 style={{ display: 'flex', alignItems: 'center' }}>
                <VscFilter />
                <span style={{ margin: '0 5px' }}>Quick Filters</span>
            </h3>
            <FocusZone direction={FocusZoneDirection.bidirectional} isCircularNavigation={true}>
                <ul className="striped-list-items" role="listbox">
                    {filters.map((f: GuidedAnswersQueryFilterOptions) => (
                        <li
                            key={`tree-item-${f.product?.join('-')}-${f.component?.join('-')}`}
                            className="tree-item"
                            role="option"
                        >
                            <button
                                className="guided-answer__quick-filter"
                                onClick={(): void => {}}
                            >
                                {f.product && (
                                    <div>Product: <strong>{f.product.join(', ')}</strong></div>
                                )}
                                {f.component && (
                                    <div>Component: <strong>{f.component.join(', ')}</strong></div>
                                )}
                            </button>
                        </li>
                    ))}
                </ul>
            </FocusZone>
        </div>
    );
}
