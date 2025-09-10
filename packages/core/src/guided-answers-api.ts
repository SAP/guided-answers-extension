import type { AxiosResponse, CancelTokenSource } from 'axios';
import axios from 'axios';
import { default as xss } from 'xss';
import type {
    APIOptions,
    Command,
    FeedbackCommentPayload,
    FeedbackOutcomePayload,
    GuidedAnswerAPI,
    GuidedAnswersEnhancement,
    GuidedAnswerNode,
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
const VERSION = 'v6';
const NODE_PATH = `/dtp/api/${VERSION}/nodes/`;
const TREE_PATH = `/dtp/api/${VERSION}/trees/`;
const FEEDBACK_COMMENT = `dtp/api/${VERSION}/feedback/comment`;
const FEEDBACK_OUTCOME = `dtp/api/${VERSION}/feedback/outcome`;
const DEFAULT_MAX_RESULTS = 9999;

const previousToken: CancelTokenSource[] = [];
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
    const logger = options?.logger ?? getConsoleLogger();

    return {
        getApiInfo: () => ({ host: apiHost, version: VERSION }),
        getNodeById: async (id: GuidedAnswerNodeId): Promise<GuidedAnswerNode> =>
            enhanceNode({ node: await getNodeById(apiHost, id), extensions, logger, ide }),
        getTreeById: async (id: GuidedAnswerTreeId): Promise<GuidedAnswerTree> => getTreeById(apiHost, id),
        getTrees: async (queryOptions?: GuidedAnswersQueryOptions): Promise<GuidedAnswerTreeSearchResult> =>
            getTrees(apiHost, logger, queryOptions),
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
 * Return logger for console logging.
 *
 * @returns - logger to log to console
 */
function getConsoleLogger(): Logger {
    return {
        logTrace: console.trace,
        logDebug: console.debug,
        logInfo: console.info,
        logWarn: console.warn,
        logError: console.error
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
    return body.replace(/src="\/api\/viewer\/image\//gi, `src="${host}/api/viewer/image/`);
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
 * Fetches guided answer trees based on the provided query options.
 *
 * @param {string} host - The host URL for the API.
 * @param {Logger} logger - The logger instance for logging debug information.
 * @param {GuidedAnswersQueryOptions} [queryOptions] - Optional query options including filters and paging.
 * @returns {Promise<GuidedAnswerTreeSearchResult>} A promise that resolves to the search result containing guided answer trees.
 * @throws {Error} Throws an error if the query is a number or if the response does not contain a 'trees' array.
 */
async function getTrees(
    host: string,
    logger: Logger,
    queryOptions?: GuidedAnswersQueryOptions
): Promise<GuidedAnswerTreeSearchResult> {
    if (typeof queryOptions?.query === 'number') {
        throw Error(
            `Invalid search for tree with number. Please use string or function getTreeById() to get a tree by id`
        );
    }
    const query = queryOptions?.query ? encodeURIComponent(`"${queryOptions.query}"`) : '*';
    const urlGetParamString = convertQueryOptionsToGetParams(queryOptions?.filters, queryOptions?.paging);
    const url = `${host}${TREE_PATH}${query}${urlGetParamString}`;

    // Cancel the previous request if it exists
    if (previousToken.length) {
        const prev = previousToken.pop();
        prev?.cancel('Canceling previous request');
    }

    // Create a new CancelToken for the current request
    const source = axios.CancelToken.source();
    previousToken.push(source);

    let searchResult: GuidedAnswerTreeSearchResult = {
        resultSize: -1,
        trees: [],
        productFilters: [],
        componentFilters: []
    };

    try {
        const response = await axios.get<GuidedAnswerTreeSearchResult>(url, {
            cancelToken: source.token
        });
        searchResult = response.data;
        if (!Array.isArray(searchResult?.trees)) {
            throw Error(`Query result from call '${url}' does not contain property 'trees' as array`);
        }
    } catch (error) {
        if (axios.isCancel(error)) {
            logger.logDebug(`Request canceled: '${error.message}'`);
        } else {
            throw error;
        }
    }

    return searchResult;
}

/**
 * Convert a command attached as enhancement to a node into Guided Answers Extension format.
 *
 * @param command - command from Guided Answers node
 * @param logger - logger to log issues
 * @returns -Terminal command or Visual Studio Code command, depending on the input command
 */
function convertCommand(command: GuidedAnswersEnhancement['command'], logger: Logger): TerminalCommand | VSCodeCommand {
    if (command.type === 'Extension') {
        const extensionId = command.exec.context;
        const commandId = command.exec.command;
        let argument;
        try {
            argument = command.exec.args ? JSON.parse(command.exec.args) : undefined;
        } catch (error) {
            logger.logError(
                `Error when parsing argument '${command.exec.args}' for HTML enhancement. Extension id: '${extensionId}', command id: '${commandId}'.`,
                error
            );
        }
        return { extensionId, commandId, argument } as VSCodeCommand;
    }
    if (command.type === 'Terminal') {
        return {
            arguments: [command.exec.command, ...(command.exec.args ?? '').split(' ')],
            cwd: command.exec.context
        } as TerminalCommand;
    }
    throw Error(`Error converting command: Unknown command '${command?.type}'`);
}

/**
 * Return the html and node enhancements of a node. Consider also applicability.
 *
 * @param ide - development environment 'VSCODE' or 'SBAS'
 * @param extensions - list of installed extension ids
 * @param logger - logger to log issues
 * @param enhancements - array of enhancements
 * @returns array of html and node enhancements
 */
function getEnhancements(
    ide: IDE,
    extensions: Set<string>,
    logger: Logger,
    enhancements: GuidedAnswersEnhancement[] = []
): { htmlEnhancements: HTMLEnhancement[]; nodeCommands: Command[] } {
    const nodeCommands: Command[] = [];
    const htmlEnhancements: HTMLEnhancement[] = [];
    try {
        for (const enhancement of enhancements) {
            if (
                (ide === 'VSCODE' && enhancement.command.environment.vscode !== 1) ||
                (ide === 'SBAS' && enhancement.command.environment.sbas !== 1) ||
                (enhancement.command.type === 'Extension' && !extensions.has(enhancement.command.exec.context))
            ) {
                continue;
            }
            const command = {
                label: enhancement.label,
                description: enhancement.desc,
                exec: convertCommand(enhancement.command, logger)
            };
            if (enhancement.extensionType === 'HTML') {
                htmlEnhancements.push({
                    text: enhancement.text,
                    command
                });
            }
            if (enhancement.extensionType === 'NODE') {
                nodeCommands.push(command);
            }
        }
    } catch (error) {
        logger.logError('Error processing enhancements', error);
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

    const { htmlEnhancements, nodeCommands } = getEnhancements(ide, extensions, logger, node.ENHANCEMENTS);
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
 * @returns - array of Guided Answers nodes
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
 * @returns - Feedback response
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
 * @returns - Feedback response
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
 * @returns - Feedback response
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
