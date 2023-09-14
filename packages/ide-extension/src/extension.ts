import type { ExtensionContext } from 'vscode';
import { commands, window, workspace } from 'vscode';
import { getDevSpace, getIde } from '@sap/guided-answers-extension-core';
import { logError, logInfo } from './logger/logger';
import { GuidedAnswersPanel, GuidedAnswersSerializer } from './panel/guidedAnswersPanel';
import { initTelemetry } from './telemetry';
import { GuidedAnswersUriHandler } from './links';
import type { StartOptions } from './types';
import { initBookmarks } from './bookmarks';
import { initLastVisited } from './last-visited';

/**
 *  Activate function is called by VSCode when the extension gets active.
 *
 * @param context - context from VSCode
 */
export function activate(context: ExtensionContext): void {
    try {
        context.subscriptions.push(initTelemetry());
    } catch (error) {
        logError(`Error during initialization of telemetry.`, error);
    }
    try {
        initBookmarks(context.globalState);
        initLastVisited(context.globalState);
    } catch (error) {
        logError(`Error during initialization of functionality that relies on VSCode's global state storage.`, error);
    }
    context.subscriptions.push(
        commands.registerCommand('sap.ux.guidedAnswer.openGuidedAnswer', async (startOptions?: StartOptions) => {
            try {
                const config = workspace.getConfiguration('sap.ux.guidedAnswer');
                const openInNewTab = config.get('openInNewTab') as boolean;
                const options = {
                    apiHost: config.get('apiHost') as string,
                    devSpace: await getDevSpace(),
                    ide: await getIde(),
                    startOptions
                };
                logInfo(`Guided Answers command called. Options:`, options);
                let guidedAnswersPanel: GuidedAnswersPanel | undefined = GuidedAnswersPanel.getInstance();
                if (openInNewTab || !guidedAnswersPanel) {
                    guidedAnswersPanel = new GuidedAnswersPanel(options);
                } else {
                    guidedAnswersPanel.restartWithOptions(startOptions);
                }
                guidedAnswersPanel.show();
            } catch (error) {
                await window.showErrorMessage(`Error while starting Guided Answers: ${(error as Error).message}`);
            }
        })
    );
    context.subscriptions.push(window.registerUriHandler(new GuidedAnswersUriHandler()));
    window.registerWebviewPanelSerializer('sap.ux.guidedAnswer.view', new GuidedAnswersSerializer());
}
