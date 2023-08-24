import type { ReactElement } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import type { AppState } from '../../../../types';
import { actions } from '../../../../state';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import { UIIcon, UiIcons } from '@sap-ux/ui-components';
import { TreeItemBottomSection } from '../../TreeItemBottomSection';
import type { LastVisitedGuide } from '@sap/guided-answers-extension-types';
import './LastVisited.scss';

/**
 * Shows list of Last Visited Guides.
 *
 * @returns - react elements for LastVisited view
 */
export function LastVisited(): ReactElement {
    const lastVisitedGuides = useSelector<AppState, LastVisitedGuide[]>((state) => state.lastVisitedGuides);
    return (
        <div>
            <h3 className="guided-answer__home-grid__section__title">
                <UIIcon iconName={UiIcons.History} />
                <span>Last visited</span>
            </h3>
            <FocusZone direction={FocusZoneDirection.vertical} isCircularNavigation={true}>
                <ul className="guided-answer__home-grid__section__list" role="listbox">
                    {lastVisitedGuides.slice(-1).map((guide: LastVisitedGuide) => {
                        const guideTitle =
                            guide.nodePath.length > 1
                                ? `${guide.tree.TITLE} - ${guide.nodePath[guide.nodePath.length - 1].TITLE}`
                                : guide.tree.TITLE;
                        return (
                            <li key={`tree-item-${guideTitle}`} className="guided-answer__last-visited">
                                <a
                                    id="last-visited-link"
                                    onClick={(): void => {
                                        actions.setActiveTree(guide.tree);
                                        guide.nodePath.forEach((node: any) => actions.updateActiveNode(node));
                                        document.body.focus();
                                    }}>
                                    {guideTitle}
                                </a>
                                <TreeItemBottomSection product={guide.tree.PRODUCT} component={guide.tree.COMPONENT} />
                            </li>
                        );
                    })}
                </ul>
            </FocusZone>
        </div>
    );
}
