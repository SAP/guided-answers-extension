import type { ReactElement } from 'react';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import i18next from 'i18next';
import type { AppState } from '../../../types';
import { actions } from '../../../state';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import { VscStarFull, VscStarEmpty } from 'react-icons/vsc';
import { TreeItemBottomSection } from '../TreeItemBottomSection';
import type { Bookmarks as BookmarksType, Bookmark } from '@sap/guided-answers-extension-types';
import './Bookmarks.scss';

/**
 * Shows list of bookmarks.
 *
 * @returns - react elements for bookmarks view
 */
export function Bookmarks(): ReactElement {
    const storedBookmarks = useSelector<AppState, BookmarksType>((state) => state.bookmarks);
    const [localBookmarks] = useState<BookmarksType>(JSON.parse(JSON.stringify(storedBookmarks)));

    const goToBookmark = (bookmark: Bookmark) => {
        actions.setActiveTree(bookmark.tree);
        bookmark.nodePath.forEach((node) => actions.updateActiveNode(node));
        actions.synchronizeBookmark(bookmark);
        document.body.focus();
    };

    const toggleBookmark = (e: React.MouseEvent, bookmark: Bookmark) => {
        e.stopPropagation();
        const bookmarkKey = `${bookmark.tree.TREE_ID}-${bookmark.nodePath.map((n) => n.NODE_ID).join(':')}`;
        const newBookmarks: BookmarksType = JSON.parse(JSON.stringify(storedBookmarks));
        if (newBookmarks[bookmarkKey]) {
            delete newBookmarks[bookmarkKey];
        } else {
            newBookmarks[bookmarkKey] = {
                tree: bookmark.tree,
                nodePath: bookmark.nodePath,
                createdAt: new Date().toISOString()
            };
        }
        actions.updateBookmark({ bookmarkKey, bookmarks: newBookmarks });
    };

    return (
        <div>
            <h3 style={{ display: 'flex', alignItems: 'center' }}>
                <VscStarFull className="bookmark-icon-bookmarked" />
                <span style={{ margin: '0 5px' }}>Bookmarks</span>
            </h3>
            <FocusZone direction={FocusZoneDirection.vertical} isCircularNavigation={true}>
                <ul className="striped-list-items" role="listbox">
                    {Object.keys(localBookmarks).map((bookmarkKey) => {
                        const bookmark = localBookmarks[bookmarkKey];
                        const bookmarkTitle =
                            bookmark.nodePath.length > 1
                                ? `${bookmark.tree.TITLE} - ${bookmark.nodePath[bookmark.nodePath.length - 1].TITLE}`
                                : bookmark.tree.TITLE;
                        const isBookmarked = !!storedBookmarks[bookmarkKey];
                        return (
                            <li key={`tree-item-${bookmarkTitle}`} className="tree-item" role="option">
                                <button
                                    className="guided-answer__tree guided-answer__bookmark"
                                    id="goto-bookmark-button"
                                    onClick={(): void => goToBookmark(bookmark)}>
                                    <div className="guided-answer__tree__ul">
                                        <h3 className="guided-answer__tree__title">
                                            <span>{bookmarkTitle}</span>
                                            <button
                                                className="guided-answer__bookmark__button"
                                                id="bookmark-button"
                                                onClick={(e) => toggleBookmark(e, bookmark)}>
                                                {isBookmarked ? (
                                                    <VscStarFull
                                                        className="bookmark-icon-bookmarked"
                                                        title={i18next.t('REMOVE_FROM_BOOKMARKS')}
                                                    />
                                                ) : (
                                                    <VscStarEmpty title={i18next.t('BOOKMARK_THIS_GUIDE')} />
                                                )}
                                            </button>
                                        </h3>
                                        <TreeItemBottomSection
                                            product={bookmark.tree.PRODUCT}
                                            component={bookmark.tree.COMPONENT}
                                        />
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
