import { default as parse, domToReact } from 'html-react-parser';
import type { DOMNode, Element } from 'html-react-parser';
import React from 'react';
import type { ReactElement } from 'react';
import type { Command, GuidedAnswerNode as GuidedAnswerNodeType } from '@sap/guided-answers-extension-types';
import { HTML_ENHANCEMENT_DATA_ATTR_MARKER } from '@sap/guided-answers-extension-types';
import { useSelector } from 'react-redux';
import { actions } from '../../../state';
import type { AppState } from '../../../types';
import { extractLinkInfo } from '../utils';
import './GuidedAnswerNode.scss';
import { GuidedAnswerNavPath } from '../GuidedAnswerNavPath';
import { Middle } from './Middle';
import { Right } from './Right';

/**
 * Replacer function for html-react-parser's replace function.
 * The command JSON is in the data-* attribute.
 *
 * @param domNode - current DOM node from html-react-parser
 * @returns - undefined if nothing to replace; the new node in case of replacement
 */
function replace(domNode: DOMNode): ReactElement | undefined {
    let result: ReactElement | undefined;
    if (domNode.type === 'tag') {
        const domElement: Element = domNode as Element;

        result = replaceDataCommand(domElement);

        if (!result) {
            result = replaceNodeLink(domElement);
        }
    }
    return result;
}

/**
 *
 * @param element - current Element from html-react-parser
 * @returns - undefined if nothing to replace; the new node in case of replacement
 */
function replaceDataCommand(element: Element): ReactElement | undefined {
    const dataCommandString = element?.attribs?.[HTML_ENHANCEMENT_DATA_ATTR_MARKER];
    if (dataCommandString) {
        try {
            const command = JSON.parse(decodeURIComponent(dataCommandString)) as Command;
            const textContent = element?.firstChild?.type === 'text' ? element.firstChild.data : '';
            if (command) {
                return (
                    <button
                        title={command.description}
                        className="enhancement-link"
                        onClick={(): void => {
                            actions.executeCommand(command);
                        }}>
                        {textContent}
                    </button>
                );
            }
        } catch (error) {
            console.error(error);
        }
    }
    return undefined;
}

/**
 *
 * @param element - current Element from html-react-parser
 * @returns - undefined if nothing to replace; the new node in case of replacement
 */
function replaceNodeLink(element: Element): ReactElement | undefined {
    if (element.name === 'a') {
        const href = element.attribs.href;
        const linkInfo = extractLinkInfo(href);
        if (linkInfo && linkInfo.nodeIdPath.length > 0) {
            return (
                <a
                    href=""
                    onClick={(): void => {
                        actions.navigate({ treeId: linkInfo.treeId, nodeIdPath: linkInfo.nodeIdPath });
                    }}>
                    {domToReact(element.children)}
                </a>
            );
        }
    }
    return undefined;
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
 * Render the react elements to display a Guided Answers node.
 *
 * @returns - react element of Guided Answers node
 */
export function GuidedAnswerNode(): ReactElement {
    const nodes = useSelector<AppState, GuidedAnswerNodeType[]>((state) => state.activeGuidedAnswerNode);

    const activeNode = nodes[nodes.length - 1];

    if (activeNode) {
        const enhancedBody = enhanceBodyHtml(activeNode.BODY);

        return (
            <section className="guided-answer__node__body">
                <div className="guided-answer__node__sidebar">
                    <GuidedAnswerNavPath />
                </div>
                <Middle activeNode={activeNode} enhancedBody={enhancedBody} />
                <div className="guided-answer__node__sidebar">
                    <Right activeNode={activeNode} />
                </div>
            </section>
        );
    } else {
        return <></>;
    }
}
