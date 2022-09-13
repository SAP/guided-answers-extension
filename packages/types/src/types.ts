/**
 * API types for Guided Answer
 */
export type GuidedAnswerTreeId = number;
export interface GuidedAnswerTree {
    TREE_ID: GuidedAnswerTreeId;
    TITLE: string;
    AVAILABILITY: string;
    DESCRIPTION: string;
    FIRST_NODE_ID: GuidedAnswerNodeId;
    PRODUCT: string;
    COMPONENT: string;
}

export interface GuidedAnswersQueryOptions {
    query?: string;
    filters?: GuidedAnswersQueryFilterOptions;
    paging?: GuidedAnswersQueryPagingOptions;
}

export interface GuidedAnswersQueryFilterOptions {
    component?: string[];
    product?: string[];
}

export interface GuidedAnswersQueryPagingOptions {
    responseSize: number;
    offset: number;
}

export type GuidedAnswerTreeSearchHit = GuidedAnswerTree & { SCORE: number };

export interface GuidedAnswerTreeSearchResult {
    resultSize: number;
    trees: GuidedAnswerTreeSearchHit[];
    productFilters: { PRODUCT: string; COUNT: number }[];
    componentFilters: { COMPONENT: string; COUNT: number }[];
}

export type GuidedAnswerNodeId = number;
export interface GuidedAnswerNode {
    NODE_ID: GuidedAnswerNodeId;
    TITLE: string;
    BODY: string;
    QUESTION: string;
    EDGES: GuidedAnswerEdge[];
    COMMANDS?: Command[];
}

export interface GuidedAnswerEdge {
    LABEL: string;
    TARGET_NODE: GuidedAnswerNodeId;
    ORD: number;
}

export interface GuidedAnswerAPI {
    getNodeById: (id: GuidedAnswerNodeId) => Promise<GuidedAnswerNode>;
    getTreeById: (id: GuidedAnswerTreeId) => Promise<GuidedAnswerTree>;
    getTrees: (queryOptions?: GuidedAnswersQueryOptions) => Promise<GuidedAnswerTreeSearchResult>;
    getNodePath: (nodeIdPath: GuidedAnswerNodeId[]) => Promise<GuidedAnswerNode[]>;
    sendFeedbackComment: (treeId: GuidedAnswerTreeId, nodeId: GuidedAnswerNodeId, comment: string) => Promise<void>;
    sendFeedbackOutcome: (treeId: GuidedAnswerTreeId, nodeId: GuidedAnswerNodeId, solved: boolean) => Promise<void>;
}

export interface GuidedAnswersFeedback {
    treeId: GuidedAnswerTreeId;
    nodeId: GuidedAnswerNodeId;
    message: 'Solved' | 'Not Solved' | string;
}

export interface VSCodeCommand {
    extensionId: string;
    commandId: string;
    argument?: { fsPath?: string; uri?: any; checkType?: string; arguments?: { [key: string]: string } };
}

export interface TerminalCommand {
    cwd?: string;
    arguments: string[];
}

export type IDE = 'VSCODE' | 'SBAS';

export interface Command {
    label: string;
    description: string;
    exec: TerminalCommand | VSCodeCommand;
    environment: IDE[];
}

export interface NodeEnhancement {
    nodeId: number;
    command: Command;
}

export interface HTMLEnhancement {
    text: string;
    command: Command;
}

export interface APIOptions {
    apiHost?: string;
    enhancements?: {
        nodeEnhancements?: NodeEnhancement[];
        htmlEnhancements?: HTMLEnhancement[];
    };
}

/**
 * Constant for 'data-*' HTML attribute to mark enhancement points and store the command in the Guided Answer BODY HTML.
 * Added some salt to make it unique
 */
export const HTML_ENHANCEMENT_DATA_ATTR_MARKER = 'data-guided-answers-command-8d98638a0304b3f13b54d885dc542121';

/**
 * Action types for redux
 */
export type GuidedAnswerActions =
    | UpdateGuidedAnserTrees
    | SelectNode
    | UpdateActiveNode
    | UpdateLoading
    | GoToPreviousPage
    | GoToAllAnswers
    | RestartAnswer
    | ExecuteCommand
    | SetActiveTree
    | SearchTree
    | SetQueryValue
    | WebviewReady
    | GuideFeedback
    | BetaFeatures;

export const UPDATE_GUIDED_ANSWER_TREES = 'UPDATE_GUIDED_ANSWER_TREES';
export interface UpdateGuidedAnserTrees {
    type: typeof UPDATE_GUIDED_ANSWER_TREES;
    payload: GuidedAnswerTreeSearchResult;
}

export const SELECT_NODE = 'SELECT_NODE';
export interface SelectNode {
    type: typeof SELECT_NODE;
    payload: GuidedAnswerNodeId;
}

export const UPDATE_ACTIVE_NODE = 'UPDATE_ACTIVE_NODE';
export interface UpdateActiveNode {
    type: typeof UPDATE_ACTIVE_NODE;
    payload: GuidedAnswerNode;
}

export const UPDATE_LOADING = 'UPDATE_LOADING';
export interface UpdateLoading {
    type: typeof UPDATE_LOADING;
    payload: boolean;
}

export const GO_TO_PREVIOUS_PAGE = 'GO_TO_PREVIOUS_PAGE';

export const GO_TO_ALL_ANSWERS = 'GO_TO_ALL_ANSWERS';

export const RESTART_ANSWER = 'RESTART_ANSWER';

export interface GoToPreviousPage {
    type: typeof GO_TO_PREVIOUS_PAGE;
}

export interface GoToAllAnswers {
    type: typeof GO_TO_ALL_ANSWERS;
}

export interface RestartAnswer {
    type: typeof RESTART_ANSWER;
}

export const EXECUTE_COMMAND = 'EXECUTE_COMMAND';
export interface ExecuteCommand {
    type: typeof EXECUTE_COMMAND;
    payload: Command;
}

export const SET_ACTIVE_TREE = 'SET_ACTIVE_TREE';
export interface SetActiveTree {
    type: typeof SET_ACTIVE_TREE;
    payload: GuidedAnswerTree;
}

export const SEARCH_TREE = 'SEARCH_TREE';
export interface SearchTree {
    type: typeof SEARCH_TREE;
    payload: GuidedAnswersQueryOptions;
}

export const SET_QUERY_VALUE = 'SET_QUERY_VALUE';
export interface SetQueryValue {
    type: typeof SET_QUERY_VALUE;
    payload: string;
}

export const WEBVIEW_READY = 'WEBVIEW_READY';
export interface WebviewReady {
    type: typeof WEBVIEW_READY;
}

export const BETA_FEATURES = 'BETA_FEATURES';
export interface BetaFeatures {
    type: typeof BETA_FEATURES;
    payload: boolean;
}

export const GUIDE_FEEDBACK = 'GUIDE_FEEDBACK';
export interface GuideFeedback {
    type: typeof GUIDE_FEEDBACK;
    payload: boolean | null;
}
