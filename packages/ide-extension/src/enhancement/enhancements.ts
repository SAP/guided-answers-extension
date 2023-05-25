import { extensions } from 'vscode';
import { isVSCodeCommand } from '@sap/guided-answers-extension-types';
import type { HTMLEnhancement, IDE } from '@sap/guided-answers-extension-types';
import { logString } from '../logger/logger';

import enhancementsJson from './enhancements.json';

/**
 * Classifies enhancements as applicable and inapplicable. There can be different reasons for a command to be
 * inapplicable, most likely because the extension hosting the command is not installed.
 *
 * @param enhancements - array of HTMLEnhancement
 * @param ide - runtime environment like VSCODE or SBAS
 * @returns - two arrays: applicable and inapplicable extensions
 */
function classifyEnhancements(
    enhancements: HTMLEnhancement[],
    ide: IDE
): { applicable: HTMLEnhancement[]; inapplicable: HTMLEnhancement[] } {
    const applicable: HTMLEnhancement[] = [];
    const inapplicable: HTMLEnhancement[] = [];

    for (const enhancement of enhancements) {
        if (enhancement?.command?.environment?.includes(ide)) {
            if (isVSCodeCommand(enhancement.command.exec)) {
                if (extensions.getExtension(enhancement.command.exec.extensionId)) {
                    applicable.push(enhancement);
                } else {
                    inapplicable.push(enhancement);
                }
            } else {
                applicable.push(enhancement);
            }
        } else {
            inapplicable.push(enhancement);
        }
    }
    return { applicable, inapplicable };
}

/**
 * Get the applicable html and node enhancements. Inapplicable will be logged to output.
 *
 * @param ide - runtime environment like VSCODE or SBAS
 * @returns - arrays applicable of html enhancements and node enhancements
 */
export function getHtmlEnhancements(ide: IDE): HTMLEnhancement[] {
    const htmlEnhancements = classifyEnhancements(enhancementsJson.htmlEnhancements as HTMLEnhancement[], ide);

    if (htmlEnhancements.applicable.length > 0) {
        logString(`Applicable html enhancements:\n${JSON.stringify(htmlEnhancements.applicable, null, 2)}`);
    }
    if (htmlEnhancements.inapplicable.length > 0) {
        logString(
            `Following html enhancements can not be applied and will not appear in Guided Answers:\n${JSON.stringify(
                htmlEnhancements.inapplicable,
                null,
                2
            )}`
        );
    }
    return htmlEnhancements.applicable;
}

/**
 * Get a string set of all installed extension ids.
 *
 * @returns - set with all installed extensions
 */
export function getInstalledExtensionIds(): Set<string> {
    return new Set<string>(extensions.all.map((ext) => ext.id.toLowerCase()));
}
