import { commands } from 'vscode';
import type { ProviderResult, Uri, UriHandler } from 'vscode';
import { logString } from '../logger/logger';
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
        logString(`Guided Answers extension called from URI: ${link}`);
        const startOptions = extractLinkInfo(link);
        logString(`Extracted information from link: ${startOptions ? JSON.stringify(startOptions) : ''}`);
        if (startOptions && startOptions.treeId) {
            commands
                .executeCommand('sap.ux.guidedAnswer.openGuidedAnswer', startOptions)
                ?.then(undefined, (error) =>
                    logString(
                        `Error while executing start command 'sap.ux.guidedAnswer.openGuidedAnswer'.\n${error?.toString()}`
                    )
                );
        }
    }
}
