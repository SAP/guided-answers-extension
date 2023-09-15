import { commands } from 'vscode';
import type { ProviderResult, Uri, UriHandler } from 'vscode';
import { logError, logInfo } from '../logger/logger';
import { extractLinkInfo } from './link-info';

/**
 * URI Handler implementation
 */
export class GuidedAnswersUriHandler implements UriHandler {
    /**
     * Handler for URIs like 'vscode://saposs.sap-guided-answers-extension#/...'
     * This function will get run when something redirects to VS Code
     * with your extension id as the authority.
     *
     * @param uri - called uri
     */
    handleUri(uri: Uri): ProviderResult<void> {
        const link = decodeURIComponent(uri.toString());
        logInfo(`Guided Answers extension called from URI: ${link}`);
        const startOptions = extractLinkInfo(link);
        logInfo(`Extracted information from link:`, startOptions);
        if (startOptions?.treeId) {
            commands
                .executeCommand('sap.ux.guidedAnswer.openGuidedAnswer', startOptions)
                ?.then(undefined, (error) =>
                    logError(`Error while executing start command 'sap.ux.guidedAnswer.openGuidedAnswer'`, error)
                );
        }
    }
}
