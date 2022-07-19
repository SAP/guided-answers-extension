import { extensions } from 'vscode';
import { isVSCodeCommand } from '@sap/guided-answers-extension-types';
import type { IDE } from '@sap/guided-answers-extension-types';
import type { HTMLEnhancement, NodeEnhancement } from '@sap/guided-answers-extension-types';
import { logString } from '../logger/logger';

import enhancementsJson from './enhancements.json';

/**
 * Enumeration of environment variable used in AppStudio
 */
enum ENV {
    H2O_URL = 'H2O_URL'
}

/**
 * Enumeration of ide platform types
 */
enum IDE_PLATFORMS {
    VSCODE = 'VSCODE',
    BAS = 'BAS'
}

/**
 * Return the user development platform
 *
 * @returns - IDE type
 */
function getIde(): IDE {
    return process.env[ENV.H2O_URL] ? IDE_PLATFORMS.BAS : IDE_PLATFORMS.VSCODE;
}

/**
 * Classifies enhancements as applicable and inapplicable. There can be different reasons for a command to be
 * inapplicable, most likely because the extension hosting the command is not installed.
 *
 * @param enhancements - array of enhancements, either HTMLEnhancement or NodeEnhancement
 * @returns - two arrays: applicable and inapplicable extensions
 */
function classifyEnhancements<T extends HTMLEnhancement | NodeEnhancement>(
    enhancements: T[]
): { applicable: T[]; inapplicable: T[] } {
    const applicable: T[] = [];
    const inapplicable: T[] = [];

    for (const enhancement of enhancements) {
        if (isVSCodeCommand(enhancement.command.exec)) {
            if (
                extensions.getExtension(enhancement.command.exec.extensionId) &&
                enhancement.command.platforms.includes(getIde())
            ) {
                applicable.push(enhancement);
            } else {
                inapplicable.push(enhancement);
            }
        } else {
            applicable.push(enhancement);
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
    const htmlEnhancements = classifyEnhancements<HTMLEnhancement>(
        enhancementsJson.htmlEnhancements as HTMLEnhancement[]
    );
    const nodeEnhancements = classifyEnhancements<NodeEnhancement>(
        enhancementsJson.nodeEnhancements as NodeEnhancement[]
    );

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
    if (nodeEnhancements.applicable.length > 0) {
        logString(`Applicable html enhancements:\n${JSON.stringify(nodeEnhancements.applicable, null, 2)}`);
    }
    if (nodeEnhancements.inapplicable.length > 0) {
        logString(
            `Following node enhancements can not be applied and will not appear in Guided Answers:\n${JSON.stringify(
                nodeEnhancements.inapplicable,
                null,
                2
            )}`
        );
    }

    return {
        nodeEnhancements: nodeEnhancements.applicable,
        htmlEnhancements: htmlEnhancements.applicable
    };
}
