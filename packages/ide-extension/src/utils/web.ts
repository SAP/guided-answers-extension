import { Webview, Uri } from 'vscode';

export function getWebviewUri(webview: Webview, localResourceUri: Uri): Uri {
    return webview.asWebviewUri
        ? webview.asWebviewUri(localResourceUri)
        : localResourceUri.with({ scheme: 'vscode-resource' });
}

/**
 * @see SrvModelerCDSCmd.load()
 *
 * Script paths have to be fully qualified to work on windows, the use of the base is not sufficient
 *
 * @param uri - the to the directory where the
 */
export function getHtml(
    uri: string,
    title: string,
    bundleUri: string,
    vendorURI?: string,
    vendorCssURI?: string
): string {
    return `<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="google" content="notranslate">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>${title}</title>

        <base href="./">
        <link rel="stylesheet" type="text/css" href="${uri}${vendorCssURI}">
        <script type="text/javascript">
            function onResourceLoadError() {
                // Load failed - send command to restart webview
                try {
                    var vscodeMessenger = window.vscode || acquireVsCodeApi();
                    if (vscodeMessenger) {
                        vscodeMessenger.postMessage({"type": "RESTART_WEBVIEW"});
                    }
                    // Rewrite function to avoid multiple restarts - restart logic should be callod only once
                    onResourceLoadError = function(){};
                } catch(e) {
                    console.log(e);
                }
            }
        </script>
        ${vendorURI !== undefined ? `<script src="${uri}${vendorURI}" onerror="onResourceLoadError()"></script>` : ''}
    </head>
    <body>
        <noscript>You need to enable JavaScript to run this app.</noscript>
        <div id="root"></div>
        <script src="${uri}${bundleUri}" onerror="onResourceLoadError()"></script>
    </body>
</html>
`;
}
