import React from 'react';
import './RelevantNode.scss';
import { actions } from '../../../state';
import { AppState } from '../../../types';
import { useSelector } from 'react-redux';

/**
 * @param props
 * @param props.title
 * @param props.description
 *@returns - react element to show the relevant node
 */
export function RelevantNode(props: { title: string; description: string }) {
    const appState = useSelector<AppState, AppState>((state) => state);

    return (
        <button
            className="guided-answer__tree"
            onClick={(): void => {
                actions.selectNode(appState.guidedAnswerTreeSearchResult.trees[0].FIRST_NODE_ID);
            }}>
            <div className="guided-answer__tree__ul" style={{ width: '100%', padding: '0 15px' }}>
                <div className="bottom-section">
                    <div className="relevant-node">
                        <div className="relevant-node-content">
                            <h4 className="relevant-node-content-title">{props.title}</h4>
                            <p className="relevant-node-content-description">{props.description}</p>
                        </div>
                    </div>
                </div>
            </div>
        </button>
    );
}
