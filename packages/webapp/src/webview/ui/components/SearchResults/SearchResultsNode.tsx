import type { ReactElement } from 'react';
import React from 'react';
import { useSelector } from 'react-redux';
import { UIIcon, UiIcons } from '@sap-ux/ui-components';
import type { AppState, GuidedAnswerTreeSearchAction } from '../../../types';

/**
 * Search results node item for Guided Answers Extension app.
 *
 * @param props - properties containing node
 * @param props.node - Guided Answers Node search hit
 * @param props.onClick - Node onClick handler
 * @returns - react elements for the search results node item
 */
export function SearchResultsNode({
    node,
    onClick
}: {
    node: GuidedAnswerTreeSearchAction;
    onClick: React.MouseEventHandler<HTMLButtonElement>;
}): ReactElement {
    const appState = useSelector<AppState, AppState>((state) => state);
    const isBookmark = !!Object.keys(appState.bookmarks).find(
        (key) => key.startsWith(`${node.TREE_ID}-`) && key.endsWith(`${node.NODE_ID}`)
    );

    console.log(node.DETAIL);

    // the API as of now returns descriptions with HTML tags, complete and incomplete,
    // we should remove them
    // const trimmed = node.DETAIL.replace('')
    // const cleanerDiv = document.createElement('div');
    // cleanerDiv.innerHTML = node.DETAIL;
    // const cleanedDetail = cleanerDiv.innerText;
    // console.log('cleaned:', cleanedDetail);

    return (
        <li className="guided-answer__search-results__node" role="option">
            <button id="search-result-node-button" onClick={onClick}>
                <div className="guided-answer__search-results__node__indent"></div>
                <div>
                    <h3 className="guided-answer__search-results__node__title">
                        <span dangerouslySetInnerHTML={{ __html: node.TITLE }}></span>
                        {isBookmark ? <UIIcon iconName={UiIcons.StarActive} /> : ''}
                    </h3>
                    {/* <p
                        className="guided-answer__search-results__node__detail"
                        dangerouslySetInnerHTML={{ __html: node.DETAIL }}></p> */}
                    <p className="guided-answer__search-results__node__detail">{node.DETAIL}</p>
                </div>
            </button>
        </li>
    );
}
