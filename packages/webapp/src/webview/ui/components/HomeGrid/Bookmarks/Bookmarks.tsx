import type { ReactElement } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import i18next from 'i18next';
import type { AppState } from '../../../../types';
import { actions } from '../../../../state';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import { UIIcon, UiIcons, UIIconButton } from '@sap-ux/ui-components';
import { TreeItemBottomSection } from '../../TreeItemBottomSection';
import type { Bookmarks as BookmarksType, Bookmark } from '@sap/guided-answers-extension-types';
import './Bookmarks.scss';

/**
 * Shows list of bookmarks.
 *
 * @returns - react elements for bookmarks view
 */
export function Bookmarks(): ReactElement {
    const storedBookmarks = useSelector<AppState, BookmarksType>((state) => state.bookmarks);
    const localBookmarks = JSON.parse(JSON.stringify(storedBookmarks));

    const goToBookmark = (bookmark: Bookmark) => {
        actions.setActiveTree(bookmark.tree);
        bookmark.nodePath.forEach((node) => actions.updateActiveNode(node));
        actions.synchronizeBookmark(bookmark);
        document.body.focus();
    };

    const toggleBookmark = (bookmark: Bookmark) => {
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
            <h3 className="guided-answer__home-grid__section__title">
                <UIIcon iconName={UiIcons.StarActive} />
                <span>Bookmarks</span>
            </h3>
            <FocusZone direction={FocusZoneDirection.bidirectional} isCircularNavigation={true}>
                <ul className="guided-answer__home-grid__section__list">
                    {Object.keys(localBookmarks).map((bookmarkKey) => {
                        const bookmark = localBookmarks[bookmarkKey];
                        const bookmarkTitle =
                            bookmark.nodePath.length > 1
                                ? `${bookmark.tree.TITLE} - ${bookmark.nodePath[bookmark.nodePath.length - 1].TITLE}`
                                : bookmark.tree.TITLE;
                        const isBookmarked = !!storedBookmarks[bookmarkKey];
                        return (
                            <li key={`tree-item-${bookmarkTitle}`} className="guided-answer__bookmark">
                                <div className="guided-answer__bookmark__title">
                                    <a
                                        id="goto-bookmark-button"
                                        onClick={(): void => goToBookmark(bookmark)}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                goToBookmark(bookmark);
                                            }
                                        }}>
                                        {bookmarkTitle}
                                    </a>
                                    <UIIconButton
                                        id="toggle-bookmark-button"
                                        title={
                                            isBookmarked
                                                ? i18next.t('REMOVE_FROM_BOOKMARKS')
                                                : i18next.t('BOOKMARK_THIS_GUIDE')
                                        }
                                        iconProps={{ iconName: isBookmarked ? UiIcons.StarActive : UiIcons.Star }}
                                        onClick={() => toggleBookmark(bookmark)}></UIIconButton>
                                </div>
                                <TreeItemBottomSection
                                    product={bookmark.tree.PRODUCT}
                                    component={bookmark.tree.COMPONENT}
                                />
                            </li>
                        );
                    })}
                </ul>
            </FocusZone>
        </div>
    );
}
