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
    let guidedAnswersPanel: GuidedAnswersPanel;
    const config = workspace.getConfiguration('sap.ux.guidedAnswer');
    const openInNewTab = config.get('openInNewTab') as boolean;
    context.subscriptions.push(
        commands.registerCommand('sap.ux.guidedAnswer.openGuidedAnswer', async (startOptions?: StartOptions) => {
            try {
                const newPanel = async () => {
                    const options = {
                        startOptions,
                        ide: await getIde()
                    };
                    guidedAnswersPanel = new GuidedAnswersPanel(options);
                    logString(`Guided Answers command called. Options: ${JSON.stringify(options)}`);
                };

                if (!guidedAnswersPanel) {
                    await newPanel();
                }
                if (!openInNewTab) {
                    guidedAnswersPanel.show();
                } else {
                    await newPanel();
                    guidedAnswersPanel.show();
                }
            } catch (error) {
                window.showErrorMessage(`Error while starting Guided Answers: ${(error as Error).message}`);
            }
        })
    );
}
