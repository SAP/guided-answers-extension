import type { Memento } from 'vscode';
import type { LastVisitedGuide } from '@sap/guided-answers-extension-types';
import { logString } from '../logger/logger';

let globalStateApi: Memento;

/**
 * Initialize the Last Visited functionality by passing VSCode global state.
 *
 * @param globalState - VSCodes global state for extension
 */
export function initLastVisited(globalState: Memento) {
    globalStateApi = globalState;
}

/**
 * Return the list of stored last visited guides.
 *
 * @returns - list of last visited guides
 */
export function getAllLastVisitedGuides(): LastVisitedGuide[] {
    return globalStateApi?.get<LastVisitedGuide[]>('lastVisitedGuides') ?? [];
}

/**
 * Update the stored last visited guides. If an empty array is passed, all last visited guides are deleted.
 *
 * @param lastVisitedGuides - array of last visited guides, if empty all last visited guides will be deleted
 */
export function updateLastVisitedGuides(lastVisitedGuides: LastVisitedGuide[]): void {
    globalStateApi
        .update('lastVisitedGuides', lastVisitedGuides)
        .then(undefined, (error) => logString(`Error updating lastVisitedGuides.\n${error?.toString()}`));
}
