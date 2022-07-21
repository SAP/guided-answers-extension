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
    const focusToAnchor = () => {
        requestAnimationFrame(() => {
            const elements = document.querySelector('#middle');
            const container: any = elements?.querySelectorAll('a, button');
            const firstElement = container[0] as HTMLElement;

            if (firstElement) {
                firstElement.focus();
            }
        });
    };
    return (
        <div id="middle" className="column">
            <header>{props.activeNode.TITLE}</header>
            <div id="hr"></div>
            {focusToAnchor()}
            {props.enhancedBody ? (
                <FocusZone direction={FocusZoneDirection.vertical} isCircularNavigation={true}>
                    {props.enhancedBody}
                </FocusZone>
            ) : (
                <FocusZone direction={FocusZoneDirection.vertical} isCircularNavigation={true}>
                    <div className="content" dangerouslySetInnerHTML={{ __html: props.activeNode.BODY }}></div>
                </FocusZone>
            )}
            <p className="guided-answer__node__question">{props.activeNode.QUESTION}</p>
            <FocusZone direction={FocusZoneDirection.bidirectional} isCircularNavigation={true}>
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
