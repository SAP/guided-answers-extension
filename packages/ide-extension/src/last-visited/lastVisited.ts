import type { Memento } from 'vscode';
import type { LastVisitedGuides, GuidedAnswerTree } from '@sap/guided-answers-extension-types';
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
export function getAllLastVisitedGuides(): LastVisitedGuides {
    // globalStateApi
    //     .update('lastVisitedGuides', undefined)
    //     .then(undefined, (error) => logString(`Error updating lastVisitedGuides.\n${error?.toString()}`));
    const lastVisitedGuides: LastVisitedGuides = globalStateApi?.get<LastVisitedGuides>('lastVisitedGuides') ?? [];
    console.log('FROM getAllLastVisitedGuides --->', lastVisitedGuides);
    return lastVisitedGuides;
}

/**
 * Update the stored last visited guides. If an empty array is passed, all last visited guides are deleted.
 *
 * @param lastVisitedGuides - array of last visited guides, if empty all last visited guides will be deleted
 */
export function updateLastVisitedGuides(lastVisitedGuides: LastVisitedGuides): void {
    if (globalStateApi) {
        console.log('FROM updateLastVisitedGuides --->', lastVisitedGuides);
        // const newLastVisitedGuides = Object.keys(lastVisitedGuides).length > 0 ? lastVisitedGuides : undefined;
        // // Clean Last Visited, remove SCORE from tree when retrieved via search result list
        // for (const lastVisitedGuide in lastVisitedGuides) {
        //     delete (lastVisitedGuides[lastVisitedGuide].tree as GuidedAnswerTree & { SCORE?: number }).SCORE;
        // }
        globalStateApi
            .update('lastVisitedGuides', lastVisitedGuides)
            .then(undefined, (error) => logString(`Error updating lastVisitedGuides.\n${error?.toString()}`));
    }
}
