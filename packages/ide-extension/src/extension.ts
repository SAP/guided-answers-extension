import type { ExtensionContext } from 'vscode';
import { commands, window, workspace } from 'vscode';
import { getIde } from '@sap/guided-answers-extension-core';
import { logString } from './logger/logger';
import { GuidedAnswersPanel } from './panel/guidedAnswersPanel';
import type { StartOptions } from './types';

/**
 *  Activate function is called by VSCode when the extension gets active.
 *
 * @param context - context from VSCode
 */
export function activate(context: ExtensionContext): void {
    let guidedAnswersPanel: GuidedAnswersPanel | undefined;
    context.subscriptions.push(
        commands.registerCommand('sap.ux.guidedAnswer.openGuidedAnswer', async (startOptions?: StartOptions) => {
            try {
                const config = workspace.getConfiguration('sap.ux.guidedAnswer');
                const openInNewTab = config.get('openInNewTab') as boolean;
                const options = {
                    startOptions,
                    ide: await getIde()
                };
                logString(`Guided Answers command called. Options: ${JSON.stringify(options)}`);
                if (openInNewTab || !guidedAnswersPanel) {
                    guidedAnswersPanel = new GuidedAnswersPanel(options);
                    guidedAnswersPanel.panel.onDidDispose(() => {
                        guidedAnswersPanel = undefined;
                    });
                } else {
                    guidedAnswersPanel.restartWithOptions(startOptions);
                }
                guidedAnswersPanel.show();
            } catch (error) {
                window.showErrorMessage(`Error while starting Guided Answers: ${(error as Error).message}`);
            }
        })
    );
}
