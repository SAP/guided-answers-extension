import type { ExtensionContext } from 'vscode';
import { commands, window } from 'vscode';
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
        commands.registerCommand('sap.ux.guidedAnswer.openGuidedAnswer', (options?: StartOptions) => {
            try {
                logString(`Guided Answers command called. ${options ? '\nOptions: ' + JSON.stringify(options) : ''}`);
                const guidedAnswersPanel = new GuidedAnswersPanel(options);
                guidedAnswersPanel.show();
            } catch (error) {
                window.showErrorMessage(`Error while starting Guided Answers: ${(error as Error).message}`);
            }
        })
    );
}
