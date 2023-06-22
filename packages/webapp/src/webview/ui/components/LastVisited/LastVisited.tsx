import type { ReactElement } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import type { AppState } from '../../../types';
import { actions } from '../../../state';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import { VscStarFull } from 'react-icons/vsc';
import { TreeItemBottomSection } from '../TreeItemBottomSection';
import type { LastVisitedGuides as LastVisitedGuidesType } from '@sap/guided-answers-extension-types';

/**
 * Shows list of Last Visited Guides.
 *
 * @returns - react elements for LastVisitedGuides view
 */
export function LastVisited(): ReactElement {
    const lastVisitedGuides = useSelector<AppState, LastVisitedGuidesType>((state) => state.lastVisitedGuides);

    return (
        <div>
            <h3>Last visited</h3>
            <FocusZone direction={FocusZoneDirection.bidirectional} isCircularNavigation={true}>
                <ul className="striped-list-bookmarks" role="listbox">
                    {Object.keys(lastVisitedGuides).map((lastVisitedGuidesKey) => {
                        const lastVisitedGuide = lastVisitedGuides[lastVisitedGuidesKey];
                        return (
                            <li
                                key={`tree-item-${lastVisitedGuide.tree.TREE_ID}${lastVisitedGuide.nodePath
                                    .map((n) => n.NODE_ID)
                                    .join('-')}`}
                                className="tree-item"
                                role="option">
                                <button
                                    className="guided-answer__tree"
                                    onClick={(): void => {
                                        actions.setActiveTree(lastVisitedGuide.tree);
                                        lastVisitedGuide.nodePath.forEach((node) => actions.updateActiveNode(node));
                                        document.body.focus();
                                    }}>
                                    <div className="guided-answer__tree__ul">
                                        <h3 className="guided-answer__tree__title">
                                            {lastVisitedGuide.tree.TITLE}
                                            {' - '}
                                            {lastVisitedGuide.nodePath[lastVisitedGuide.nodePath.length - 1].TITLE}
                                        </h3>
                                        <TreeItemBottomSection tree={lastVisitedGuide.tree} />
                                    </div>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </FocusZone>
        </div>
    );
}
