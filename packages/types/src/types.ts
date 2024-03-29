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

export type ProductFilter = { PRODUCT: string; COUNT: number };

export type ComponentFilter = { COMPONENT: string; COUNT: number };

export interface GuidedAnswerTreeSearchResult {
    resultSize: number;
    trees: GuidedAnswerTreeSearchHit[];
    productFilters: ProductFilter[];
    componentFilters: ComponentFilter[];
}

export type GuidedAnswerNodeId = number;
export interface GuidedAnswerNode {
    NODE_ID: GuidedAnswerNodeId;
    TITLE: string;
    BODY: string;
    QUESTION: string;
    EDGES: GuidedAnswerEdge[];
    ENHANCEMENTS?: GuidedAnswersEnhancement[];
    COMMANDS?: Command[];
}

export interface GuidedAnswersEnhancement {
    extensionType: 'NODE' | 'HTML';
    label: string;
    desc: string;
    text: string;
    command: {
        type: 'Extension' | 'Terminal';
        exec: {
            context: string;
            command: string;
            args: string;
        };
        environment: {
            vscode: 0 | 1;
            sbas: 0 | 1;
        };
    };
}

export interface PostFeedbackResponse {
    status: number;
    statusText: string;
}

export interface GuidedAnswerEdge {
    LABEL: string;
    TARGET_NODE: GuidedAnswerNodeId;
    ORD: number;
}

export interface FeedbackCommentPayload {
    treeId: GuidedAnswerTreeId;
    nodeId: GuidedAnswerNodeId;
    comment: string;
}
export interface FeedbackOutcomePayload {
    treeId: GuidedAnswerTreeId;
    nodeId: GuidedAnswerNodeId;
    solved: boolean;
}

export interface Bookmark {
    tree: GuidedAnswerTree;
    nodePath: GuidedAnswerNode[];
    createdAt: string;
}

export interface UpdateBookmarksPayload {
    bookmarkKey?: string;
    bookmarks: Bookmarks;
}

export type Bookmarks = Record<string, Bookmark>; //key is 'TREE_ID-NODE_ID:NODE_ID:NODE_ID:...NODE_ID'

export interface LastVisitedGuide {
    tree: GuidedAnswerTree;
    nodePath: GuidedAnswerNode[];
    createdAt: string;
}

export interface GuidedAnswerAPI {
    getApiInfo: () => { host: string; version: string };
    getNodeById: (id: GuidedAnswerNodeId) => Promise<GuidedAnswerNode>;
    getTreeById: (id: GuidedAnswerTreeId) => Promise<GuidedAnswerTree>;
    getTrees: (queryOptions?: GuidedAnswersQueryOptions) => Promise<GuidedAnswerTreeSearchResult>;
    getNodePath: (nodeIdPath: GuidedAnswerNodeId[]) => Promise<GuidedAnswerNode[]>;
    sendFeedbackComment: (payload: FeedbackCommentPayload) => Promise<PostFeedbackResponse>;
    sendFeedbackOutcome: (payload: FeedbackOutcomePayload) => Promise<PostFeedbackResponse>;
}

export interface GuidedAnswersFeedback {
    treeId: GuidedAnswerTreeId;
    nodeId: GuidedAnswerNodeId;
    message: string;
}

export interface GuidedAnswersTelemetryPayload {
    action: GuidedAnswerActions;
    state: AppState;
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
}

export interface HTMLEnhancement {
    text: string;
    command: Command;
}

export interface Logger {
    logTrace(message: string, ...args: any[]): void;
    logDebug(message: string, ...args: any[]): void;
    logInfo(message: string, ...args: any[]): void;
    logWarn(message: string, ...args: any[]): void;
    logError(error: string | Error, ...args: any[]): void;
}

export interface APIOptions {
    apiHost?: string;
    ide?: IDE;
    extensions?: Set<string>;
    logger?: Logger;
}

export interface ShareNodeLinks {
    extensionLink: string;
    webLink: string;
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
    | BetaFeatures
    | ExecuteCommand
    | FeedbackResponse
    | FeedbackStatus
    | FillShareLinks
    | GetBookmarks
    | GoToAllAnswers
    | GoToPreviousPage
    | GoToHomePage
    | GuideFeedback
    | SearchTree
    | SelectNode
    | Navigate
    | SendFeedbackComment
    | SendFeedbackOutcome
    | SendTelemetry
    | SetActiveTree
    | SetComponentFilters
    | SetPageSize
    | SetProductFilters
    | SetQueryValue
    | SynchronizeBookmark
    | UpdateActiveNodeSharing
    | GetLastVisitedGuides
    | UpdateLastVisitedGuides
    | UpdateBookmarks
    | ResetFilters
    | RestartAnswer
    | RestoreState
    | UpdateActiveNode
    | UpdateGuidedAnswerTrees
    | UpdateNetworkStatus
    | WebviewReady
    | SetQuickFilters;

export type NetworkStatus = 'OK' | 'LOADING' | 'ERROR';

export interface AppState {
    networkStatus: NetworkStatus;
    query: string;
    guidedAnswerTreeSearchResult: GuidedAnswerTreeSearchResult;
    activeGuidedAnswerNode: GuidedAnswerNode[];
    activeGuidedAnswer?: GuidedAnswerTree;
    activeNodeSharing: ShareNodeLinks | null;
    betaFeatures: boolean;
    guideFeedback: null | boolean;
    selectedProductFilters: string[];
    selectedComponentFilters: string[];
    pageSize: number;
    feedbackStatus: boolean;
    feedbackResponse: boolean;
    bookmarks: Bookmarks;
    activeScreen: 'HOME' | 'SEARCH' | 'NODE';
    lastVisitedGuides: LastVisitedGuide[];
    quickFilters: GuidedAnswersQueryFilterOptions[];
}

export const UPDATE_GUIDED_ANSWER_TREES = 'UPDATE_GUIDED_ANSWER_TREES';
export interface UpdateGuidedAnswerTrees {
    type: typeof UPDATE_GUIDED_ANSWER_TREES;
    payload: {
        searchResult: GuidedAnswerTreeSearchResult;
        pagingOptions?: GuidedAnswersQueryPagingOptions;
    };
}

export const SELECT_NODE = 'SELECT_NODE';
export interface SelectNode {
    type: typeof SELECT_NODE;
    payload: GuidedAnswerNodeId;
}

export const NAVIGATE = 'NAVIGATE';
export interface Navigate {
    type: typeof NAVIGATE;
    payload: {
        treeId: GuidedAnswerTreeId;
        nodeIdPath: GuidedAnswerNodeId[];
    };
}

export const UPDATE_ACTIVE_NODE = 'UPDATE_ACTIVE_NODE';
export interface UpdateActiveNode {
    type: typeof UPDATE_ACTIVE_NODE;
    payload: GuidedAnswerNode;
}

export const UPDATE_NETWORK_STATUS = 'UPDATE_NETWORK_STATUS';
export interface UpdateNetworkStatus {
    type: typeof UPDATE_NETWORK_STATUS;
    payload: NetworkStatus;
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

export const GO_TO_HOME_PAGE = 'GO_TO_HOME_PAGE';
export interface GoToHomePage {
    type: typeof GO_TO_HOME_PAGE;
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

export const SEND_FEEDBACK_OUTCOME = 'SEND_FEEDBACK_OUTCOME';
export interface SendFeedbackOutcome {
    type: typeof SEND_FEEDBACK_OUTCOME;
    payload: FeedbackOutcomePayload;
}

export const SEND_FEEDBACK_COMMENT = 'SEND_FEEDBACK_COMMENT';
export interface SendFeedbackComment {
    type: typeof SEND_FEEDBACK_COMMENT;
    payload: FeedbackCommentPayload;
}

export const GET_BOOKMARKS = 'GET_BOOKMARKS';
export interface GetBookmarks {
    type: typeof GET_BOOKMARKS;
    payload: Bookmarks;
}

export const UPDATE_BOOKMARKS = 'UPDATE_BOOKMARKS';
export interface UpdateBookmarks {
    type: typeof UPDATE_BOOKMARKS;
    payload: UpdateBookmarksPayload;
}

export const GET_LAST_VISITED_GUIDES = 'GET_LAST_VISITED_GUIDES';
export interface GetLastVisitedGuides {
    type: typeof GET_LAST_VISITED_GUIDES;
    payload: LastVisitedGuide[];
}

export const UPDATE_LAST_VISITED_GUIDES = 'UPDATE_LAST_VISITED_GUIDES';
export interface UpdateLastVisitedGuides {
    type: typeof UPDATE_LAST_VISITED_GUIDES;
    payload: LastVisitedGuide[];
}

export const SET_PRODUCT_FILTERS = 'SET_PRODUCT_FILTERS';
export interface SetProductFilters {
    type: typeof SET_PRODUCT_FILTERS;
    payload: string[];
}

export const SET_COMPONENT_FILTERS = 'SET_COMPONENT_FILTERS';
export interface SetComponentFilters {
    type: typeof SET_COMPONENT_FILTERS;
    payload: string[];
}

export const RESET_FILTERS = 'RESET_FILTERS';
export interface ResetFilters {
    type: typeof RESET_FILTERS;
}

export const SET_PAGE_SIZE = 'SET_PAGE_SIZE';
export interface SetPageSize {
    type: typeof SET_PAGE_SIZE;
    payload: number;
}
export const FEEDBACK_STATUS = 'FEEDBACK_STATUS';
export interface FeedbackStatus {
    type: typeof FEEDBACK_STATUS;
    payload: boolean;
}

export const FEEDBACK_RESPONSE = 'FEEDBACK_RESPONSE';
export interface FeedbackResponse {
    type: typeof FEEDBACK_RESPONSE;
    payload: boolean;
}

export const SEND_TELEMETRY = 'SEND_TELEMETRY';
export interface SendTelemetry {
    type: typeof SEND_TELEMETRY;
    payload: GuidedAnswersTelemetryPayload;
}

export const UPDATE_ACTIVE_NODE_SHARING = 'UPDATE_ACTIVE_NODE_SHARING';
export interface UpdateActiveNodeSharing {
    type: typeof UPDATE_ACTIVE_NODE_SHARING;
    payload: ShareNodeLinks | null;
}

export const FILL_SHARE_LINKS = 'FILL_SHARE_LINKS';
export interface FillShareLinks {
    type: typeof FILL_SHARE_LINKS;
    payload: {
        treeId: GuidedAnswerTreeId;
        nodeIdPath?: GuidedAnswerNodeId[];
    };
}

export const SHARE_LINK_TELEMETRY = 'SHARE_LINK_TELEMETRY';
export interface ShareLinkTelemetry {
    type: typeof SHARE_LINK_TELEMETRY;
}

export const OPEN_LINK_TELEMETRY = 'OPEN_LINK_TELEMETRY';
export interface OpenLinkTelemetry {
    type: typeof OPEN_LINK_TELEMETRY;
}

export const RESTORE_STATE = 'RESTORE_STATE';
export interface RestoreState {
    type: typeof RESTORE_STATE;
    payload: AppState;
}

export const SYNCHRONIZE_BOOKMARK = 'SYNCHRONIZE_BOOKMARK';
export interface SynchronizeBookmark {
    type: typeof SYNCHRONIZE_BOOKMARK;
    payload: Bookmark;
}

export const SET_QUICK_FILTERS = 'SET_QUICK_FILTERS';
export interface SetQuickFilters {
    type: typeof SET_QUICK_FILTERS;
    payload: GuidedAnswersQueryFilterOptions[];
}
