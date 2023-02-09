import type { GuidedAnswerNodeId, GuidedAnswerTreeId } from '@sap/guided-answers-extension-types';

const fragmentRegExp = new RegExp('#/tree/([0-9]*)($|/$|/actions/([0-9:]*))$');

/**
 * Extract tree id and node path from link.
 *
 * @param link - web or vscode link to Guided Answers
 * @returns - tree id and, if present, node path. In case the info can not be extracted undefined is returned
 */
export function extractLinkInfo(
    link: string
): { treeId: GuidedAnswerTreeId; nodePath?: GuidedAnswerNodeId[] } | undefined {
    let treeId: GuidedAnswerTreeId | undefined;
    let nodePath: GuidedAnswerNodeId[] | undefined;
    try {
        const match = link.match(fragmentRegExp);
        if (match) {
            treeId = match.length > 1 ? parseInt(match[1], 10) : undefined;
            nodePath = match.length > 3 ? match[3].split(':').map((node) => parseInt(node, 10)) : undefined;
        }
    } catch {
        // if information can't be extracted we return undefined
    }
    return treeId !== undefined
        ? {
              treeId,
              nodePath: nodePath
          }
        : undefined;
}
