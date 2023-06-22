import { SendTelemetry, SEND_TELEMETRY, SET_ACTIVE_TREE } from '@sap/guided-answers-extension-types';
import type { AppState } from '@sap/guided-answers-extension-types';
import { actionMap } from '../../src/telemetry/action-map';

describe('Test action mapping', () => {
    test('Test SET_ACTIVE_TREE map with initial state', () => {
        // Mock setup
        const state = { activeGuidedAnswerNode: [], bookmarks: {} } as unknown as AppState;
        const telAction = {
            type: SEND_TELEMETRY,
            payload: {
                state,
                action: {
                    type: SET_ACTIVE_TREE,
                    payload: {
                        TREE_ID: 1234
                    }
                }
            }
        } as unknown as SendTelemetry;

        // Test execution
        const result = actionMap[SET_ACTIVE_TREE](telAction);

        // Result check
        expect(result).toEqual({ action: 'OPEN_TREE', treeId: '1234', treeTitle: '' });
    });
});
