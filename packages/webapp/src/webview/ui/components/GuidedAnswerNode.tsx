import { default as parse, DOMNode, Element, Text } from 'html-react-parser';
import React, { ReactElement } from 'react';
import { GuidedAnswerNode, HTML_ENHANCEMENT_DATA_ATTR_MARKER } from '@sap/guided-answers-extension-types';
import { useSelector } from 'react-redux';
import { actions } from '../../state';
import { AppState } from '../../types';
import './GuidedAnswerNode.scss';
import { GuidedAnswerNavPath } from './GuidedAnswerNavPath';

/**
 * Replacer function for html-react-parser's replace function. If an element was marked, replace it with  link <a>
 * The command JSON is in the data-* attribute.
 *
 * @param domNode - current DOM node from html-react-parser
 * @returns - undefined if nothing to replace; the new node (<a>) in case of replacement
 */
function replace(domNode: DOMNode): JSX.Element | undefined {
    if (domNode.type === 'tag') {
        const domElement: Element = domNode as Element;
        const dataCommandString = domElement?.attribs?.[HTML_ENHANCEMENT_DATA_ATTR_MARKER];
        if (dataCommandString) {
            try {
                const command = JSON.parse(decodeURIComponent(dataCommandString));
                const textContent = domElement?.firstChild?.type === 'text' ? (domElement.firstChild as Text).data : '';
                if (command) {
                    return (
                        <a
                            href="javascript:void(0)"
                            onClick={(): void => {
                                actions.executeCommand(command);
                            }}>
                            {textContent}
                        </a>
                    );
                }
            } catch (error) {
                console.error(error);
            }
        }
    }
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
function getContent(activeNode: GuidedAnswerNode): ReactElement {
    const enhancedBody = hasEnhancements(activeNode.BODY) ? enhanceBodyHtml(activeNode.BODY) : null;
    const middle = (
        <div id="middle" className="column">
            <h1>
                {activeNode.TITLE} <span className="light-text">#{activeNode.NODE_ID}</span>
            </h1>
            {enhancedBody ? enhancedBody : <div dangerouslySetInnerHTML={{ __html: activeNode.BODY }}></div>}
            <p className="guided-answer__node__question">{activeNode.QUESTION}</p>
            <div className="guided-answer__node">
                {activeNode.EDGES.map((edge, index) => (
                    <div
                        key={`edge_button${index}`}
                        className="guided-answer__node__edge"
                        onClick={(): void => {
                            actions.selectNode(edge.TARGET_NODE);
                        }}>
                        {edge.LABEL}
                    </div>
                ))}
            </div>
        </div>
    );
    const right = activeNode.COMMANDS ? (
        <div id="right" className="column">
            <div className="guided-answer__node__commands">
                {activeNode.COMMANDS
                    ? activeNode.COMMANDS.map((command, index) => (
                          <div className="guided-answer__node__command">
                              <div className="guided-answer__node__command__header">
                                  {/* <div className="guided-answer__node__command__header__icon">
                              {command.icon}
                          </div> */}
                                  <div className="guided-answer__node__command__header__label">{command.label}</div>
                              </div>

                              <div
                                  key={`command-${index}`}
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
    ) : null;

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
    const nodes = useSelector<AppState, GuidedAnswerNode[]>((state) => state.activeGuidedAnswerNode);
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
