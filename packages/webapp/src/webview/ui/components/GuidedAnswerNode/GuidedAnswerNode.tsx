import { default as parse, DOMNode, Element, Text } from 'html-react-parser';
import React, { ReactElement } from 'react';
import type { Command, GuidedAnswerNode as GuidedAnswerNodeType } from '@sap/guided-answers-extension-types';
import { HTML_ENHANCEMENT_DATA_ATTR_MARKER } from '@sap/guided-answers-extension-types';
import { useSelector } from 'react-redux';
import { actions } from '../../../state';
import { AppState } from '../../../types';
import './GuidedAnswerNode.scss';
import { GuidedAnswerNavPath } from '../GuidedAnswerNavPath';
import { FeedbackInterface } from '../FeedbackInterface';

/**
 * Replacer function for html-react-parser's replace function. If an element was marked, replace it with  link <a>
 * The command JSON is in the data-* attribute.
 *
 * @param domNode - current DOM node from html-react-parser
 * @returns - undefined if nothing to replace; the new node (<a>) in case of replacement
 */
function replace(domNode: DOMNode): ReactElement | undefined {
    let result: ReactElement | undefined;
    if (domNode.type === 'tag') {
        const domElement: Element = domNode as Element;
        const dataCommandString = domElement?.attribs?.[HTML_ENHANCEMENT_DATA_ATTR_MARKER];
        if (dataCommandString) {
            try {
                const command = JSON.parse(decodeURIComponent(dataCommandString)) as Command;
                const textContent = domElement?.firstChild?.type === 'text' ? (domElement.firstChild as Text).data : '';
                if (command) {
                    result = (
                        <span
                            title={command.description}
                            className="enhancement-link"
                            onClick={(): void => {
                                actions.executeCommand(command);
                            }}>
                            {textContent}
                        </span>
                    );
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
    return result;
}

/**
 * Process the enhancements in an HTML string, which includes parsing the HTML and replacing the respective nodes.
 *
 * @param htmlString - HTML string
 * @returns - react elements including enhancements
 */
function enhanceBodyHtml(htmlString: string): ReactElement | undefined {
    let result;
    try {
        result = parse(htmlString, { replace });
    } catch (error) {
        console.error(error);
    }
    return result as ReactElement;
}

/**
 * Check if an HTML string contains an enhancement.
 *
 * @param htmlString - HTML string
 * @returns true: has enhancementsl; false: no enhancements
 */
function hasEnhancements(htmlString: string): boolean {
    return typeof htmlString === 'string' && htmlString.includes(HTML_ENHANCEMENT_DATA_ATTR_MARKER);
}

/**
 * Return the navigation section.
 *
 * @returns - react elements for navigation
 */
function getNavigationSection(): ReactElement {
    return (
        <div id="left" className="column">
            <GuidedAnswerNavPath />
        </div>
    );
}

/**
 * Return the content for a Guided Answers node, which consists of the middle part, the actual Guided Answers text
 * and, if present, the right part with additional commands.
 *
 * @param activeNode - the active Guided Answers node
 * @returns - react element for content
 */
function getContent(activeNode: GuidedAnswerNodeType): ReactElement {
    const enhancedBody = hasEnhancements(activeNode.BODY) ? enhanceBodyHtml(activeNode.BODY) : null;
    const appState = useSelector<AppState, AppState>((state) => state);

    const handleClick = (link: string): void => {
        window.open(link);
    };

    const middleNotSolved = (
        <div id="middle" className="column">
            <h1>Issue is not resolved</h1>
            <div id="hr"></div>
            <p className="guided-answer__node__question">
                <strong>We are sorry to hear that your issue is not yet resolved.</strong>
            </p>
            <p className="guided-answer__node__question">There are several options for getting further assistance:</p>
            <div className="guided-answer__node">
                <div className="guided-answer__node__edges">
                    <div onClick={(): void => handleClick('https://launchpad.support.sap.com/#/expertchat/create')}>
                        Start an Expert Chat
                    </div>
                    <div>Schedule an Expert</div>
                    <div>Open an Incident</div>
                    <div>Ask the SAP Community</div>
                </div>
            </div>
        </div>
    );
    const middleStandard = (
        <div id="middle" className="column">
            <h1>{activeNode.TITLE}</h1>
            <div id="hr"></div>
            {enhancedBody ? (
                enhancedBody
            ) : (
                <div className="content" dangerouslySetInnerHTML={{ __html: activeNode.BODY }}></div>
            )}
            <p className="guided-answer__node__question">{activeNode.QUESTION}</p>
            <div className="guided-answer__node">
                {activeNode.EDGES.length > 0 ? (
                    activeNode.EDGES.map((edge, index) => (
                        <div
                            key={`edge_button${index}`}
                            className="guided-answer__node__edge"
                            onClick={(): void => {
                                actions.selectNode(edge.TARGET_NODE);
                            }}>
                            {edge.LABEL}
                        </div>
                    ))
                ) : (
                    <FeedbackInterface />
                )}
            </div>
        </div>
    );

    const middle = appState.guideFeedback === false ? middleNotSolved : middleStandard;

    // );

    // const notSolvedButtons = [
    //     { option: 'Start an Expert Chat', link: 'https://launchpad.support.sap.com/#/expertchat/create' },
    //     { option: 'Schedule an Exper', link: 'https://launchpad.support.sap.com/#/sae' },
    //     { option: 'Open an Incident ', link: 'https://launchpad.support.sap.com/#/incident/create' },
    //     { option: 'Ask the SAP Community', link: 'https://answers.sap.com/index.html' }
    // ];

    let right = null;
    if (activeNode.COMMANDS) {
        right = (
            <div id="right" className="column">
                <div className="guided-answer__node__commands">
                    {activeNode.COMMANDS
                        ? activeNode.COMMANDS.map((command, index) => (
                              <div className="guided-answer__node__command" key={`command-${index}`}>
                                  <div className="guided-answer__node__command__header">
                                      <div className="guided-answer__node__command__header__label">{command.label}</div>
                                  </div>
                                  <div
                                      className="guided-answer__node__command__description"
                                      onClick={(): void => {
                                          actions.executeCommand(command);
                                      }}>
                                      {command.description}
                                  </div>
                              </div>
                          ))
                        : ''}
                </div>
            </div>
        );
    }
    return right ? (
        <div className="main-container">
            {middle}
            {right}
        </div>
    ) : (
        middle
    );
}

/**
 * Render the react elements to display a Guided Answers node.
 *
 * @returns - react element of Guided Answers node
 */
export function GuidedAnswerNode(): ReactElement {
    const nodes = useSelector<AppState, GuidedAnswerNodeType[]>((state) => state.activeGuidedAnswerNode);
    const activeNode = nodes[nodes.length - 1];
    return activeNode ? (
        <section className="guided-answer__node__body">
            {getNavigationSection()}
            {getContent(activeNode)}
        </section>
    ) : (
        <></>
    );
}
