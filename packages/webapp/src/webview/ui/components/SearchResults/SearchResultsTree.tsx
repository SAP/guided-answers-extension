import type { ReactElement } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import i18next from 'i18next';
import { UIIcon, UiIcons } from '@sap-ux/ui-components';
import type { AppState, GuidedAnswerTreeSearchHit } from '../../../types';
import { TreeItemBottomSection } from '../TreeItemBottomSection';
import { actions } from '../../../state';
import { SearchResultsNode } from './SearchResultsNode';

/**
 * Search results tree item for Guided Answers Extension app.
 *
 * @param props - properties containing tree
 * @param props.tree - Guided Answers Tree search hit
 * @returns - react elements for the search results tree item
 */
export function SearchResultsTree({ tree }: { tree: GuidedAnswerTreeSearchHit }): ReactElement {
    const appState = useSelector<AppState, AppState>((state) => state);
    const isBookmark = !!Object.keys(appState.bookmarks).find((key) => key.startsWith(`${tree.TREE_ID}-`));
    const visibleNodeCount = appState.searchResultVisibleNodeCount[tree.TREE_ID];
    const hiddenNodeCount = tree.ACTIONS.length - visibleNodeCount;

    const goToNode = (nodeId: number) => {
        actions.setActiveTree(tree);
        actions.selectNode(nodeId);
        document.body.focus();
    };

    return (
        <li className="tree-item" role="option">
            <button
                id="search-result-tree-button"
                className="guided-answer__tree"
                onClick={() => goToNode(tree.FIRST_NODE_ID)}>
                <div className="guided-answer__tree__ul">
                    <h3 className="guided-answer__tree__title">
                        {tree.TITLE} {isBookmark ? <UIIcon iconName={UiIcons.StarActive} /> : ''}
                    </h3>
                    <TreeItemBottomSection
                        description={tree.DESCRIPTION}
                        product={tree.PRODUCT}
                        component={tree.COMPONENT}
                    />
                </div>
            </button>

            {tree.ACTIONS.length > 0 && (
                <div className="guided-answer__search-results__node-list">
                    <hr className="guided-answer__search-results__separator" />

                    <ul role="listbox">
                        {tree.ACTIONS.slice(0, visibleNodeCount).map((node) => (
                            <SearchResultsNode
                                key={`node-item-${node.TITLE}`}
                                node={node}
                                onClick={() => goToNode(node.NODE_ID)}
                            />
                        ))}
                    </ul>

                    {hiddenNodeCount > 0 && (
                        <a
                            id="search-result-tree-expand-button"
                            className="guided-answer__search-results__view-more"
                            onClick={() => actions.expandSearchNodesForTree(tree.TREE_ID)}>
                            <UIIcon iconName={UiIcons.ContractNodesSmall} />
                            <span>{i18next.t('VIEW_MORE_RESULTS', { count: hiddenNodeCount })}</span>
                        </a>
                    )}
                </div>
            )}
        </li>
    );
}
