import { extensions, Uri } from 'vscode';

export function pathToResourceUri(scriptDirectory: string): string {
    return Uri.file(scriptDirectory).with({ scheme: 'vscode-resource' }).toString();
}

export function uriToResourceUri(uri: Uri): string {
    return uri.with({ scheme: 'vscode-resource' }).toString();
}

export function isLcapDevSpace(): boolean {
    return !!extensions.getExtension('sapse.lcap-cockpit');
}
