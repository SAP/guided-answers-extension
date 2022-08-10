import type { WebviewPanel } from 'vscode';
import { Uri, ViewColumn, window, workspace } from 'vscode';
import type { GuidedAnswerActions, GuidedAnswerAPI } from '@sap/guided-answers-extension-types';
import {
    SELECT_NODE,
    updateGuidedAnserTrees,
    updateActiveNode,
    updateLoading,
    EXECUTE_COMMAND,
    SEARCH_TREE,
    WEBVIEW_READY,
    setActiveTree,
    getBetaFeatures
} from '@sap/guided-answers-extension-types';
import { getGuidedAnswerApi } from '@sap/guided-answers-extension-core';
import { getHtml } from './html';
import { getEnhancements, handleCommand } from '../enhancement';
import { logString } from '../logger/logger';
import type { StartOptions } from '../types';

/**
 *  Class that represents the Guided Answers panel, which hosts the webview UI.
 */
export class GuidedAnswersPanel {
    public readonly panel: WebviewPanel;
    private guidedAnswerApi: GuidedAnswerAPI;
    private readonly startOptions: StartOptions | undefined;

    /**
     * Constructor.
     *
     * @param [options] - optional options for startup like tree id or tree id + node id path
     */
    constructor(options?: StartOptions) {
        this.startOptions = options;
        const config = workspace.getConfiguration('sap.ux.guidedAnswer');
        const apiHost = config.get('apiHost') as string;
        const enhancements = getEnhancements();

        this.guidedAnswerApi = getGuidedAnswerApi({ apiHost, enhancements });
        /**
         * vsce doesn't support pnpm (https://github.com/microsoft/vscode-vsce/issues/421), therefore node_modules from same repo are missing.
         * To overcome this we copy guidedAnswers.js and guidedAnswers.css to dist/ folder in esbuild.js
         * Ideally we would have a dependency to @sap/guided-answers-extension-webapp in do
         *
         * const webappDirPath = dirname(require.resolve('@sap/guided-answers-extension-webapp'));
         */
        const webappDirPath = __dirname;
        const webAppUri = Uri.file(webappDirPath);
        this.panel = window.createWebviewPanel(
            'sap.ux.guidedAnswer.view',
            'Guided Answers extension by SAP',
            ViewColumn.Active,
            {
                enableCommandUris: true,
                enableScripts: true,
                retainContextWhenHidden: true,
                localResourceRoots: [Uri.file(webappDirPath)],
                enableFindWidget: true
            }
        );
        this.panel.webview.onDidReceiveMessage(this.onWebviewMessage.bind(this));
        const html = getHtml(
            webAppUri.with({ scheme: 'vscode-resource' }).toString(),
            'Guided Answers',
            '/guidedAnswers.js',
            undefined,
            '/guidedAnswers.css'
        );
        this.panel.webview.html = html;
    }
    /**
     * Process startup parameters like initial tree id and node path.
     *
     * @returns - void
     */
    private async processStartOptions(): Promise<void> {
        if (!this.startOptions) {
            return;
        }
        try {
            if (typeof this.startOptions !== 'object') {
                throw Error(
                    `Invalid start options. Please refer to https://github.com/SAP/guided-answers-extension/blob/main/docs/technical-information.md#module-sap-guided-answer-extension-packageside-extension for valid options.`
                );
            }
            const tree = await this.guidedAnswerApi.getTreeById(this.startOptions.treeId);
            let nodePath;
            if (this.startOptions.nodeIdPath) {
                nodePath = await this.guidedAnswerApi.getNodePath(this.startOptions.nodeIdPath);
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
                    typeof this.startOptions === 'object' ? JSON.stringify(this.startOptions) : this.startOptions
                }`
            );
        }
    }

    /**
     * Handler for actions coming from webview. This should be primaraly commands with arguments.
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
                case EXECUTE_COMMAND: {
                    handleCommand(action.payload);
                    break;
                }
                case SEARCH_TREE: {
                    const trees = await this.guidedAnswerApi.getTrees(action.payload);
                    this.postActionToWebview(updateGuidedAnserTrees(trees));
                    break;
                }
                case WEBVIEW_READY: {
                    logString(`Webview is ready to receive actions`);
                    await this.processStartOptions();
                    this.postActionToWebview(
                        getBetaFeatures(
                            (workspace.getConfiguration('sap.ux.guidedAnswer').get('betaFeatures') as boolean) || false
                        )
                    );
                    this.postActionToWebview(updateLoading(false));
                    break;
                }
                default: {
                    // Nothing to do if the action is not handled
                }
            }
        } catch (error: any) {
            logString(`Error processing message '${action?.type}': ${error?.message}`);
        }
    }

    /**
     * This should be the ONLY function that sends data to application info webview.
     *
     * @param action - the action to post to application info webview
     */
    private postActionToWebview(action: GuidedAnswerActions): void {
        this.panel.webview.postMessage(action);
    }

    /**
     * Show Application Info panel and set application info data.
     */
    public show(): void {
        this.panel.reveal();
    }
}
