import { ExtensionContext, commands, window } from 'vscode';
import { GuidedAnswersPanel } from './guidedAnswersPanel';

export function activate(context: ExtensionContext): void {
    context.subscriptions.push(
        commands.registerCommand('sap.ux.guidedAnswer.openGuidedAnswer', (options?: { treeId: number }) => {
            window.showInformationMessage('HW');
            const guidedAnswersPanel = new GuidedAnswersPanel(options?.treeId);
            guidedAnswersPanel.show();
        })
    );
}
