import type TelemetryReporter from '@vscode/extension-telemetry';
import { ExtensionContext, commands } from 'vscode';
import { setCommonProperties, trackAction, trackEvent } from '../../src/telemetry/telemetry';
import * as logger from '../../src/logger/logger';
import { activate } from '../../src/extension';
import {
    AppState,
    GuidedAnswerNode,
    GuidedAnswerTree,
    SendTelemetry,
    UpdateActiveNode
} from '@sap/guided-answers-extension-types';
import { TelemetryEvent } from '../../src/types';

describe('Telemetry trackEvent() tests', () => {
    let telemetryReporter: TelemetryReporter;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(commands, 'registerCommand');
        jest.spyOn(logger, 'logString').mockImplementation(() => null);
        const context = {
            subscriptions: []
        };
        activate(context as unknown as ExtensionContext);
        telemetryReporter = context.subscriptions[0] as TelemetryReporter;
    });

    test('set common properties and track event', () => {
        // Mock setup

        // Test execution
        setCommonProperties({ ide: 'SBAS', devSpace: 'DevSpace', apiHost: 'any:host', apiVersion: 'v1' });
        trackEvent({ name: 'STARTUP', properties: { treeId: 1, nodeIdPath: '2:3:4' } } as unknown as TelemetryEvent);

        // Result check
        expect(telemetryReporter.sendTelemetryEvent).toBeCalledWith('STARTUP', {
            apiHost: 'any:host',
            apiVersion: 'v1',
            'cmn.appstudio': 'true',
            'cmn.devspace': 'DevSpace',
            nodeIdPath: '2:3:4',
            treeId: '1'
        });
    });
});

describe('Telemetry trackAction() tests', () => {
    let telemetryReporter: TelemetryReporter;
    beforeAll(() => {
        setCommonProperties();
    });

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(commands, 'registerCommand');
        jest.spyOn(logger, 'logString').mockImplementation(() => null);
        const context = {
            subscriptions: []
        };
        activate(context as unknown as ExtensionContext);
        telemetryReporter = context.subscriptions[0] as TelemetryReporter;
    });

    test('send SET_ACTIVE_TREE action', () => {
        // Mock setup
        const mockAction = getDummyAction('SET_ACTIVE_TREE');
        if (mockAction.payload.action.type === 'SET_ACTIVE_TREE') {
            mockAction.payload.action.payload = { TREE_ID: 10 } as unknown as GuidedAnswerTree;
        }

        // Test execution
        trackAction(mockAction);

        // Result check
        expect(telemetryReporter.sendTelemetryEvent).toBeCalledWith('USER_INTERACTION', {
            action: 'OPEN_TREE',
            treeId: '10',
            treeTitle: 'Title'
        });
    });

    test('send UPDATE_ACTIVE_NODE action', () => {
        // Mock setup
        const mockAction = getDummyAction('UPDATE_ACTIVE_NODE');

        // Test execution
        trackAction(mockAction);

        // Result check
        expect(telemetryReporter.sendTelemetryEvent).toBeCalledWith('USER_INTERACTION', {
            action: 'NODE_SELECTED',
            treeId: '1',
            treeTitle: 'Title',
            lastNodeId: '3',
            lastNodeTitle: 'last node',
            nodeIdPath: '2:3',
            nodeLevel: '2'
        });
    });

    test('send GO_TO_PREVIOUS_PAGE action', () => {
        // Mock setup
        const mockAction = getDummyAction('GO_TO_PREVIOUS_PAGE');
        delete mockAction.payload.state.activeGuidedAnswer;

        // Test execution
        trackAction(mockAction);

        // Result check
        expect(telemetryReporter.sendTelemetryEvent).toBeCalledWith('USER_INTERACTION', {
            action: 'GO_BACK_IN_TREE',
            treeId: '',
            treeTitle: '',
            lastNodeId: '3',
            lastNodeTitle: 'last node',
            nodeIdPath: '2:3',
            nodeLevel: '2'
        });
    });
});

function getDummyAction(actionName: string): SendTelemetry {
    return {
        type: 'SEND_TELEMETRY',
        payload: {
            action: { type: actionName, payload: {} } as unknown as UpdateActiveNode,
            state: {
                activeGuidedAnswer: { TREE_ID: 1, TITLE: 'Title' } as unknown as GuidedAnswerTree,
                activeGuidedAnswerNode: [
                    { NODE_ID: 2 },
                    { NODE_ID: 3, TITLE: 'last node' }
                ] as unknown as GuidedAnswerNode[]
            } as unknown as AppState
        }
    };
}
