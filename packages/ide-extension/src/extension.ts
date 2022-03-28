import type { ExtensionContext } from 'vscode';
import { commands } from 'vscode';
import { logString } from './logger/logger';
import { GuidedAnswersPanel } from './panel/guidedAnswersPanel';

/**
 *  Activate function is called by VSCode when the extension gets active.
 *
 * @param context - context from VSCode
 */
export function activate(context: ExtensionContext): void {
    context.subscriptions.push(
        commands.registerCommand('sap.ux.guidedAnswer.openGuidedAnswer', (options?: { treeId: number }) => {
            const treeId = options?.treeId;
            logString(`Guided Answers command called. (TreeId: ${treeId})`);
            const guidedAnswersPanel = new GuidedAnswersPanel(treeId);
            guidedAnswersPanel.show();
        })
    );
}
