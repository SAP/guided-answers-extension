import * as os from 'os';
import { commands, window, workspace } from 'vscode';
import type { ConfigurationChangeEvent, Disposable, ExtensionContext, LogOutputChannel } from 'vscode';
import { initTelemetry, setCommonProperties, trackAction, trackEvent } from '../../src/telemetry/telemetry';
import type { Contracts } from 'applicationinsights';
import { activate } from '../../src/extension';
import {
    AppState,
    GuidedAnswerNode,
    GuidedAnswerTree,
    SendTelemetry,
    UpdateActiveNode,
    UpdateBookmarks,
    Bookmark
} from '@sap/guided-answers-extension-types';
import { TelemetryEvent, TelemetryReporter } from '../../src/types';
import packageJson from '../../package.json';
import { GuidedAnswerTreeSearchResult, UpdateGuidedAnswerTrees } from '../../../types/src/types';

jest.mock('applicationinsights', () => ({
    TelemetryClient: jest.fn().mockImplementation((key) => ({
        addTelemetryProcessor: jest.fn(),
        channel: { setUseDiskRetryCaching: jest.fn() },
        context: { tags: {}, keys: {} },
        key,
        trackEvent: jest.fn()
    }))
}));
jest.mock('os');
jest.spyOn(os, 'arch').mockImplementation(() => 'arch' as any);
jest.spyOn(os, 'platform').mockImplementation(() => 'platform' as any);
jest.spyOn(os, 'release').mockImplementation(() => '1.2.3release' as any);

const loggerMock = { trace: jest.fn(), error: jest.fn() } as unknown as LogOutputChannel;
jest.spyOn(window, 'createOutputChannel').mockImplementation(() => loggerMock);

describe('Test for initTelemetry()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Init telemetry, enabled in config', () => {
        // Mock setup
        jest.spyOn(workspace, 'getConfiguration').mockReturnValue({ get: () => true } as any);
        let envelope = {
            tags: { ['ai.location.ip']: '1.2.3.4', ['ai.cloud.roleInstance']: 'role-instance' }
        } as Partial<Contracts.Envelope>;

        // Test execution
        const reporter = initTelemetry();
        (reporter.client.addTelemetryProcessor as jest.Mock).mock.calls[0][0](envelope as Contracts.Envelope);

        // Result check
        expect(envelope).toEqual({ tags: { ['ai.location.ip']: '0.0.0.0', ['ai.cloud.roleInstance']: 'masked' } });
        expect(reporter.enabled).toBe(true);
        expect(typeof reporter.dispose).toBe('function');
    });
});

describe('Telemetry trackEvent() tests', () => {
    let reporter: TelemetryReporter;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(commands, 'registerCommand');
        jest.spyOn(workspace, 'getConfiguration').mockReturnValue({ get: () => true } as any);

        const context = {
            subscriptions: []
        };
        activate(context as unknown as ExtensionContext);
        reporter = context.subscriptions[0] as TelemetryReporter;
    });

    test('set common properties and track event, telemetry enabled', () => {
        // Test execution
        setCommonProperties({ ide: 'SBAS', devSpace: 'DevSpace', apiHost: 'any:host', apiVersion: 'v1' });
        trackEvent({ name: 'STARTUP', properties: { treeId: 1, nodeIdPath: '2:3:4' } } as unknown as TelemetryEvent);

        // Result check
        expect(reporter.client.trackEvent).toBeCalledWith({
            name: 'sap-guided-answers-extension/STARTUP',
            properties: {
                apiHost: 'any:host',
                apiVersion: 'v1',
                'cmn.appstudio': 'true',
                'cmn.devspace': 'DevSpace',
                'common.os': 'platform',
                'common.nodeArch': 'arch',
                'common.platformversion': '1.2.3',
                'common.extname': packageJson.name,
                'common.extversion': packageJson.version,
                nodeIdPath: '2:3:4',
                treeId: '1'
            }
        });
    });

    test('error handling when track event throws error', () => {
        // Mock setup
        jest.spyOn(reporter.client, 'trackEvent').mockImplementationOnce(() => {
            throw Error('TRACK_EVENT_ERROR');
        });

        // Test execution
        trackEvent({ name: 'STARTUP', properties: { treeId: 1, nodeIdPath: '2:3:4' } } as unknown as TelemetryEvent);

        // Result check
        expect(loggerMock.error).toHaveBeenCalledWith(
            expect.stringContaining('Error'),
            expect.objectContaining({ message: 'TRACK_EVENT_ERROR' })
        );
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
        expect(telemetryReporter.client.trackEvent).toBeCalledWith({
            name: 'sap-guided-answers-extension/USER_INTERACTION',
            properties: {
                action: 'OPEN_TREE',
                treeId: '10',
                treeTitle: 'Title'
            }
        });
        expect(loggerMock.trace).toBeCalledWith(expect.stringContaining('USER_INTERACTION'), {
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
        expect(telemetryReporter.client.trackEvent).toBeCalledWith({
            name: 'sap-guided-answers-extension/USER_INTERACTION',
            properties: {
                action: 'NODE_SELECTED',
                isFinalNode: 'false',
                treeId: '1',
                treeTitle: 'Title',
                lastNodeId: '3',
                lastNodeTitle: 'last node',
                nodeIdPath: '2:3',
                nodeLevel: '2'
            }
        });
    });

    test('send GO_TO_PREVIOUS_PAGE action', () => {
        // Mock setup
        const mockAction = getDummyAction('GO_TO_PREVIOUS_PAGE');
        delete mockAction.payload.state.activeGuidedAnswer;

        // Test execution
        trackAction(mockAction);

        // Result check
        expect(telemetryReporter.client.trackEvent).toBeCalledWith({
            name: 'sap-guided-answers-extension/USER_INTERACTION',
            properties: {
                action: 'GO_BACK_IN_TREE',
                treeId: '',
                treeTitle: '',
                lastNodeId: '3',
                lastNodeTitle: 'last node',
                nodeIdPath: '2:3',
                nodeLevel: '2'
            }
        });
    });

    test('send SEND_FEEDBACK_OUTCOME action', () => {
        // Mock setup
        const mockAction = getDummyAction('SEND_FEEDBACK_OUTCOME');
        delete mockAction.payload.state.activeGuidedAnswer;

        // Test execution
        trackAction(mockAction);

        // Result check
        expect(telemetryReporter.client.trackEvent).toBeCalledWith({
            name: 'sap-guided-answers-extension/USER_INTERACTION',
            properties: {
                action: 'SELECT_OUTCOME',
                treeId: '',
                treeTitle: '',
                lastNodeId: '3',
                lastNodeTitle: 'last node',
                nodeIdPath: '2:3',
                nodeLevel: '2',
                solved: 'false'
            }
        });
    });

    test('send SEND_FEEDBACK_COMMENT action', () => {
        // Mock setup
        const mockAction = getDummyAction('SEND_FEEDBACK_COMMENT');
        delete mockAction.payload.state.activeGuidedAnswer;

        // Test execution
        trackAction(mockAction);

        // Result check
        expect(telemetryReporter.client.trackEvent).toBeCalledWith({
            name: 'sap-guided-answers-extension/USER_INTERACTION',
            properties: {
                action: 'COMMENT',
                treeId: '',
                treeTitle: '',
                lastNodeId: '3',
                lastNodeTitle: 'last node',
                nodeIdPath: '2:3',
                nodeLevel: '2'
            }
        });
    });

    test('send UPDATE_GUIDED_ANSWER_TREES action', () => {
        // Mock setup
        const mockAction = getDummyAction('UPDATE_GUIDED_ANSWER_TREES');
        delete mockAction.payload.state.activeGuidedAnswer;
        (mockAction.payload.action as UpdateGuidedAnswerTrees).payload = {
            searchResult: {} as GuidedAnswerTreeSearchResult
        };

        // Test execution
        trackAction(mockAction);

        // Result check
        expect(telemetryReporter.client.trackEvent).toBeCalledWith({
            name: 'sap-guided-answers-extension/USER_INTERACTION',
            properties: {
                action: 'SEARCH',
                treeCount: '',
                productFilterCount: '',
                componentFilterCount: ''
            }
        });
    });

    test('send EXECUTE_COMMAND action', () => {
        // Mock setup
        const mockAction = getDummyAction('EXECUTE_COMMAND');
        delete mockAction.payload.state.activeGuidedAnswer;

        // Test execution
        trackAction(mockAction);

        // Result check
        expect(telemetryReporter.client.trackEvent).toBeCalledWith({
            name: 'sap-guided-answers-extension/USER_INTERACTION',
            properties: {
                action: 'EXECUTE_COMMAND',
                commandLabel: '',
                treeId: '',
                treeTitle: '',
                lastNodeId: '3',
                lastNodeTitle: 'last node',
                nodeIdPath: '2:3',
                nodeLevel: '2'
            }
        });
    });

    test('send SET_COMPONENT_FILTERS action', () => {
        // Mock setup
        const mockAction = getDummyAction('SET_COMPONENT_FILTERS');
        delete mockAction.payload.state.activeGuidedAnswer;

        // Test execution
        trackAction(mockAction);

        // Result check
        expect(telemetryReporter.client.trackEvent).toBeCalledWith({
            name: 'sap-guided-answers-extension/USER_INTERACTION',
            properties: {
                action: 'FILTER_COMPONENTS'
            }
        });
    });

    test('send SET_PRODUCT_FILTERS action', () => {
        // Mock setup
        const mockAction = getDummyAction('SET_PRODUCT_FILTERS');
        delete mockAction.payload.state.activeGuidedAnswer;

        // Test execution
        trackAction(mockAction);

        // Result check
        expect(telemetryReporter.client.trackEvent).toBeCalledWith({
            name: 'sap-guided-answers-extension/USER_INTERACTION',
            properties: {
                action: 'FILTER_PRODUCTS'
            }
        });
    });

    test('send SHARE_LINK_TELEMETRY action', () => {
        // Mock setup
        const mockAction = getDummyAction('SHARE_LINK_TELEMETRY');
        delete mockAction.payload.state.activeGuidedAnswer;

        // Test execution
        trackAction(mockAction);

        // Result check
        expect(telemetryReporter.client.trackEvent).toBeCalledWith({
            name: 'sap-guided-answers-extension/USER_INTERACTION',
            properties: {
                action: 'SHARE_LINK'
            }
        });
    });

    test('send OPEN_LINK_TELEMETRY action', () => {
        // Mock setup
        const mockAction = getDummyAction('OPEN_LINK_TELEMETRY');
        delete mockAction.payload.state.activeGuidedAnswer;

        // Test execution
        trackAction(mockAction);

        // Result check
        expect(telemetryReporter.client.trackEvent).toBeCalledWith({
            name: 'sap-guided-answers-extension/USER_INTERACTION',
            properties: {
                action: 'OPEN_LINK'
            }
        });
    });

    test('send RESET_FILTERS action', () => {
        // Mock setup
        const mockAction = getDummyAction('RESET_FILTERS');
        delete mockAction.payload.state.activeGuidedAnswer;

        // Test execution
        trackAction(mockAction);

        // Result check
        expect(telemetryReporter.client.trackEvent).toBeCalledWith({
            name: 'sap-guided-answers-extension/USER_INTERACTION',
            properties: {
                action: 'CLEAR_FILTERS'
            }
        });
    });

    test('send UPDATE_BOOKMARKS action, REMOVE_BOOKMARK', () => {
        // Mock setup
        const mockAction = getDummyAction('UPDATE_BOOKMARKS');
        delete mockAction.payload.state.activeGuidedAnswer;
        (mockAction.payload.action as UpdateBookmarks).payload.bookmarkKey = '111';

        // Test execution
        trackAction(mockAction);

        // Result check
        expect(telemetryReporter.client.trackEvent).toBeCalledWith({
            name: 'sap-guided-answers-extension/USER_INTERACTION',
            properties: {
                action: 'REMOVE_BOOKMARK',
                treeId: '',
                treeTitle: '',
                lastNodeId: '3',
                lastNodeTitle: 'last node',
                nodeIdPath: '2:3',
                nodeLevel: '2'
            }
        });
    });

    test('send UPDATE_BOOKMARKS action, ADD_BOOKMARK', () => {
        // Mock setup
        const mockAction = getDummyAction('UPDATE_BOOKMARKS');
        delete mockAction.payload.state.activeGuidedAnswer;
        (mockAction.payload.action as UpdateBookmarks).payload.bookmarkKey = 'abc';
        mockAction.payload.state.bookmarks = { abc: {} as Bookmark };

        // Test execution
        trackAction(mockAction);

        // Result check
        expect(telemetryReporter.client.trackEvent).toBeCalledWith({
            name: 'sap-guided-answers-extension/USER_INTERACTION',
            properties: {
                action: 'ADD_BOOKMARK',
                treeId: '',
                treeTitle: '',
                lastNodeId: '3',
                lastNodeTitle: 'last node',
                nodeIdPath: '2:3',
                nodeLevel: '2'
            }
        });
    });

    test('send UPDATE_BOOKMARKS action, SYNC_BOOKMARK', () => {
        // Mock setup
        const mockAction = getDummyAction('UPDATE_BOOKMARKS');
        delete mockAction.payload.state.activeGuidedAnswer;
        (mockAction.payload.action as UpdateBookmarks).payload.bookmarkKey = undefined;

        // Test execution
        trackAction(mockAction);

        // Result check
        expect(telemetryReporter.client.trackEvent).toBeCalledWith({
            name: 'sap-guided-answers-extension/USER_INTERACTION',
            properties: {
                action: 'SYNC_BOOKMARK',
                treeId: '',
                treeTitle: '',
                lastNodeId: '3',
                lastNodeTitle: 'last node',
                nodeIdPath: '2:3',
                nodeLevel: '2'
            }
        });
    });

    test('send SYNCHRONIZE_BOOKMARK action', () => {
        // Mock setup
        const mockAction = getDummyAction('SYNCHRONIZE_BOOKMARK');
        delete mockAction.payload.state.activeGuidedAnswer;

        // Test execution
        trackAction(mockAction);

        // Result check
        expect(telemetryReporter.client.trackEvent).toBeCalledWith({
            name: 'sap-guided-answers-extension/USER_INTERACTION',
            properties: {
                action: 'CLICK_BOOKMARK',
                treeId: '',
                treeTitle: '',
                lastNodeId: '3',
                lastNodeTitle: 'last node',
                nodeIdPath: '2:3',
                nodeLevel: '2'
            }
        });
    });

    test('error handling when track action throws error', () => {
        // Mock setup
        const mockAction = getDummyAction('SET_ACTIVE_TREE');
        (mockAction.payload.action as any).payload = undefined;

        // Test execution
        trackAction(mockAction);

        // Result check
        expect(loggerMock.error).toHaveBeenCalledWith(
            expect.stringContaining('SET_ACTIVE_TREE'),
            expect.objectContaining({ message: expect.stringContaining('TREE_ID') })
        );
    });
});

describe('Telemetry disabled', () => {
    let reporter: TelemetryReporter;

    beforeEach(() => {
        jest.clearAllMocks();
        reporter = initTelemetry();
        reporter.dispose();
    });

    test('Track event when telemetry is disabled, should not send anything', () => {
        // Mock setup
        jest.spyOn(workspace, 'getConfiguration').mockReturnValue({ get: () => false } as any);

        // Test execution
        reporter = initTelemetry();
        trackEvent({ name: '', properties: {} } as unknown as TelemetryEvent);

        // Result check
        expect(reporter.client.trackEvent).not.toBeCalled();
    });

    test('Track action when telemetry is disabled, should not send anything', () => {
        // Mock setup
        jest.spyOn(workspace, 'getConfiguration').mockReturnValue({ get: () => false } as any);

        // Test execution
        reporter = initTelemetry();
        trackAction(getDummyAction(''));

        // Result check
        expect(reporter.client.trackEvent).not.toBeCalled();
    });

    test('Toggle telemetry setting', () => {
        // Mock setup
        let enabled = false;
        jest.spyOn(workspace, 'getConfiguration').mockReturnValue({ get: () => enabled } as any);

        // Test execution
        reporter = initTelemetry();
        trackEvent({ name: '', properties: {} } as unknown as TelemetryEvent);

        // Result check
        expect(reporter.enabled).toBe(false);
        expect(reporter.client.trackEvent).not.toBeCalled();

        // Enable telemetry
        reporter.dispose();
        let changeHandler: (e: ConfigurationChangeEvent) => any = () => {};
        jest.spyOn(workspace, 'onDidChangeConfiguration').mockImplementation(
            (listener: (e: ConfigurationChangeEvent) => any) => {
                changeHandler = listener;
                return {} as Disposable;
            }
        );
        reporter = initTelemetry();
        enabled = true;
        changeHandler({} as ConfigurationChangeEvent);

        // Test again
        trackEvent({ name: '', properties: {} } as unknown as TelemetryEvent);

        // Result check
        expect(reporter.enabled).toBe(true);
        expect(reporter.client.trackEvent).toBeCalled();
    });
});

describe('Test for setCommonProperties()', () => {
    let reporter: TelemetryReporter;

    beforeEach(() => {
        jest.clearAllMocks();
        if (reporter) {
            reporter.dispose();
        }
        reporter = initTelemetry();
    });

    test('Set common properties for VSCode, no release', () => {
        jest.spyOn(os, 'release').mockImplementation(() => undefined as any);
        setCommonProperties({ ide: 'VSCODE', devSpace: '', apiHost: 'host:port', apiVersion: 'v4' });
        expect(reporter.commonProperties).toEqual({
            apiHost: 'host:port',
            apiVersion: 'v4',
            'cmn.appstudio': 'false',
            'cmn.devspace': '',
            'common.os': 'platform',
            'common.nodeArch': 'arch',
            'common.platformversion': '',
            'common.extname': packageJson.name,
            'common.extversion': packageJson.version
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
                ] as unknown as GuidedAnswerNode[],
                bookmarks: {}
            } as unknown as AppState
        }
    };
}
