import { extensions } from 'vscode';
import { isVSCodeCommand } from '@sap/guided-answers-extension-types';
import type { HTMLEnhancement, NodeEnhancement } from '@sap/guided-answers-extension-types';
import { logString } from '../logger/logger';

import enhancements from './enhancements.json';

/**
 * Dispatches enhancements into applicable and inapplicable. There can be different reasons for a command to be
 * inapplicable, most likely because the extension hosting the command is not installed.
 *
 * @param enhancements - array of enhancements, either HTMLEnhancement or NodeEnhancement
 * @returns - two arrays: applicable and inapplicable extensions
 */
function dispatchEnhancements<T extends HTMLEnhancement | NodeEnhancement>(
    enhancements: T[]
): { applicable: T[]; inapplicable: T[] } {
    const applicable: T[] = [];
    const inapplicable: T[] = [];

    for (const enhancement of enhancements) {
        if (
            isVSCodeCommand(enhancement.command.exec) &&
            !!extensions.getExtension(enhancement.command.exec.extensionId)
        ) {
            applicable.push(enhancement);
        } else {
            inapplicable.push(enhancement);
        }
    }
    return { applicable, inapplicable };
}

/**
 * Get the applicable html and node enhancements. Inapplicable will be logged to output.
 *
 * @returns - arrays applicable of html enhancements and node enhancements
 */
export function getEnhancements(): {
    nodeEnhancements: NodeEnhancement[];
    htmlEnhancements: HTMLEnhancement[];
} {
    const dispatchedHtmlEnhancements = dispatchEnhancements<HTMLEnhancement>(enhancements.htmlEnhancements);
    const dispatchedNodeEnhancements = dispatchEnhancements<NodeEnhancement>(enhancements.nodeEnhancements);

    if (dispatchedHtmlEnhancements.applicable.length > 0) {
        logString(`Applicable html enhancements:\n${JSON.stringify(dispatchedHtmlEnhancements.applicable, null, 2)}`);
    }
    if (dispatchedHtmlEnhancements.inapplicable.length > 0) {
        logString(
            `Following html enhancements can not be applied and will not appear in Guided Answers:\n${JSON.stringify(
                dispatchedHtmlEnhancements.inapplicable,
                null,
                2
            )}`
        );
    }
    if (dispatchedNodeEnhancements.applicable.length > 0) {
        logString(`Applicable html enhancements:\n${JSON.stringify(dispatchedNodeEnhancements.applicable, null, 2)}`);
    }
    if (dispatchedNodeEnhancements.inapplicable.length > 0) {
        logString(
            `Following node enhancements can not be applied and will not appear in Guided Answers:\n${JSON.stringify(
                dispatchedNodeEnhancements.inapplicable,
                null,
                2
            )}`
        );
    }

    return {
        nodeEnhancements: dispatchedNodeEnhancements.applicable,
        htmlEnhancements: dispatchedHtmlEnhancements.applicable
    };
}
