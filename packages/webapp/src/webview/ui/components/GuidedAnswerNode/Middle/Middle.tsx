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
    const focusToHome = () => {
        const homeButton = document.body.querySelector('.home-icon') as HTMLElement;
        if (homeButton) {
            homeButton.focus();
        }
    };
    return (
        <div id="middle" className="column">
            <div className="body_container">
                <header>{props.activeNode.TITLE}</header>
                <div id="hr"></div>
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
            </div>
            <FocusZone direction={FocusZoneDirection.bidirectional} isCircularNavigation={true}>
                <div className="guided-answer__node">
                    {props.activeNode.EDGES.map((edge, index) => (
                        <button
                            key={`edge_button${index}`}
                            className="guided-answer__node__edge"
                            onClick={(): void => {
                                actions.selectNode(edge.TARGET_NODE);
                                focusToHome();
                            }}>
                            {edge.LABEL}
                        </button>
                    ))}
                </div>
            </FocusZone>
        </div>
    );
}
