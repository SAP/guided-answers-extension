import React, { useEffect } from 'react';
import type { ReactElement } from 'react';
import { actions } from '../../../../state';
import type { GuidedAnswerNode } from '@sap/guided-answers-extension-types';
import '../GuidedAnswerNode.scss';
import { FocusZone, FocusZoneDirection } from '@fluentui/react-focus';
import { focusOnElement } from '../../utils';
import { useSelector } from 'react-redux';
import type { AppState } from '../../../../types';
import { FeedbackSection } from '../../FeedbackSection/FeedbackSection';
import NotSolvedMessage from '../../FeedbackSection/NotSolvedMessage/NotSolvedMessage';
import { FeedbackDialogBox } from '../../DialogBoxes/FeedbackDialogBox';
import { FeedbackSentDialogBox } from '../../DialogBoxes/FeedbackSentDialogBox/FeedbackSentDialogBox';

let firstTimeFocus = true;

/**
 * The middle column copoment of the app in the UI.
 *
 * @param props - props for middle component
 * @param props.activeNode - array that stores GuidedAnswers node objects
 * @param props.enhancedBody - a react element that is rendered if enhancements are present in the node
 * @returns - The middle react element
 */
export function Middle(
    props: Readonly<{
        activeNode: GuidedAnswerNode;
        enhancedBody: ReactElement | undefined | null;
    }>
): ReactElement {
    const appState = useSelector<AppState, AppState>((state) => state);
    firstTimeFocus = true;

    useEffect(() => {
        if (appState.activeGuidedAnswer) {
            actions.updateLastVisitedGuide([
                ...appState.lastVisitedGuides,
                {
                    tree: appState.activeGuidedAnswer,
                    nodePath: appState.activeGuidedAnswerNode,
                    createdAt: new Date().toISOString()
                }
            ]);
        }
    }, [props.activeNode.NODE_ID]);

    if (!appState.activeGuidedAnswer) {
        // No active tree, nothing we can do here
        return <></>;
    } else if (appState.guideFeedback === false) {
        return <NotSolvedMessage />;
    } else {
        return (
            <div id="middle">
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
                <FocusZone
                    onFocus={() => {
                        if (firstTimeFocus) {
                            focusOnElement('.guided-answer__node__edge:first-child');
                            firstTimeFocus = false;
                        }
                    }}
                    direction={FocusZoneDirection.bidirectional}
                    isCircularNavigation={true}>
                    <div className="guided-answer__node">
                        {props.activeNode.EDGES.length > 0
                            ? props.activeNode.EDGES.map((edge) => (
                                  <button
                                      key={`edge_button${edge.TARGET_NODE}`}
                                      className="guided-answer__node__edge"
                                      id="edge_button"
                                      onClick={(): void => {
                                          actions.selectNode(edge.TARGET_NODE);
                                          focusOnElement('#home-button');
                                      }}>
                                      {edge.LABEL}
                                  </button>
                              ))
                            : appState.activeGuidedAnswer && appState.activeGuidedAnswerNode && <FeedbackSection />}
                    </div>
                </FocusZone>
                {appState.activeGuidedAnswer && appState.activeGuidedAnswerNode && (
                    <>
                        <FeedbackDialogBox />
                        <FeedbackSentDialogBox />
                    </>
                )}
            </div>
        );
    }
}
