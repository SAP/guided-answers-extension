import type { ExtensionContext } from 'vscode';
import { commands, window } from 'vscode';
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
    context.subscriptions.push(
        commands.registerCommand('sap.ux.guidedAnswer.openGuidedAnswer', async (startOptions?: StartOptions) => {
            try {
                const options = {
                    startOptions,
                    ide: await getIde()
                };
                logString(`Guided Answers command called. Options: ${JSON.stringify(options)}`);
                const guidedAnswersPanel = new GuidedAnswersPanel(options);
                guidedAnswersPanel.show();
            } catch (error) {
                window.showErrorMessage(`Error while starting Guided Answers: ${(error as Error).message}`);
            }
        })
    );
}
