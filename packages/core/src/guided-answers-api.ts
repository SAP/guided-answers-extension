import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { default as xss } from 'xss';
import type {
    APIOptions,
    GuidedAnswerAPI,
    GuidedAnswerNode,
    GuidedAnswerNodeId,
    GuidedAnswerTree,
    GuidedAnswerTreeId,
    HTMLEnhancement,
    NodeEnhancement
} from '@sap/guided-answers-extension-types';
import { HTML_ENHANCEMENT_DATA_ATTR_MARKER } from '@sap/guided-answers-extension-types';

const API_HOST = 'https://ga.support.sap.com';
const NODE_PATH = '/dtp/api/nodes/';
const TREE_PATH = '/dtp/api/trees/';
const IMG_PREFIX = '/dtp/viewer/';

/**
 * Returns API to programmatically access Guided Answers.
 *
 * @param options - options like API host, node enhancements, or html enhancements
 * @returns - API
 */
export function getGuidedAnswerApi(options?: APIOptions): GuidedAnswerAPI {
    const apiHost = options?.apiHost || API_HOST;
    const nodeEnhancements = options?.enhancements?.nodeEnhancements || [];
    const htmlEnhancements = options?.enhancements?.htmlEnhancements || [];

    return {
        getNodeById: async (id: GuidedAnswerNodeId): Promise<GuidedAnswerNode> =>
            enhanceNode(await getNodeById(apiHost, id), nodeEnhancements, htmlEnhancements),
        getTreeById: async (id: GuidedAnswerTreeId): Promise<GuidedAnswerTree> => getTreeById(apiHost, id),
        getTrees: async (query?: string): Promise<GuidedAnswerTree[]> => getTrees(apiHost, query),
        getNodePath: async (nodeIdPath: GuidedAnswerNodeId[]): Promise<GuidedAnswerNode[]> => {
            let nodes = await getNodePath(apiHost, nodeIdPath);
            nodes = nodes.map((node) => enhanceNode(node, nodeEnhancements, htmlEnhancements));
            return nodes;
        }
    };
}

/**
 * Convert <img src="...">-tags in body to point to absolute path.
 *
 * @param body - string content of Guided Answers node's BODY, which is HTML
 * @param host - Guided Answer API host
 * @returns - html string with converted <img>-tags
 */
function convertImageSrc(body: string, host: string): string {
    return body.replace(/<img src="services\/backend\.xsjs/gi, `<img src="${host}${IMG_PREFIX}services/backend.xsjs`);
}

/**
 * Return a Guided Answer node by ID.
 *
 * @param host - Guided Answer API host
 * @param id - Guided Answer node ID
 * @returns - Guided Answer node structure
 */
async function getNodeById(host: string, id: GuidedAnswerNodeId): Promise<GuidedAnswerNode> {
    const url = `${host}${NODE_PATH}${id}`;
    const response: AxiosResponse<GuidedAnswerNode> = await axios.get<GuidedAnswerNode>(url);
    const node = response.data;
    if (typeof node.BODY === 'string') {
        node.BODY = xss(convertImageSrc(node.BODY, host));
    }
    return node;
}

/**
 * Return a Guided Answer tree by ID.
 *
 * @param host - Guided Answer API host
 * @param id - Guided Answer tree ID
 * @returns - Guided Answer tree structure
 */
async function getTreeById(host: string, id: GuidedAnswerTreeId): Promise<GuidedAnswerTree> {
    let tree: GuidedAnswerTree;
    const url = `${host}${TREE_PATH}${id}`;
    const response: AxiosResponse<GuidedAnswerTree[]> = await axios.get<GuidedAnswerTree[]>(url);
    if (Array.isArray(response.data) && response.data.length === 1) {
        tree = response.data[0];
    } else {
        throw Error(`Guided Answers tree '${id}' not found. Call URL was '${url}'`);
    }
    return tree;
}

/**
 * Returns an array of Guided Answers trees.
 *
 * @param host - Guided Answer API host
 * @param query - query string
 * @returns - Array of Guided Answer trees
 */
async function getTrees(host: string, query?: string): Promise<GuidedAnswerTree[]> {
    const url = `${host}${TREE_PATH}${query ? query : ''}`;
    const response: AxiosResponse<GuidedAnswerTree[]> = await axios.get<GuidedAnswerTree[]>(url);
    const treesRaw = Array.isArray(response.data) ? response.data : [response.data];

    // when we get data as search results, TREE_ID and NODE_ID are string. When we get a single tree, both are numbers.
    // generalize to number here
    return treesRaw.map((treeItem) => {
        treeItem.TREE_ID = parseInt(treeItem.TREE_ID as unknown as string, 10);
        treeItem.FIRST_NODE_ID = parseInt(treeItem.FIRST_NODE_ID as unknown as string, 10);
        return treeItem;
    });
}

/**
 * Enhance a standard node from Guided Answers with commands. This can be commands added to the node or text replaced
 * by links. For the later, we just set a marker by embedding the text in <span>-tag with the command as JSON. The
 * actual replacement to a link needs to happen in an consuming UI.
 *
 * @param node - node data from Guided Answer
 * @param nodeEnhancements - commands added to the node (usually rendered on the side)
 * @param htmlEnhancements - enhancements that change text to link
 * @returns - the enhanced Guided Answers node
 */
function enhanceNode(
    node: GuidedAnswerNode,
    nodeEnhancements: NodeEnhancement[],
    htmlEnhancements: HTMLEnhancement[]
): GuidedAnswerNode {
    // Check for enhancements of the Guided Answers node
    const nodeCommands = nodeEnhancements.filter((c) => c.nodeId === node.NODE_ID).map((enh) => enh.command);
    if (nodeCommands.length > 0) {
        node.COMMANDS = nodeCommands;
    }

    // Check for enhancements of the HTML text. If found, embed text in <span>-tag with command as data-* attribute.
    // This needs to be picked up by the UI
    if (typeof node.BODY === 'string') {
        for (const htmlEnhancement of htmlEnhancements) {
            try {
                node.BODY = node.BODY.replace(
                    new RegExp(htmlEnhancement.text, 'g'),
                    `<span ${HTML_ENHANCEMENT_DATA_ATTR_MARKER}="${encodeURIComponent(
                        JSON.stringify(htmlEnhancement.command)
                    )}">${htmlEnhancement.text}</span>`
                );
            } catch {
                // If enhancing a node fails it should not block the flow but gracefully continue.
                // Perhaps we need to notify the consumer about failed enhancement attempts
            }
        }
    }
    return node;
}

/**
 * Get an array of nodes from an array of node ids.
 *
 * @param host - Guided Answer API host
 * @param nodeIdPath - node path as array of node ids
 */
async function getNodePath(host: string, nodeIdPath: GuidedAnswerNodeId[]): Promise<GuidedAnswerNode[]> {
    const resolvedNodes: GuidedAnswerNode[] = [];
    for (const nodeId of nodeIdPath) {
        const node = await getNodeById(host, nodeId);
        resolvedNodes.push(node);
    }
    return resolvedNodes;
}
