import { GuidedAnswerNode } from '@sap/guided-answers-extension-types';
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { actions } from '../../../state';
import { AppState } from '../../../types';
import './GuidedAnswerNavPath.scss';

/**
 * Renders and return the navigation section.
 *
 * @returns - react element for navigation section
 */
export function GuidedAnswerNavPath(): ReactElement {
    const nodes = useSelector<AppState, GuidedAnswerNode[]>((state) => state.activeGuidedAnswerNode);
    const activeNode = nodes[nodes.length - 1];
    const lastIndex = nodes.length - 1;

    if (activeNode) {
        return (
            <nav className="container">
                {nodes.map((node, i) => {
                    return (
                        <div key={`timeline-block-${i}`} className="timeline-block">
                            {i !== lastIndex ? <div className="vertical-line"></div> : <></>}
                            <div
                                className={`timeline-content ${
                                    i === lastIndex ? 'timeline-content-bottom-border' : ''
                                }`}
                                onClick={(): void => {
                                    actions.updateActiveNode(node);
                                }}>
                                <div className="timeline__path">
                                    <span className="timeline-content-title-small">{i + 1}</span>
                                    <span className={`timeline-content-title-large ${i === 0 ? 'bold-text' : ''}`}>
                                        {node.TITLE}
                                    </span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </nav>
        );
    }
    return <></>;
}
