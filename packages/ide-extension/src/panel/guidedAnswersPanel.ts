import type { WebviewPanel, WebviewPanelSerializer } from 'vscode';
import { Uri, ViewColumn, window, workspace } from 'vscode';
import type {
    AppState,
    Bookmark,
    GuidedAnswerActions,
    GuidedAnswerAPI,
    GuidedAnswerNodeId,
    GuidedAnswersQueryOptions,
    GuidedAnswerTreeId,
    GuidedAnswerTreeSearchResult,
    IDE
} from '@sap/guided-answers-extension-types';
import {
    FILL_SHARE_LINKS,
    SELECT_NODE,
    NAVIGATE,
    SEND_TELEMETRY,
    SEND_FEEDBACK_OUTCOME,
    SEND_FEEDBACK_COMMENT,
    SYNCHRONIZE_BOOKMARK,
    UPDATE_BOOKMARKS,
    UPDATE_LAST_VISITED_GUIDES,
    updateGuidedAnswerTrees,
    updateActiveNode,
    updateNetworkStatus,
    updateActiveNodeSharing,
    EXECUTE_COMMAND,
    SEARCH_TREE,
    WEBVIEW_READY,
    restoreState,
    setActiveTree,
    setQueryValue,
    getBetaFeatures,
    feedbackResponse,
    getBookmarks,
    goToAllAnswers,
    updateBookmark,
    getLastVisitedGuides,
    setQuickFilters
} from '@sap/guided-answers-extension-types';
import { getFiltersForIde, getGuidedAnswerApi } from '@sap/guided-answers-extension-core';
import { getHtml } from './html';
import { getInstalledExtensionIds, handleCommand } from '../enhancement';
import * as logger from '../logger/logger';
import type { Options, StartOptions } from '../types';
import { setCommonProperties, trackAction, trackEvent } from '../telemetry';
import { extractLinkInfo, generateExtensionLink, generateWebLink } from '../links/link-info';
import { getAllBookmarks, updateBookmarks } from '../bookmarks';
import { updateLastVisitedGuides, getAllLastVisitedGuides } from '../last-visited';

/**
 *  Class that represents the Guided Answers panel, which hosts the webview UI.
 */
export class GuidedAnswersPanel {
    private static guidedAnswersPanel: GuidedAnswersPanel | undefined;
    public readonly panel: WebviewPanel;
    private guidedAnswerApi: GuidedAnswerAPI;
    private startOptions: StartOptions | undefined;
    private loadingTimeout: NodeJS.Timeout | undefined;
    private readonly ide: IDE;
    private restoreAppState?: AppState;

    /**
     * Return instance of guided answers panel. This is required when setting 'openInNewTab'
     * is set to false (default) and a single panel should be reused.
     *
     * @returns - instance of guided answers panel
     */
    static getInstance(): GuidedAnswersPanel | undefined {
        return GuidedAnswersPanel.guidedAnswersPanel;
    }

    /**
     * Constructor.
     *
     * @param [options] - optional options to initialize the panel
     * @param [options.ide] - optional runtime IDE (VSCODE/SBAS), default is VSCODE if not passed
     * @param [options.startOptions] - optional startup options like tree id or tree id + node id path, or openToSide
     */
    constructor(options?: Options) {
        this.startOptions = options?.startOptions;
        this.ide = options?.ide ?? 'VSCODE';
        this.restoreAppState = options?.restore?.appState;
        const extensions = getInstalledExtensionIds();

        this.guidedAnswerApi = getGuidedAnswerApi({
            apiHost: options?.apiHost,
            ide: this.ide,
            extensions,
            logger
        });
        const { host: apiHost, version: apiVersion } = this.guidedAnswerApi.getApiInfo();
        setCommonProperties({ ide: this.ide, devSpace: options?.devSpace ?? '', apiHost, apiVersion });
        logger.logInfo(`Using API host: '${apiHost}', version: '${apiVersion}'`);
        trackEvent({
            name: 'STARTUP',
            properties: {
                treeId: typeof this.startOptions?.treeId === 'number' ? this.startOptions?.treeId.toString() : '',
                nodeIdPath: (this.startOptions?.nodeIdPath ?? []).join(':'),
                trigger: this.startOptions?.trigger ?? ''
            }
        }).catch((error) => logger.logError(`Error tracking event 'STARTUP'`, error));
        /**
         * vsce doesn't support pnpm (https://github.com/microsoft/vscode-vsce/issues/421), therefore node_modules from same repo are missing.
         * To overcome this we copy guidedAnswers.js and guidedAnswers.css to dist/ folder in esbuild.js
         * Ideally we would have a dependency to @sap/guided-answers-extension-webapp in do
         *
         * const webappDirPath = dirname(require.resolve('@sap/guided-answers-extension-webapp'));
         */
        const ViewColumnType = this.startOptions?.openToSide ? ViewColumn.Beside : ViewColumn.Active;
        this.panel =
            options?.restore?.webviewPanel ??
            window.createWebviewPanel('sap.ux.guidedAnswer.view', 'Guided Answers extension by SAP', ViewColumnType, {
                enableCommandUris: true,
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [Uri.file(__dirname)],
                enableFindWidget: true
            });
        this.panel.webview.onDidReceiveMessage(this.onWebviewMessage.bind(this));
        this.panel.webview.html = this.createHtmlContent();
        GuidedAnswersPanel.guidedAnswersPanel = this;
        this.panel.onDidDispose(() => {
            delete GuidedAnswersPanel.guidedAnswersPanel;
        });
    }

    /**
     * Return the HTML content for webview.
     *
     * @returns - HTML content for webview as string
     */
    private createHtmlContent(): string {
        return getHtml(
            this.panel.webview.asWebviewUri(Uri.file(__dirname)).toString(),
            'Guided Answers',
            '/guidedAnswers.js',
            undefined,
            '/guidedAnswers.css'
        );
    }
    /**
     * Restart the Guided Answers, possibly with new start options.
     *
     * @param startOptions - optional startup options like tree id or tree id + node id path
     */
    restartWithOptions(startOptions: StartOptions | undefined) {
        this.startOptions = startOptions;
        logger.logInfo(`Restarting Guided Answers...`);
        if (startOptions?.openToSide) {
            this.panel.reveal(ViewColumn.Beside);
        }
        this.panel.webview.html = '';
        this.panel.webview.html = this.createHtmlContent();
    }

    /**
     * Process startup sequence when webview is ready. This includes start options like initial tree to show
     * or filters that are applied depending on the environment.
     */
    private async handleWebViewReady(): Promise<void> {
        if (this.restoreAppState) {
            this.postActionToWebview(restoreState(this.restoreAppState));
            delete this.restoreAppState;
        }
        if (this.startOptions) {
            await this.processStartOptions(this.startOptions);
        }
        await this.loadQuickFilters(this.ide);
        this.postActionToWebview(
            getBetaFeatures(workspace.getConfiguration('sap.ux.guidedAnswer').get<boolean>('betaFeatures') ?? false)
        );
        this.postActionToWebview(updateNetworkStatus('OK'));
        this.postActionToWebview(getBookmarks(getAllBookmarks()));
        this.postActionToWebview(getLastVisitedGuides(getAllLastVisitedGuides()));
    }

    /**
     * Process startup parameters like initial tree id and node path.
     *
     * @param startOptions - start options, e.g. tree id or node path
     * @returns - boolean, true: start options applied; false: start options not applied
     */
    private async processStartOptions(startOptions: StartOptions): Promise<boolean> {
        try {
            if (typeof startOptions !== 'object') {
                throw Error(
                    `Invalid start options. Please refer to https://github.com/SAP/guided-answers-extension/blob/main/docs/technical-information.md#module-sap-guided-answer-extension-packageside-extension for valid options.`
                );
            }
            const tree = await this.guidedAnswerApi.getTreeById(startOptions.treeId);
            let nodePath;
            if (startOptions.nodeIdPath) {
                nodePath = await this.guidedAnswerApi.getNodePath(startOptions.nodeIdPath);
            }
            this.postActionToWebview(setActiveTree(tree));
            if (nodePath && nodePath.length > 0) {
                for (const node of nodePath) {
                    this.postActionToWebview(updateActiveNode(node));
                }
            } else {
                this.postActionToWebview(updateActiveNode(await this.guidedAnswerApi.getNodeById(tree.FIRST_NODE_ID)));
            }
        } catch (error: any) {
            logger.logError(
                `Error while processing start options, error was: '${error?.message}'. Start options:`,
                startOptions
            );
            return false;
        }
        return true;
    }

    /**
     * Check for environment specific filters and apply them.
     *
     * @param ide - environment like VSCODE or BAS
     */
    private async loadQuickFilters(ide: IDE): Promise<void> {
        try {
            const filters = await getFiltersForIde(ide);
            logger.logInfo(`Filters for environment '${ide}':`, filters);
            if (Object.keys(filters).length > 0) {
                this.postActionToWebview(setQuickFilters([filters]));
            }
        } catch (error: any) {
            logger.logError(`Error while retrieving context information, error was:`, error);
        }
    }

    /**
     * Return trees by given options, which include: search query, filtering, paging.
     *
     * @param queryOptions - options for query trees, like the search query and paging and filtering options
     * @returns - search result including trees
     */
    private async getTrees(queryOptions: GuidedAnswersQueryOptions): Promise<GuidedAnswerTreeSearchResult> {
        const showLoader = queryOptions.paging?.offset === 0;
        if (showLoader) {
            if (this.loadingTimeout) {
                clearTimeout(this.loadingTimeout);
            }
            this.loadingTimeout = setTimeout(() => {
                this.postActionToWebview(updateNetworkStatus('LOADING'));
            }, 2000);
        }
        try {
            const trees = await this.guidedAnswerApi.getTrees(queryOptions);
            if (this.loadingTimeout) {
                clearTimeout(this.loadingTimeout);
            }
            this.postActionToWebview(updateNetworkStatus('OK'));
            return trees;
        } catch (e) {
            if (this.loadingTimeout) {
                clearTimeout(this.loadingTimeout);
            }
            this.postActionToWebview(updateNetworkStatus('ERROR'));
            throw e;
        }
    }
    /**
     *
     * @param bookmark - the bookmark to synchronize
     */
    async synchronizeBookmark(bookmark: Bookmark): Promise<void> {
        let needUpdate = false;
        const tree = await this.guidedAnswerApi.getTreeById(bookmark.tree.TREE_ID);
        if (JSON.stringify(tree) !== JSON.stringify(bookmark.tree)) {
            bookmark.tree = tree;
            needUpdate = true;
        }
        const nodePath = await this.guidedAnswerApi.getNodePath(bookmark.nodePath.map((n) => n.NODE_ID));
        if (JSON.stringify(nodePath) !== JSON.stringify(bookmark.nodePath)) {
            bookmark.nodePath = nodePath;
            needUpdate = true;
        }
        if (needUpdate) {
            const bookmarkKey = `${bookmark.tree.TREE_ID}-${bookmark.nodePath.map((n) => n.NODE_ID).join(':')}`;
            const bookmarks = getAllBookmarks();
            bookmarks[bookmarkKey] = bookmark;
            this.postActionToWebview(updateBookmark({ bookmarks }));
            this.postActionToWebview(goToAllAnswers());
            this.postActionToWebview(setActiveTree(tree));
            for (const node of nodePath) {
                this.postActionToWebview(updateActiveNode(node));
            }
            logger.logInfo(
                `Bookmark for Guided Answer '${tree.TITLE}' (${tree.TREE_ID}) was outdated and has been updated.`
            );
        }
    }

    /**
     *
     * @param treeId - tree to navigate to
     * @param nodeIdPath - nodes in tree to navigate to
     */
    async navigate(treeId: GuidedAnswerTreeId, nodeIdPath: GuidedAnswerNodeId[]): Promise<void> {
        this.postActionToWebview(updateNetworkStatus('LOADING'));
        try {
            const tree = await this.guidedAnswerApi.getTreeById(treeId);
            const nodePath = await this.guidedAnswerApi.getNodePath(nodeIdPath);
            this.postActionToWebview(setActiveTree(tree));
            for (const node of nodePath) {
                this.postActionToWebview(updateActiveNode(node));
            }
            this.postActionToWebview(updateNetworkStatus('OK'));
        } catch (e) {
            this.postActionToWebview(updateNetworkStatus('ERROR'));
            throw e;
        }
    }

    /**
     * Handler for actions coming from webview. This should be primarily commands with arguments.
     *
     * @param action - action to execute
     */
    private async onWebviewMessage(action: GuidedAnswerActions): Promise<void> {
        try {
            switch (action.type) {
                case SELECT_NODE: {
                    const node = await this.guidedAnswerApi.getNodeById(action.payload);
                    logger.logInfo(`Node selected: ${node.NODE_ID}: ${node.TITLE}`);
                    this.postActionToWebview(updateActiveNode(node));
                    break;
                }
                case NAVIGATE: {
                    await this.navigate(action.payload.treeId, action.payload.nodeIdPath);
                    break;
                }
                case SEND_FEEDBACK_OUTCOME: {
                    await this.guidedAnswerApi.sendFeedbackOutcome(action.payload);
                    break;
                }
                case SEND_FEEDBACK_COMMENT: {
                    try {
                        const commentResponse = await this.guidedAnswerApi.sendFeedbackComment(action.payload);
                        this.postActionToWebview(feedbackResponse(commentResponse.status === 200));
                    } catch (error) {
                        throw Error(`Could not send feedback. ${error})`);
                    }
                    break;
                }
                case EXECUTE_COMMAND: {
                    handleCommand(action.payload);
                    break;
                }
                case FILL_SHARE_LINKS: {
                    const startOptions: StartOptions = {
                        treeId: action.payload.treeId,
                        nodeIdPath: action.payload.nodeIdPath
                    };
                    const { host: apiHost } = this.guidedAnswerApi.getApiInfo();
                    const extensionLink = generateExtensionLink(startOptions);
                    const webLink = generateWebLink(apiHost, startOptions);
                    this.postActionToWebview(updateActiveNodeSharing({ extensionLink, webLink }));
                    break;
                }
                case SEARCH_TREE: {
                    logger.logInfo(`Starting search: ${JSON.stringify(action.payload)}`);
                    if (typeof action.payload.query === 'string') {
                        const start = extractLinkInfo(action.payload.query);
                        if (start) {
                            logger.logInfo(`Found possible startup options:`, start);
                            this.postActionToWebview(updateNetworkStatus('LOADING'));
                            const startOptionsApplied = await this.processStartOptions(start);
                            this.postActionToWebview(updateNetworkStatus('OK'));
                            if (startOptionsApplied) {
                                this.postActionToWebview(setQueryValue(''));
                                return;
                            }
                        }
                    }
                    const trees = await this.getTrees(action.payload);
                    logger.logInfo(`Found ${trees.resultSize} trees`);
                    this.postActionToWebview(
                        updateGuidedAnswerTrees({ searchResult: trees, pagingOptions: action.payload.paging })
                    );
                    break;
                }
                case WEBVIEW_READY: {
                    logger.logInfo(`Webview is ready to receive actions`);
                    await this.handleWebViewReady();
                    break;
                }
                case SEND_TELEMETRY: {
                    trackAction(action).catch((error) =>
                        logger.logError(`Error tracking action '${action?.payload?.action?.type}'`, error)
                    );
                    break;
                }
                case UPDATE_BOOKMARKS: {
                    updateBookmarks(action.payload.bookmarks);
                    break;
                }
                case UPDATE_LAST_VISITED_GUIDES: {
                    updateLastVisitedGuides(action.payload);
                    this.postActionToWebview(getLastVisitedGuides(getAllLastVisitedGuides()));
                    break;
                }
                case SYNCHRONIZE_BOOKMARK: {
                    this.synchronizeBookmark(action.payload).catch((error) =>
                        logger.logError(`Error during synchronizing bookmark.`, error)
                    );
                    break;
                }
                default: {
                    // Nothing to do if the action is not handled
                }
            }
        } catch (error: any) {
            logger.logError(
                `Error while processing action.\n  Action: ${JSON.stringify(action)}\n  Message:`,
                error?.message
            );
        }
    }

    /**
     * This should be the ONLY function that sends data to application info webview.
     *
     * @param action - the action to post to application info webview
     */
    private postActionToWebview(action: GuidedAnswerActions): void {
        this.panel?.webview
            .postMessage(action)
            ?.then(undefined, (error) =>
                logger.logError(`Error sending action to webview. Action was '${action?.type}'`, error)
            );
    }

    /**
     * Show Application Info panel and set application info data.
     */
    public show(): void {
        this.panel.reveal();
    }
}

/**
 * Class to (de)serialize app info webview
 */
export class GuidedAnswersSerializer implements WebviewPanelSerializer {
    /**
     * Called from VSCode when Webview panel is restored.
     *
     * @param webviewPanel - webview panel
     * @param state - previously persisted state, which is the app root path
     * @returns - void
     */
    deserializeWebviewPanel(webviewPanel: WebviewPanel, state: string): Promise<void> {
        try {
            if (state) {
                const appState = JSON.parse(state) as AppState;
                logger.logInfo(`Restoring guided answers state with deserialized web panel`);
                const guidedAnswersPanel = new GuidedAnswersPanel({ restore: { webviewPanel, appState } });
                guidedAnswersPanel.show();
            } else {
                logger.logInfo(`Received invalid state. Disposing webviewPanel. State:`, state);
                webviewPanel.dispose();
            }
        } catch (error) {
            logger.logError(`Error while restoring webview panel:`, error);
            webviewPanel?.dispose();
        }
        return Promise.resolve();
    }
}
