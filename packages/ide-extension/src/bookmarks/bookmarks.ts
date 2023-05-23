import type { Memento } from 'vscode';
import type { Bookmarks, GuidedAnswerTree } from '@sap/guided-answers-extension-types';
import { logString } from '../logger/logger';

let globalStateApi: Memento;

/**
 * Initialize the bookmark functionality by passing VSCode global state.
 *
 * @param globalState - VSCodes global state for extension
 */
export function initBookmarks(globalState: Memento) {
    globalStateApi = globalState;
}

/**
 * Return the list of stored bookmarks.
 *
 * @returns - list of bookmarks
 */
export function getAllBookmarks(): Bookmarks {
    const bookmarks: Bookmarks = globalStateApi?.get<Bookmarks>('bookmark') ?? {};
    return bookmarks;
}

/**
 * Update the stored bookmarks. If an empty array is passed, all bookmarks are deleted.
 *
 * @param bookmarks - array of bookmarks, if empty all bookmarks will be deleted
 */
export function updateBookmarks(bookmarks: Bookmarks): void {
    if (globalStateApi) {
        const newBookmarks = Object.keys(bookmarks).length > 0 ? bookmarks : undefined;
        // Clean bookmark, remove SCORE from tree when retrieved via search result list
        for (const bookmark in bookmarks) {
            delete (bookmarks[bookmark].tree as GuidedAnswerTree & { SCORE?: number }).SCORE;
        }
        globalStateApi
            .update('bookmark', newBookmarks)
            .then(undefined, (error) => logString(`Error updating bookmarks.\n${error?.toString()}`));
    }
}
