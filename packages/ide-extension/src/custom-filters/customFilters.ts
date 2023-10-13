import type { Memento } from 'vscode';
import type { FilterStack } from '@sap/guided-answers-extension-types';
import { logError } from '../logger/logger';

let globalStateApi: Memento;

/**
 * Initialize the custom filters functionality by passing VSCode global state.
 *
 * @param globalState - VSCodes global state for extension
 */
export function initCustomFilters(globalState: Memento) {
    globalStateApi = globalState;
}

/**
 * Return the list of stored custom filters.
 *
 * @returns - list of custom filters
 */
export function getAllCustomFilters(): FilterStack[] {
    return globalStateApi?.get<FilterStack[]>('customFilters') ?? [];
}

/**
 * Update the stored custom filters.
 *
 * @param customFilters - array of custom filters
 */
export function updateCustomFilters(customFilters: FilterStack[]) {
    globalStateApi
        .update('customFilters', customFilters)
        .then(undefined, (error) => logError(`Error updating customFilters.`, error));
}
