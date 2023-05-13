import type { ExtensionContext } from 'vscode';
import { commands, window, workspace } from 'vscode';
import { getDevSpace, getIde } from '@sap/guided-answers-extension-core';
import { logString } from './logger/logger';
import { GuidedAnswersPanel, GuidedAnswersSerializer } from './panel/guidedAnswersPanel';
import { initTelemetry } from './telemetry';
import { GuidedAnswersUriHandler } from './links';
import type { StartOptions } from './types';

/**
 *  Activate function is called by VSCode when the extension gets active.
 *
 * @param context - context from VSCode
 */
export function activate(context: ExtensionContext): void {
    try {
        context.subscriptions.push(initTelemetry());
    } catch (error) {
        logString(`Error during initialization of telemetry: ${(error as Error)?.message}`);
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
                logString(`Guided Answers command called. Options: ${JSON.stringify(options)}`);
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
