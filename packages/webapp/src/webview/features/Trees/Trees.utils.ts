import { actions } from '../../state';

import type {
    GuidedAnswersQueryFilterOptions,
    GuidedAnswersQueryPagingOptions
} from '@sap/guided-answers-extension-types';

export const fetchTreesData = (
    query: string,
    filters: GuidedAnswersQueryFilterOptions,
    paging: GuidedAnswersQueryPagingOptions
): void => {
    actions.searchTree({
        query: query,
        filters: filters,
        paging: paging
    });
};
