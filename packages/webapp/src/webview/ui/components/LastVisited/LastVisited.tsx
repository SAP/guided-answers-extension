import type { ReactElement } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import type { AppState } from '../../../types';
import { actions } from '../../../state';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import { VscHistory } from 'react-icons/vsc';
import { TreeItemBottomSection } from '../TreeItemBottomSection';
import type { LastVisitedGuides as LastVisitedGuidesType, LastVisitedGuide } from '@sap/guided-answers-extension-types';

/**
 * Shows list of Last Visited Guides.
 *
 * @returns - react elements for LastVisitedGuides view
 */
export function LastVisited(): ReactElement {
    const lastVisitedGuides = useSelector<AppState, LastVisitedGuidesType>((state) => state.lastVisitedGuides);
    if (lastVisitedGuides.length === 0) {
        return <></>;
    }
    return (
        <div>
            <h3 style={{ display: 'flex', alignItems: 'center' }}>
                <VscHistory />
                <span style={{ margin: '0 5px' }}>Last visited</span>
            </h3>
            <FocusZone direction={FocusZoneDirection.bidirectional} isCircularNavigation={true}>
                <ul className="striped-list-items" role="listbox">
                    {lastVisitedGuides.slice(-1).map((lastVisitedGuidesKey: any) => {
                        const lastVisitedGuide: LastVisitedGuide =
                            lastVisitedGuidesKey[Object.keys(lastVisitedGuidesKey)[0]];
                        return (
                            <li
                                key={`tree-item-${lastVisitedGuide.tree.TREE_ID}${lastVisitedGuide.nodePath
                                    .map((n: { NODE_ID: any }) => n.NODE_ID)
                                    .join('-')}`}
                                className="tree-item"
                                role="option">
                                <button
                                    className="guided-answer__tree"
                                    onClick={(): void => {
                                        actions.setActiveTree(lastVisitedGuide.tree);
                                        lastVisitedGuide.nodePath.forEach((node: any) =>
                                            actions.updateActiveNode(node)
                                        );
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
