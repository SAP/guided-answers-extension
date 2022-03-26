import { Uri, ViewColumn, WebviewPanel, window, workspace } from 'vscode';
// import { ChannelName, ExtensionLogger } from '@sap/ux-extension-logger';
import {
    GuidedAnswerActions,
    GuidedAnswerAPI,
    SELECT_NODE,
    updateGuidedAnserTrees,
    updateActiveNode,
    EXECUTE_COMMAND,
    SEARCH_TREE,
    WEBVIEW_READY,
    setActiveTree,
    HTMLEnhancement,
    NodeEnhancement
} from '@sap/guided-answers-extension-types';
import { getGuidedAnswerApi } from '@sap/guided-answers-extension-core';
// import { webappDirPath } from '@sap/ux-guided-answer-webapp';
import { getHtml } from './utils/web';
import { uriToResourceUri } from './utils/vscode-util';
import { handleCommand } from './commandHandler';

// const logger = new ExtensionLogger(ChannelName.Help);

export class GuidedAnswersPanel {
    // public readonly panel: WebviewPanel;
    private guidedAnswerApi: GuidedAnswerAPI;
    private readonly initialTree: number | undefined;

    constructor(treeId?: number) {
        try {
            this.initialTree = treeId;
            const config = workspace.getConfiguration('sap.ux.guidedAnswer');
            const apiHost = config.get('apiHost') as string;
            const nodeEnhancements = config.get('nodeEnhancements') as NodeEnhancement[];
            const htmlEnhancements = config.get('htmlEnhancements') as HTMLEnhancement[];
            const enhancements = {
                nodeEnhancements,
                htmlEnhancements
            };
            this.guidedAnswerApi = getGuidedAnswerApi({ apiHost, enhancements });
            // const webAppUri = Uri.file(webappDirPath);
            // this.panel = window.createWebviewPanel('sap.ux.guidedAnswer.view', 'Guided Answers', ViewColumn.Active, {
            //     enableCommandUris: true,
            //     enableScripts: true,
            //     retainContextWhenHidden: true,
            //     localResourceRoots: [Uri.file(webappDirPath)],
            //     enableFindWidget: true
            // });
            // this.panel.title = 'Guided Answers';
            // this.panel.webview.onDidReceiveMessage(this.onWebviewMessage.bind(this));
            // const html = getHtml(
            //     uriToResourceUri(webAppUri),
            //     'Guided Answers',
            //     '/guidedAnswers.js',
            //     undefined,
            //     '/guidedAnswers.css'
            // );
            // this.panel.webview.html = html;
        } catch (error) {
            // logger.error(error.message);
            throw error;
        }
    }

    /**
     * Handler for actions coming from webview. This should be primaraly commands with arguments
     * @param action - action to execute
     */
    private onWebviewMessage(action: GuidedAnswerActions): void {
        try {
            switch (action.type) {
                case SELECT_NODE: {
                    this.guidedAnswerApi.getNodeById(action.payload).then((node) => {
                        this.postActionToWebview(updateActiveNode(node));
                    });
                    break;
                }
                case EXECUTE_COMMAND: {
                    handleCommand(action.payload);
                    break;
                }
                case SEARCH_TREE: {
                    this.guidedAnswerApi
                        .getTrees(action.payload)
                        .then((trees) => this.postActionToWebview(updateGuidedAnserTrees(trees)));
                    break;
                }
                case WEBVIEW_READY: {
                    if (this.initialTree) {
                        this.guidedAnswerApi.getTreeById(this.initialTree).then((tree) => {
                            this.guidedAnswerApi.getNodeById(tree.FIRST_NODE_ID).then((node) => {
                                this.postActionToWebview(setActiveTree(tree));
                                this.postActionToWebview(updateActiveNode(node));
                            });
                        });
                    }
                    break;
                }
            }
        } catch (error) {
            // logger.error(`Error processing message`, action, error);
        }
    }

    /**
     * This should be the ONLY function that sends data to application info webview
     * @param action - the action to post to application info webview
     */
    private postActionToWebview(action: GuidedAnswerActions): void {
        // this.panel.webview.postMessage(action);
    }

    /**
     * Show Application Info panel and set application info data
     */
    public show(): void {
        // this.panel.reveal();
    }
}
