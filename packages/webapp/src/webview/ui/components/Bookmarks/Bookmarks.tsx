import type { ReactElement } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../../types';
import { actions } from '../../../state';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import { VscStarFull } from 'react-icons/vsc';
import { TreeItemBottomSection } from '../TreeItemBottomSection';
import type { Bookmarks as BookmarksType } from '@sap/guided-answers-extension-types';

/**
 * Shows list of bookmarks.
 *
 * @returns - react elements for bookmarks view
 */
export function Bookmarks(): ReactElement {
    const bookmarks = useSelector<AppState, BookmarksType>((state) => state.bookmarks);

    return (
        <div>
            <h3>
                <VscStarFull className="bookmark-icon-bookmarked" /> Bookmarks
            </h3>
            <FocusZone direction={FocusZoneDirection.bidirectional} isCircularNavigation={true}>
                <ul className="striped-list-bookmarks" role="listbox">
                    {Object.keys(bookmarks).map((bookmarkKey) => {
                        const bookmark = bookmarks[bookmarkKey];
                        return (
                            <li
                                key={`tree-item-${bookmark.tree.TREE_ID}${bookmark.nodePath
                                    .map((n) => n.NODE_ID)
                                    .join('-')}`}
                                className="tree-item"
                                role="option">
                                <button
                                    className="guided-answer__tree"
                                    onClick={(): void => {
                                        actions.setActiveTree(bookmark.tree);
                                        bookmark.nodePath.forEach((node) => actions.updateActiveNode(node));
                                        actions.synchronizeBookmark(bookmark);
                                        document.body.focus();
                                    }}>
                                    <div className="guided-answer__tree__ul">
                                        <h3 className="guided-answer__tree__title">
                                            {bookmark.tree.TITLE}
                                            {' - '}
                                            {bookmark.nodePath[bookmark.nodePath.length - 1].TITLE}
                                        </h3>
                                        <TreeItemBottomSection tree={bookmark.tree} />
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
