import type { GuidedAnswerNodeId, GuidedAnswerTreeId } from '@sap/guided-answers-extension-types';

export interface LinkInfo {
    treeId: GuidedAnswerTreeId;
    nodeIdPath: GuidedAnswerNodeId[];
}

/**
 * Extract tree id and node path from link.
 *
 * @param link - web or vscode link to Guided Answers
 * @returns - tree id and node path. In case the info can not be extracted undefined is returned
 */
export function extractLinkInfo(link: string): LinkInfo | undefined {
    const fragmentRegExp = /#\/tree\/(\d*)($|\/$|\/actions\/([\d:]*))$/;

    try {
        const match = fragmentRegExp.exec(link.trim());
        if (Array.isArray(match) && match.length > 1 && typeof match[1] === 'string') {
            const treeId = parseInt(match[1], 10);
            const nodeIdPath =
                match.length > 3 && typeof match[3] === 'string'
                    ? match[3].split(':').map((node) => parseInt(node, 10))
                    : [];
            return { treeId, nodeIdPath };
        }
    } catch {
        // if information can't be extracted we return undefined
    }

    return undefined;
}

export const focusOnElement = (buttonSelector: string): void => {
    requestAnimationFrame(() => {
        const button = document.querySelector(buttonSelector) as HTMLElement;
        if (button) {
            button.focus();
        }
    });
};
