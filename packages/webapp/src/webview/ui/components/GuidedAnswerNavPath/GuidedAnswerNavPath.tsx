import { GuidedAnswerNode } from '@sap/guided-answers-extension-types';
import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { actions } from '../../../state';
import { AppState } from '../../../types';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import './GuidedAnswerNavPath.scss';
import { focusOnElement } from '../utils';

/**
 * Renders and return the navigation section.
 *
 * @returns - react element for navigation section
 */
export function GuidedAnswerNavPath(): ReactElement {
    let firstTimeFocus: boolean;
    const nodes = useSelector<AppState, GuidedAnswerNode[]>((state) => state.activeGuidedAnswerNode);
    const isSolved = useSelector<AppState, boolean | null>((state) => state.guideFeedback);
    let activeNode = nodes[nodes.length - 1];
    let lastIndex = nodes.length - 1;
    let lastBlockBorderStyle =
        isSolved === false ? 'timeline-content-bottom-border-not-solved' : 'timeline-content-bottom-border';

    if (activeNode) {
        firstTimeFocus = true;
        return (
            <nav className="container">
                <FocusZone
                    direction={FocusZoneDirection.vertical}
                    role="tree"
                    onFocus={() => {
                        if (firstTimeFocus) {
                            focusOnElement('.timeline-content');
                            firstTimeFocus = false;
                        }
                    }}
                    isCircularNavigation={true}>
                    {nodes.map((node, i) => {
                        return (
                            <div key={`timeline-block-${i}`} className="timeline-block" role="treeitem">
                                <button
                                    className={`timeline-content ${i === lastIndex ? lastBlockBorderStyle : ''}`}
                                    onClick={(): void => {
                                        actions.updateActiveNode(node);
                                    }}>
                                    <div className="timeline__path" title={node.TITLE}>
                                        <span className="timeline-content-title-small bold-text">{i + 1}</span>
                                        <span className={`timeline-content-title-large`}>{node.TITLE}</span>
                                    </div>
                                </button>
                                {i !== lastIndex ? <div className="vertical-line"></div> : <></>}
                            </div>
                        );
                    })}
                </FocusZone>
            </nav>
        );
    }
    return <></>;
}
