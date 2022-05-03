// import { dirname } from 'path';
import type { WebviewPanel } from 'vscode';
import { Uri, ViewColumn, window, workspace } from 'vscode';
import type {
    GuidedAnswerActions,
    GuidedAnswerAPI,
    HTMLEnhancement,
    NodeEnhancement
} from '@sap/guided-answers-extension-types';
import {
    SELECT_NODE,
    updateGuidedAnserTrees,
    updateActiveNode,
    EXECUTE_COMMAND,
    SEARCH_TREE,
    WEBVIEW_READY,
    setActiveTree
} from '@sap/guided-answers-extension-types';
import { getGuidedAnswerApi } from '@sap/guided-answers-extension-core';
import { getHtml } from './html';
import { handleCommand } from '../enhancement/commandHandler';
import { logString } from '../logger/logger';

/**
 *  Class that represents the Guided Answers panel, which hosts the webview UI.
 */
export class GuidedAnswersPanel {
    public readonly panel: WebviewPanel;
    private guidedAnswerApi: GuidedAnswerAPI;
    private readonly initialTree: number | undefined;

    /**
     * Constructor.
     *
     * @param [treeId] - optional tree id to start with
     */
    constructor(treeId?: number) {
        logString(`Starting Guided Answers extension webview, treeId: ${treeId}`);
        this.initialTree = treeId;
        const config = workspace.getConfiguration('sap.ux.guidedAnswer');
        const apiHost = config.get('apiHost') as string;
        const enhancements = {
            nodeEnhancements: config.get('nodeEnhancements') as NodeEnhancement[],
            htmlEnhancements: config.get('htmlEnhancements') as HTMLEnhancement[]
        };
        logString(`Configured enhancements:\n${JSON.stringify(enhancements, null, 2)}`);
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
     * Handler for actions coming from webview. This should be primaraly commands with arguments.
     *
     * @param action - action to execute
     */
    private onWebviewMessage(action: GuidedAnswerActions): void {
        try {
            switch (action.type) {
                case SELECT_NODE: {
                    this.guidedAnswerApi
                        .getNodeById(action.payload)
                        .then((node) => {
                            logString(`Node selected: ${node.NODE_ID}: ${node.TITLE}`);
                            this.postActionToWebview(updateActiveNode(node));
                        })
                        .catch((error) =>
                            logString(`Error while retrieving node ${action.payload}: ${error?.message}`)
                        );
                    break;
                }
                case EXECUTE_COMMAND: {
                    handleCommand(action.payload);
                    break;
                }
                case SEARCH_TREE: {
                    this.guidedAnswerApi
                        .getTrees(action.payload)
                        .then((trees) => this.postActionToWebview(updateGuidedAnserTrees(trees)))
                        .catch((error) =>
                            logString(`Error while retrieving tree ${action.payload}: ${error?.message}`)
                        );
                    break;
                }
                case WEBVIEW_READY: {
                    logString(`Webview is ready to receive actions`);
                    if (this.initialTree) {
                        this.guidedAnswerApi
                            .getTreeById(this.initialTree)
                            .then(async (tree) => {
                                const node = await this.guidedAnswerApi.getNodeById(tree.FIRST_NODE_ID);
                                this.postActionToWebview(setActiveTree(tree));
                                this.postActionToWebview(updateActiveNode(node));
                            })
                            .catch((error) =>
                                logString(`Error while retrieving tree ${this.initialTree}: ${error?.message}`)
                            );
                    }
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
