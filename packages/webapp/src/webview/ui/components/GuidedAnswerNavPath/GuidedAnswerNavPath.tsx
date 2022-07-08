import { GuidedAnswerNode } from '@sap/guided-answers-extension-types';
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { actions } from '../../../state';
import { AppState } from '../../../types';
import './GuidedAnswerNavPath.scss';
import i18next from 'i18next';

/**
 * Renders and return the navigation section.
 *
 * @returns - react element for navigation section
 */
export function GuidedAnswerNavPath(): ReactElement {
    const nodes = useSelector<AppState, GuidedAnswerNode[]>((state) => state.activeGuidedAnswerNode);
    const isSolved = useSelector<AppState, boolean | null>((state) => state.guideFeedback);
    let activeNode = nodes[nodes.length - 1];
    let lastIndex = nodes.length - 1;

    if (isSolved === false && isSolved !== null) {
        nodes.push({ NODE_ID: 99999, TITLE: i18next.t('ISSUE_IS_NOT_RESOLVED'), BODY: '', QUESTION: '', EDGES: [] });
        activeNode = nodes[nodes.length - 1];
        lastIndex = nodes.length - 1;
    }

    if (activeNode) {
        return (
            <nav className="container">
                {nodes.map((node, i) => {
                    return (
                        <div key={`timeline-block-${i}`} className="timeline-block">
                            <button
                                className={`timeline-content ${
                                    i === lastIndex ? 'timeline-content-bottom-border' : ''
                                }`}
                                onClick={(): void => {
                                    actions.updateActiveNode(node);
                                }}>
                                <div className="timeline__path" title={node.TITLE}>
                                    <span className="timeline-content-title-small bold-text">{i + 1}</span>
                                    <span className={`timeline-content-title-large ${i === 0 ? 'bold-text' : ''}`}>
                                        {node.TITLE}
                                    </span>
                                </div>
                            </button>
                            {i !== lastIndex ? <div className="vertical-line"></div> : <></>}
                        </div>
                    );
                })}
            </nav>
        );
    }
    return <></>;
}
