import type { GuidedAnswerNodeId, GuidedAnswerTreeId } from '@sap/guided-answers-extension-types';
import type { StartOptions } from '../types';

const fragmentRegExp = /#\/tree\/(\d*)($|\/$|\/actions\/([\d:]*))$/;

/**
 * Extract tree id and node path from link.
 *
 * @param link - web or vscode link to Guided Answers
 * @returns - tree id and, if present, node path. In case the info can not be extracted undefined is returned
 */
export function extractLinkInfo(link: string): StartOptions | undefined {
    let treeId: GuidedAnswerTreeId | undefined;
    let nodeIdPath: GuidedAnswerNodeId[] | undefined;
    try {
        const match = link.trim().match(fragmentRegExp);
        if (Array.isArray(match) && match.length > 1 && typeof match[1] === 'string') {
            treeId = parseInt(match[1], 10);
            nodeIdPath =
                match.length > 3 && typeof match[3] === 'string'
                    ? match[3].split(':').map((node) => parseInt(node, 10))
                    : undefined;
        }
    } catch {
        // if information can't be extracted we return undefined
    }
    return treeId !== undefined
        ? {
              treeId,
              nodeIdPath
          }
        : undefined;
}

/**
 * Generate link to this vscode extension with start parameters.
 *
 * @param startOptions - start options including tree id and optionally node path
 * @returns - link
 */
export function generateExtensionLink(startOptions: StartOptions): string {
    const tree = `/tree/${startOptions.treeId}`;
    const nodes = startOptions?.nodeIdPath ? `/actions/${startOptions.nodeIdPath.join(':')}` : '';
    return `vscode://saposs.sap-guided-answers-extension#${tree}${nodes}`;
}

/**
 * Generate web link to Guided Answers tree and node path.
 *
 * @param apiHost - API host including protocol, like https://ga.support.sap.com
 * @param startOptions - start options including tree id and optionally node path
 * @returns - link
 */
export function generateWebLink(apiHost: string, startOptions: StartOptions): string {
    const tree = `/tree/${startOptions.treeId}`;
    const nodes = startOptions?.nodeIdPath ? `/actions/${startOptions.nodeIdPath.join(':')}` : '';
    return `${apiHost}/dtp/viewer/index.html#${tree}${nodes}`;
}
