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
                    let markerIcon: ReactElement | string = 'null';
                    if (node.EDGES.length === 0) {
                        markerIcon = '▷';
                    } else {
                        markerIcon =
                            i === lastIndex ? (
                                <span
                                    aria-label="check mark"
                                    role="img"
                                    style={{ color: 'var(--vscode-textLink-foreground)' }}>
                                    ▷
                                </span>
                            ) : (
                                '☑'
                            );
                    }
                    return (
                        <div key={`timeline-block-${i}`} className="timeline-block">
                            {i !== lastIndex ? <div className="vertical-line"></div> : <></>}
                            <div className="marker">{markerIcon}</div>
                            <div className="timeline-content">
                                <div className="timeline-content-arrow"></div>
                                <div
                                    className="timeline__path"
                                    onClick={(): void => {
                                        actions.updateActiveNode(node);
                                    }}>
                                    {node.TITLE}
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
