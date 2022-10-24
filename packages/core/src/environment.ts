import { core, devspace } from '@sap/bas-sdk';
import type { GuidedAnswersQueryFilterOptions, IDE } from '@sap/guided-answers-extension-types';
import environmentJson from './environment.json';

const devSpaceComponentsMap: { [devspace: string]: string[] } = environmentJson.devSpaceComponentsMap;

/**
 * Return the current IDE.
 *
 * @returns - currently used runtime IDE: Visual Studio Code (VSCODE) or Business Application Studio (SBAS)
 */
export async function getIde(): Promise<IDE> {
    let ide: IDE = 'VSCODE';
    try {
        ide = (await core.isAppStudio()) ? 'SBAS' : 'VSCODE';
    } catch {
        // Ignore exceptions and fall back to VSCODE
    }
    return ide;
}

/**
 * Return filter query for development environment (ide). This is usually used to set an
 * initial filter for Guided Answers trees.
 * Written this way to make it easy to extend. The new Set() ensures a unique list.
 *
 * @param ide - runtime IDE, VSCODE or SBAS
 * @returns - filters for given ide
 */
export async function getFiltersForIde(ide: IDE): Promise<GuidedAnswersQueryFilterOptions> {
    const filterOptions: GuidedAnswersQueryFilterOptions = {};
    let components: Set<string> = new Set();
    let basDevSpace;

    if (ide === 'SBAS') {
        basDevSpace = (await devspace.getDevspaceInfo())?.pack;
    }
    if (basDevSpace) {
        components = new Set(...components, getComponentsForDevSpace(basDevSpace));
    }
    if (components.size > 0) {
        filterOptions.component = Array.from(components);
    }
    return filterOptions;
}

/**
 * Get mapping from BAS dev space to components.
 *
 * @param devSpace - name of the BAS development space, like Basic or SAP Fiori
 * @returns - string array of components, used usually to filter
 */
function getComponentsForDevSpace(devSpace: string): string[] {
    return devSpaceComponentsMap[devSpace];
}
