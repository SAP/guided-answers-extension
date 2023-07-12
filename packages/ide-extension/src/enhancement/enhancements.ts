import { extensions } from 'vscode';

/**
 * Get a string set of all installed extension ids.
 *
 * @returns - set with all installed extensions
 */
export function getInstalledExtensionIds(): Set<string> {
    return new Set<string>(extensions.all.map((ext) => ext.id.toLowerCase()));
}
