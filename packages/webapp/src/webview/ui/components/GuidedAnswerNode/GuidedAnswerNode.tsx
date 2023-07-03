import { default as parse } from 'html-react-parser';
import type { DOMNode, Element } from 'html-react-parser';
import React from 'react';
import type { ReactElement } from 'react';
import type {
    Command,
    GuidedAnswerNode as GuidedAnswerNodeType,
    GuidedAnswerTree
} from '@sap/guided-answers-extension-types';
import { HTML_ENHANCEMENT_DATA_ATTR_MARKER } from '@sap/guided-answers-extension-types';
import { useSelector } from 'react-redux';
import { actions } from '../../../state';
import type { AppState } from '../../../types';
import './GuidedAnswerNode.scss';
import { GuidedAnswerNavPath } from '../GuidedAnswerNavPath';
import { Middle } from './Middle';
import { Right } from './Right';

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
                const textContent = domElement?.firstChild?.type === 'text' ? domElement.firstChild.data : '';
                if (command) {
                    result = (
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
 * Render the react elements to display a Guided Answers node.
 *
 * @returns - react element of Guided Answers node
 */
export function GuidedAnswerNode(): ReactElement {
    const nodes = useSelector<AppState, GuidedAnswerNodeType[]>((state) => state.activeGuidedAnswerNode);
    const tree = useSelector<AppState, GuidedAnswerTree | undefined>((state) => state.activeGuidedAnswer);

    if (!tree) {
        // No active tree, nothing we can do here
        return <></>;
    }

    const activeNode = nodes[nodes.length - 1];

    if (activeNode) {
        const enhancedBody = hasEnhancements(activeNode.BODY) ? enhanceBodyHtml(activeNode.BODY) : null;

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
