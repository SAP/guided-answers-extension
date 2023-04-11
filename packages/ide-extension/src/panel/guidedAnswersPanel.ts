import type { WebviewPanel } from 'vscode';
import { Uri, ViewColumn, window, workspace } from 'vscode';
import {
    GuidedAnswerActions,
    GuidedAnswerAPI,
    GuidedAnswersQueryOptions,
    GuidedAnswerTreeSearchResult,
    IDE,
    setQueryValue
} from '@sap/guided-answers-extension-types';
import {
    SELECT_NODE,
    SEND_TELEMETRY,
    SEND_FEEDBACK_OUTCOME,
    SEND_FEEDBACK_COMMENT,
    updateGuidedAnswerTrees,
    updateActiveNode,
    updateLoading,
    EXECUTE_COMMAND,
    searchTree,
    SEARCH_TREE,
    WEBVIEW_READY,
    setActiveTree,
    getBetaFeatures,
    feedbackResponse
} from '@sap/guided-answers-extension-types';
import { getFiltersForIde, getGuidedAnswerApi } from '@sap/guided-answers-extension-core';
import { getHtml } from './html';
import { getHtmlEnhancements, getInstalledExtensionIds, handleCommand } from '../enhancement';
import { logString } from '../logger/logger';
import type { Options, StartOptions } from '../types';
import { setCommonProperties, trackAction, trackEvent } from '../telemetry';
import { extractLinkInfo } from '../links/link-info';

/**
 *  Class that represents the Guided Answers panel, which hosts the webview UI.
 */
export class GuidedAnswersPanel {
    public readonly panel: WebviewPanel;
    private guidedAnswerApi: GuidedAnswerAPI;
    private startOptions: StartOptions | undefined;
    private loadingTimeout: NodeJS.Timeout | undefined;
    private readonly ide: IDE;

    /**
     * Constructor.
     *
     * @param [options] - optional options to initialize the panel
     * @param [options.ide] - optional runtime IDE (VSCODE/SBAS), default is VSCODE if not passed
     * @param [options.startOptions] - optional startup options like tree id or tree id + node id path, or openToSide
     */
    constructor(options?: Options) {
        this.startOptions = options?.startOptions;
        this.ide = options?.ide || 'VSCODE';
        const htmlEnhancements = getHtmlEnhancements(this.ide);
        const extensions = getInstalledExtensionIds();

        this.guidedAnswerApi = getGuidedAnswerApi({
            apiHost: options?.apiHost,
            htmlEnhancements,
            ide: this.ide,
            extensions
        });
        const { host: apiHost, version: apiVersion } = this.guidedAnswerApi.getApiInfo();
        setCommonProperties({ ide: this.ide, devSpace: options?.devSpace || '', apiHost, apiVersion });
        logString(`Using API host: '${apiHost}', version: '${apiVersion}'`);
        trackEvent({
            name: 'STARTUP',
            properties: {
                treeId: typeof this.startOptions?.treeId === 'number' ? this.startOptions?.treeId.toString() : '',
                nodeIdPath: (this.startOptions?.nodeIdPath || []).join(':')
            }
        });
        /**
         * vsce doesn't support pnpm (https://github.com/microsoft/vscode-vsce/issues/421), therefore node_modules from same repo are missing.
         * To overcome this we copy guidedAnswers.js and guidedAnswers.css to dist/ folder in esbuild.js
         * Ideally we would have a dependency to @sap/guided-answers-extension-webapp in do
         *
         * const webappDirPath = dirname(require.resolve('@sap/guided-answers-extension-webapp'));
         */
        const ViewColumnType = this.startOptions?.openToSide ? ViewColumn.Beside : ViewColumn.Active;
        this.panel = window.createWebviewPanel(
            'sap.ux.guidedAnswer.view',
            'Guided Answers extension by SAP',
            ViewColumnType,
            {
                enableCommandUris: true,
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [Uri.file(__dirname)],
                enableFindWidget: true
            }
        );
        this.panel.webview.onDidReceiveMessage(this.onWebviewMessage.bind(this));
        this.panel.webview.html = this.createHtmlContent();
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
        logString(`Restarting Guided Answers...`);
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
        if (this.startOptions) {
            await this.processStartOptions(this.startOptions);
        } else {
            await this.processEnvironmentFilters(this.ide);
        }
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
            logString(
                `Error while processing start options, error was: '${error?.message}'. Start options: \n${
                    typeof startOptions === 'object' ? JSON.stringify(startOptions) : startOptions
                }`
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
    private async processEnvironmentFilters(ide: IDE): Promise<void> {
        try {
            const filters = await getFiltersForIde(ide);
            logString(`Filters for environment '${ide}': ${JSON.stringify(filters)}`);
            if (Object.keys(filters).length > 0) {
                this.postActionToWebview(searchTree({ filters }));
            }
        } catch (error: any) {
            logString(`Error while retrieving context information, error was: '${error?.message}'.`);
        }
    }

    /**
     * Return trees by given options, which include: search query, filtering, paging.
     *
     * @param queryOptions - options for query trees, like the search query and paging and filtering options
     * @returns - search result including trees
     */
    private async getTrees(queryOptions: GuidedAnswersQueryOptions): Promise<GuidedAnswerTreeSearchResult> {
        const showLoadingAnimation = queryOptions.paging?.offset === 0;
        if (showLoadingAnimation) {
            if (this.loadingTimeout) {
                clearTimeout(this.loadingTimeout);
            }
            this.loadingTimeout = setTimeout(() => {
                this.postActionToWebview(updateLoading(true));
            }, 2000);
        }
        const trees = await this.guidedAnswerApi.getTrees(queryOptions);
        if (this.loadingTimeout) {
            clearTimeout(this.loadingTimeout);
        }
        if (showLoadingAnimation) {
            this.postActionToWebview(updateLoading(false));
        }
        return trees;
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
                    logString(`Node selected: ${node.NODE_ID}: ${node.TITLE}`);
                    this.postActionToWebview(updateActiveNode(node));
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
                case SEARCH_TREE: {
                    logString(`Starting search: ${JSON.stringify(action.payload)}`);
                    if (typeof action.payload.query === 'string') {
                        const start = extractLinkInfo(action.payload.query);
                        if (start) {
                            logString(`Found possible startup options: ${JSON.stringify(start)}`);
                            this.postActionToWebview(updateLoading(true));
                            const startOptionsApplied = await this.processStartOptions(start);
                            this.postActionToWebview(updateLoading(false));
                            if (startOptionsApplied) {
                                this.postActionToWebview(setQueryValue(''));
                                return;
                            }
                        }
                    }
                    const trees = await this.getTrees(action.payload);
                    logString(`Found ${trees.resultSize} trees`);
                    this.postActionToWebview(updateGuidedAnswerTrees(trees));
                    break;
                }
                case WEBVIEW_READY: {
                    logString(`Webview is ready to receive actions`);
                    await this.handleWebViewReady();
                    this.postActionToWebview(
                        getBetaFeatures(
                            (workspace.getConfiguration('sap.ux.guidedAnswer').get('betaFeatures') as boolean) || false
                        )
                    );
                    this.postActionToWebview(updateLoading(false));
                    break;
                }
                case SEND_TELEMETRY: {
                    trackAction(action);
                    break;
                }
                default: {
                    // Nothing to do if the action is not handled
                }
            }
        } catch (error: any) {
            logString(
                `Error while processing action.\n  Action: ${JSON.stringify(action)}\n  Message: ${error?.message}`
            );
        }
    }

    /**
     * This should be the ONLY function that sends data to application info webview.
     *
     * @param action - the action to post to application info webview
     */
    private postActionToWebview(action: GuidedAnswerActions): void {
        this.panel?.webview.postMessage(action);
    }

    /**
     * Show Application Info panel and set application info data.
     */
    public show(): void {
        this.panel.reveal();
    }
}
