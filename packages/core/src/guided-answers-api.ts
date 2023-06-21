import type { AxiosResponse } from 'axios';
import axios from 'axios';
import { default as xss } from 'xss';
import type {
    APIOptions,
    Command,
    FeedbackCommentPayload,
    FeedbackOutcomePayload,
    GuidedAnswerAPI,
    GuidedAnswerHtmlExtension,
    GuidedAnswerNode,
    GuidedAnswerNodeExtension,
    GuidedAnswerNodeId,
    GuidedAnswersFeedback,
    GuidedAnswersQueryFilterOptions,
    GuidedAnswersQueryOptions,
    GuidedAnswersQueryPagingOptions,
    GuidedAnswerTree,
    GuidedAnswerTreeId,
    GuidedAnswerTreeSearchResult,
    HTMLEnhancement,
    IDE,
    Logger,
    PostFeedbackResponse,
    TerminalCommand,
    VSCodeCommand
} from '@sap/guided-answers-extension-types';
import { HTML_ENHANCEMENT_DATA_ATTR_MARKER } from '@sap/guided-answers-extension-types';

const API_HOST = 'https://ga.support.sap.com';
const VERSION = 'v5';
const NODE_PATH = `/dtp/api/${VERSION}/nodes/`;
const TREE_PATH = `/dtp/api/${VERSION}/trees/`;
const IMG_PREFIX = '/dtp/viewer/';
const FEEDBACK_COMMENT = `dtp/api/${VERSION}/feedback/comment`;
const FEEDBACK_OUTCOME = `dtp/api/${VERSION}/feedback/outcome`;
const DEFAULT_MAX_RESULTS = 9999;

/**
 * Returns API to programmatically access Guided Answers.
 *
 * @param options - options like API host, node enhancements, or html enhancements
 * @returns - API
 */
export function getGuidedAnswerApi(options?: APIOptions): GuidedAnswerAPI {
    const apiHost = options?.apiHost ?? API_HOST;
    const ide = options?.ide;
    const extensions = options?.extensions ?? new Set<string>();
    const logger = options?.logger ?? {
        logString: (m) => {
            console.log(m);
        }
    };

    return {
        getApiInfo: () => ({ host: apiHost, version: VERSION }),
        getNodeById: async (id: GuidedAnswerNodeId): Promise<GuidedAnswerNode> =>
            enhanceNode({ node: await getNodeById(apiHost, id), extensions, logger, ide }),
        getTreeById: async (id: GuidedAnswerTreeId): Promise<GuidedAnswerTree> => getTreeById(apiHost, id),
        getTrees: async (queryOptions?: GuidedAnswersQueryOptions): Promise<GuidedAnswerTreeSearchResult> =>
            getTrees(apiHost, queryOptions),
        getNodePath: async (nodeIdPath: GuidedAnswerNodeId[]): Promise<GuidedAnswerNode[]> => {
            let nodes = await getNodePath(apiHost, nodeIdPath);
            nodes = nodes.map((node) => enhanceNode({ node, extensions, logger, ide }));
            return nodes;
        },
        sendFeedbackComment: async (payload: FeedbackCommentPayload) =>
            sendFeedbackComment(apiHost, payload.treeId, payload.nodeId, payload.comment),
        sendFeedbackOutcome: async (payload: FeedbackOutcomePayload) =>
            sendFeedbackOutcome(apiHost, payload.treeId, payload.nodeId, payload.solved)
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
    return body.replace(/src="services\/backend\.xsjs\?/gi, `src="${host}${IMG_PREFIX}services/backend.xsjs?`);
}

/**
 * Convert query filter options to URL get parameter string.
 *
 * @param filters - optional filters
 * @param filters.component - optional component filter
 * @param filters.product - optional product filter
 * @param paging - optional paging, if not provided set to high response size with 0 offset
 * @returns - URL get parameters as string
 */
function convertQueryOptionsToGetParams(
    filters: GuidedAnswersQueryFilterOptions = {},
    paging: GuidedAnswersQueryPagingOptions = { responseSize: DEFAULT_MAX_RESULTS, offset: 0 }
): string {
    const parameters = [
        // Filter parameters
        ...Object.keys(filters).map(
            (filterName) =>
                `${filterName}=${filters[filterName as keyof typeof filters]
                    ?.map((filterValue) => encodeURIComponent(`"${filterValue}"`))
                    .join(',')}`
        ),
        // Paging parameters
        ...Object.keys(paging).map((pagingName) => `${pagingName}=${paging[pagingName as keyof typeof paging]}`)
    ];
    return `?${parameters.join('&')}`;
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
 * @param queryOptions - options like query string, filters
 * @returns - Array of Guided Answer trees
 */
async function getTrees(host: string, queryOptions?: GuidedAnswersQueryOptions): Promise<GuidedAnswerTreeSearchResult> {
    if (typeof queryOptions?.query === 'number') {
        throw Error(
            `Invalid search for tree with number. Please use string or function getTreeById() to get a tree by id`
        );
    }
    const query = queryOptions?.query ? encodeURIComponent(`"${queryOptions.query}"`) : '*';
    const urlGetParamString = convertQueryOptionsToGetParams(queryOptions?.filters, queryOptions?.paging);
    const url = `${host}${TREE_PATH}${query}${urlGetParamString}`;
    const response: AxiosResponse<GuidedAnswerTreeSearchResult> = await axios.get<GuidedAnswerTreeSearchResult>(url);
    const searchResult = response.data;
    if (!Array.isArray(searchResult?.trees)) {
        throw Error(
            `Query result from call '${url}' does not contain property 'trees' as array. Received response: '${searchResult}'`
        );
    }
    return searchResult;
}

/**
 * Check if a node extension is applicable in the current environment.
 *
 * @param ide - development environment 'VSCODE' or 'SBAS'
 * @param extension - node extension
 * @param extensions - list of installed extension ids
 * @returns - boolean, true: is applicable; false: not applicable
 */
function isExtensionApplicable(ide: IDE, extension: GuidedAnswerNodeExtension, extensions: Set<string>): boolean {
    return (ide === 'VSCODE' && extension.ENV_VSCODE !== 1) ||
        (ide === 'SBAS' && extension.ENV_SBAS !== 1) ||
        (extension.TYPE === 'Extension Command' && !extensions.has(extension.ARG1.VALUE.toLocaleLowerCase()))
        ? false
        : true;
}

/**
 * Check if a html extension is applicable in the current environment.
 *
 * @param ide - development environment 'VSCODE' or 'SBAS'
 * @param extension - node extension
 * @param extensions - list of installed extension ids
 * @returns - boolean, true: is applicable; false: not applicable
 */
function isHtmlExtensionApplicable(ide: IDE, extension: GuidedAnswerHtmlExtension, extensions: Set<string>): boolean {
    return (ide === 'VSCODE' && extension.command.environment.vscode !== 1) ||
        (ide === 'SBAS' && extension.command.environment.sbas !== 1) ||
        (extension.command.type === 'Extension' && !extensions.has(extension.command.exec.extensionId))
        ? false
        : true;
}

/**
 * Return the html and node enhancements of a node. Consider also applicability.
 *
 * @param htmlExtensions -
 * @param nodeExtensions -
 * @param ide - development environment 'VSCODE' or 'SBAS'
 * @param extensions - list of installed extension ids
 * @param [logger] - optional, log issues
 * @returns array of html and node enhancements
 */
function getEnhancements(
    htmlExtensions: GuidedAnswerHtmlExtension[] = [],
    nodeExtensions: GuidedAnswerNodeExtension[] = [],
    ide: IDE,
    extensions: Set<string>,
    logger: Logger
): { htmlEnhancements: HTMLEnhancement[]; nodeCommands: Command[] } {
    const nodeCommands: Command[] = [];
    const htmlEnhancements: HTMLEnhancement[] = [];
    try {
        const applicableNodeExtensions = nodeExtensions.filter((nodeExt) =>
            isExtensionApplicable(ide, nodeExt, extensions)
        );
        for (const applicableNodeExtension of applicableNodeExtensions) {
            const label = applicableNodeExtension.LABEL;
            const description = applicableNodeExtension.DESCRIPTION;
            const exec =
                applicableNodeExtension.TYPE === 'Extension Command'
                    ? { extensionId: applicableNodeExtension.ARG1.VALUE, commandId: applicableNodeExtension.ARG2.VALUE }
                    : {
                          cwd: applicableNodeExtension.ARG1.VALUE,
                          arguments: applicableNodeExtension.ARG2.VALUE.split(' ')
                      };
            nodeCommands.push({ label, description, exec });
        }

        const applicableHtmlExtensions = htmlExtensions.filter((htmlExt) =>
            isHtmlExtensionApplicable(ide, htmlExt, extensions)
        );
        for (const applicableHtmlExtension of applicableHtmlExtensions) {
            const text = applicableHtmlExtension.text;
            const label = applicableHtmlExtension.label;
            const description = applicableHtmlExtension.desc;
            let exec: TerminalCommand | VSCodeCommand;
            if (applicableHtmlExtension.command.type === 'Extension') {
                const extensionId = applicableHtmlExtension.command.exec.extensionId;
                const commandId = applicableHtmlExtension.command.exec.command;
                let argument;
                try {
                    argument = applicableHtmlExtension.command.exec.args
                        ? JSON.parse(applicableHtmlExtension.command.exec.args)
                        : undefined;
                } catch (error) {
                    logger.logString(
                        `Error when parsing argument '${
                            applicableHtmlExtension.command.exec.args
                        }' for HTML enhancement. Extension id: '${extensionId}', command id: '${commandId}', ${error?.toString()}`
                    );
                }
                exec = { extensionId, commandId, argument };
            } else {
                exec = {
                    arguments: [
                        applicableHtmlExtension.command.exec.command,
                        ...(applicableHtmlExtension.command.exec.args ?? '').split(' ')
                    ]
                };
            }
            htmlEnhancements.push({
                text,
                command: { label, description, exec }
            });
        }
    } catch (error) {
        logger.logString(`Error processing enhancements, ${error?.toString()}`);
    }
    return { htmlEnhancements, nodeCommands };
}

/**
 * Enhance a standard node from Guided Answers with commands. This can be commands added to the node as extensions or text replaced
 * by links. For the later, we just set a marker by embedding the text in <span>-tag with the command as JSON. The
 * actual replacement to a link needs to happen in an consuming UI.
 *
 * @param options - enhancement options
 * @param options.node - node data from Guided Answer
 * @param options.extensions - all installed extensions
 * @param options.logger - log issues
 * @param options.ide - optional, IDE environment, SBAS or VSCODE. If not provided no enhancements will be applied
 * @returns - the enhanced Guided Answers node
 */
function enhanceNode(options: {
    node: GuidedAnswerNode;
    extensions: Set<string>;
    ide?: IDE;
    logger: Logger;
}): GuidedAnswerNode {
    const { node, extensions, ide, logger } = options;
    if (!ide) {
        return node;
    }

    const { htmlEnhancements, nodeCommands } = getEnhancements(
        node.HTML_EXTENSIONS,
        node.NODE_EXTENSIONS,
        ide,
        extensions,
        logger
    );
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
    const promises: Promise<GuidedAnswerNode>[] = [];
    for (const nodeId of nodeIdPath) {
        promises.push(getNodeById(host, nodeId));
    }
    return Promise.all(promises);
}

/**
 * Post feedback for tree and node. In case posting feedback is not successful, this function
 * throws an error.
 *
 * @param url - url to post feedback
 * @param feedback - feedback structure
 */
async function postFeedback(url: string, feedback: GuidedAnswersFeedback): Promise<PostFeedbackResponse> {
    const response = await axios.post(url, feedback);
    if (response.status !== 200) {
        throw Error(`Could not send feedback. ${response.statusText} (${response.status})`);
    }
    return response;
}

/**
 * Send comment for a tree/node combination.
 *
 * @param host - Guided Answers API host
 * @param treeId - Guided Answers tree id
 * @param nodeId - Guided Answers node id
 * @param comment - Feedback comment
 */
async function sendFeedbackComment(
    host: string,
    treeId: GuidedAnswerTreeId,
    nodeId: GuidedAnswerNodeId,
    comment: string
): Promise<PostFeedbackResponse> {
    const message = comment;
    return postFeedback(`${host}/${FEEDBACK_COMMENT}`, { treeId, nodeId, message });
}

/**
 * Send feedback about the outcome: solved/not solved.
 *
 * @param host - Guided Answer API host
 * @param treeId - Guided Answers tree id
 * @param nodeId - Guided Answers node id
 * @param solved - true: tree solved the problem; false: tree did not solve the problem
 */
async function sendFeedbackOutcome(
    host: string,
    treeId: GuidedAnswerTreeId,
    nodeId: GuidedAnswerNodeId,
    solved: boolean
): Promise<PostFeedbackResponse> {
    const message = solved ? 'Solved' : 'Not Solved';
    return postFeedback(`${host}/${FEEDBACK_OUTCOME}`, { treeId, nodeId, message });
}
