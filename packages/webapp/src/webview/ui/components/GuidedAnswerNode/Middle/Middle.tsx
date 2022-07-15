import React, { ReactElement } from 'react';
import { actions } from '../../../../state';
import type { GuidedAnswerNode as GuidedAnswerNodeType } from '@sap/guided-answers-extension-types';
import '../GuidedAnswerNode.scss';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';

/**
 * @param props - props for middle component
 * @param props.activeNode - array that stores GuidedAnswers node objects
 * @param props.enhancedBody - a react element that is rendered if enhancements are present in the node
 * @returns - The middle react element
 */
export function Middle(props: {
    activeNode: GuidedAnswerNodeType;
    enhancedBody: ReactElement | undefined | null;
}): ReactElement {
    return (
        <div id="middle" className="column">
            <h1>{props.activeNode.TITLE}</h1>
            <div id="hr"></div>
            {props.enhancedBody ? (
                <FocusZone direction={FocusZoneDirection.vertical} isCircularNavigation={true} role="grid">
                    {props.enhancedBody}
                </FocusZone>
            ) : (
                <div className="content" dangerouslySetInnerHTML={{ __html: props.activeNode.BODY }}></div>
            )}
            <p className="guided-answer__node__question">{props.activeNode.QUESTION}</p>
            <FocusZone direction={FocusZoneDirection.bidirectional} isCircularNavigation={true} role="grid">
                <div className="guided-answer__node">
                    {props.activeNode.EDGES.map((edge, index) => (
                        <button
                            key={`edge_button${index}`}
                            className="guided-answer__node__edge"
                            onClick={(): void => {
                                actions.selectNode(edge.TARGET_NODE);
                            }}>
                            {edge.LABEL}
                        </button>
                    ))}
                </div>
            </FocusZone>
        </div>
    );
}
