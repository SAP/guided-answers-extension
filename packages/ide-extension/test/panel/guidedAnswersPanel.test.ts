import { window, WebviewPanel, commands } from 'vscode';
import * as apiMock from '@sap/guided-answers-extension-core';
import {
    EXECUTE_COMMAND,
    SEARCH_TREE,
    SELECT_NODE,
    SET_ACTIVE_TREE,
    UPDATE_ACTIVE_NODE,
    UPDATE_GUIDED_ANSWER_TREES,
    UPDATE_LOADING,
    WEBVIEW_READY,
    BETA_FEATURES
} from '@sap/guided-answers-extension-types';
import type {
    Command,
    GuidedAnswerActions,
    GuidedAnswerAPI,
    GuidedAnswerNodeId,
    GuidedAnswerTree,
    GuidedAnswerTreeId
} from '@sap/guided-answers-extension-types';
import { GuidedAnswersPanel } from '../../src/panel/guidedAnswersPanel';
import * as logger from '../../src/logger/logger';
import { StartOptions } from '../../src/types';

type WebviewMessageCallback = (action: GuidedAnswerActions) => void;

describe('GuidedAnswersPanel', () => {
    let loggerMock: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        loggerMock = jest.spyOn(logger, 'logString').mockImplementation(() => null);
    });

    test('Smoketest new GuidedAnswersPanel', () => {
        // Test execution
        const gaPanel = new GuidedAnswersPanel();

        // Result check
        expect(gaPanel).toBeDefined();
    });

    test('GuidedAnswersPanel communication WEBVIEW_READY', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);

        // Test execution
        new GuidedAnswersPanel();
        await onDidReceiveMessageMock({ type: WEBVIEW_READY });

        // Result check
        expect(loggerMock).toBeCalledWith('Webview is ready to receive actions');
    });

    test('GuidedAnswersPanel communication WEBVIEW_READY with start paramter tree id', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        jest.spyOn(apiMock, 'getGuidedAnswerApi').mockImplementation(() => getApiMock(1234));

        // Test execution
        new GuidedAnswersPanel({ treeId: 1 });
        await onDidReceiveMessageMock({ type: WEBVIEW_READY });

        // Result check
        expect(loggerMock).toBeCalledWith('Webview is ready to receive actions');
        expect((webViewPanelMock.webview.postMessage as jest.Mock).mock.calls).toEqual([
            [{ type: SET_ACTIVE_TREE, payload: { TREE_ID: 1, FIRST_NODE_ID: 1234 } }],
            [{ type: UPDATE_ACTIVE_NODE, payload: { NODE_ID: 1234, TITLE: 'Node 1234' } }],
            [{ type: BETA_FEATURES, payload: false }],
            [{ type: UPDATE_LOADING, payload: false }]
        ]);
    });

    test('GuidedAnswersPanel communication WEBVIEW_READY with start paramters tree id and node path', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        jest.spyOn(apiMock, 'getGuidedAnswerApi').mockImplementation(() => getApiMock());

        // Test execution
        new GuidedAnswersPanel({ treeId: 11, nodeIdPath: [100, 200, 300] });
        await onDidReceiveMessageMock({ type: WEBVIEW_READY });

        // Result check
        expect(loggerMock).toBeCalledWith('Webview is ready to receive actions');
        expect((webViewPanelMock.webview.postMessage as jest.Mock).mock.calls).toEqual([
            [{ type: SET_ACTIVE_TREE, payload: { TREE_ID: 11 } }],
            [{ type: UPDATE_ACTIVE_NODE, payload: { NODE_ID: 100 } }],
            [{ type: UPDATE_ACTIVE_NODE, payload: { NODE_ID: 200 } }],
            [{ type: UPDATE_ACTIVE_NODE, payload: { NODE_ID: 300 } }],
            [{ type: BETA_FEATURES, payload: false }],
            [{ type: UPDATE_LOADING, payload: false }]
        ]);
    });

    test('GuidedAnswersPanel communication WEBVIEW_READY, processing start params throws exception', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        const localApiMock = getApiMock();
        localApiMock.getTreeById = () => {
            throw Error('MOCKED_API_ERROR');
        };
        jest.spyOn(apiMock, 'getGuidedAnswerApi').mockImplementation(() => localApiMock);

        // Test execution
        new GuidedAnswersPanel({ treeId: NaN });
        await onDidReceiveMessageMock({ type: WEBVIEW_READY });

        // Result check
        const errorLog = loggerMock.mock.calls.find((e) => e[0].includes('MOCKED_API_ERROR'))[0];
        expect(errorLog).toContain('treeId');
        expect(webViewPanelMock.webview.postMessage).toBeCalledWith({ type: UPDATE_LOADING, payload: false });
    });

    test('GuidedAnswersPanel communication WEBVIEW_READY, invalid start params', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);

        // Test execution
        new GuidedAnswersPanel('INVALID_PARAM' as unknown as StartOptions);
        await onDidReceiveMessageMock({ type: WEBVIEW_READY });

        // Result check
        expect(loggerMock.mock.calls.find((e) => e[0].includes('INVALID_PARAM'))[0]).toBeDefined();
        expect(webViewPanelMock.webview.postMessage).toBeCalledWith({ type: UPDATE_LOADING, payload: false });
    });

    test('GuidedAnswersPanel communication SELECT_NODE', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        jest.spyOn(apiMock, 'getGuidedAnswerApi').mockImplementation(() => getApiMock());

        // Test execution
        new GuidedAnswersPanel();
        await onDidReceiveMessageMock({ type: SELECT_NODE, payload: 42 });

        // Result check
        expect(webViewPanelMock.webview.postMessage).toBeCalledWith({
            type: UPDATE_ACTIVE_NODE,
            payload: { NODE_ID: 42, TITLE: 'Node 42' }
        });
    });

    test('GuidedAnswersPanel communication SELECT_NODE throws error', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        const localApiMock = getApiMock();
        localApiMock.getNodeById = () => {
            throw Error('GET_NODE_API_ERROR');
        };
        jest.spyOn(apiMock, 'getGuidedAnswerApi').mockImplementation(() => localApiMock);

        // Test execution
        new GuidedAnswersPanel();
        await onDidReceiveMessageMock({ type: SELECT_NODE, payload: NaN });

        // Result check
        const errorLog = loggerMock.mock.calls.find((e) => e[0].includes('GET_NODE_API_ERROR'))[0];
        expect(errorLog).toContain(SELECT_NODE);
        expect(webViewPanelMock.webview.postMessage).not.toBeCalled();
    });

    test('GuidedAnswersPanel communication EXECUTE_COMMAND', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        const commandMock = jest.spyOn(commands, 'executeCommand');

        // Test execution
        new GuidedAnswersPanel();
        await onDidReceiveMessageMock({
            type: EXECUTE_COMMAND,
            payload: {
                exec: {
                    commandId: 'MOCK.COMMAND',
                    extensionId: 'MOCKEXT',
                    argument: { arguments: { test: 'MOCKARG' } }
                }
            } as unknown as Command
        });

        // Result check
        expect(commandMock).toBeCalledWith('MOCK.COMMAND', { arguments: { test: 'MOCKARG' } });
    });

    test('GuidedAnswersPanel communication SEARCH_TREE', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        jest.spyOn(apiMock, 'getGuidedAnswerApi').mockImplementation(() => getApiMock());

        // Test execution
        new GuidedAnswersPanel();
        await onDidReceiveMessageMock({ type: SEARCH_TREE, payload: {} });

        // Result check
        expect(webViewPanelMock.webview.postMessage).toBeCalledWith({
            type: UPDATE_GUIDED_ANSWER_TREES,
            payload: [{ TREEE_ID: 1 }, { TREEE_ID: 2 }, { TREEE_ID: 3 }]
        });
    });

    test('GuidedAnswersPanel communication unhandled action', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);

        // Test execution
        new GuidedAnswersPanel();
        await onDidReceiveMessageMock({ type: 'UNHANDLED', payload: '' } as unknown as GuidedAnswerActions);

        // Result check
        expect(webViewPanelMock.webview.postMessage).not.toBeCalled();
    });
});

const getWebViewPanelMock = (onDidReceiveMessage: (callback: WebviewMessageCallback) => void) =>
    ({
        webview: {
            message: '',
            html: '',
            onDidReceiveMessage,
            asWebviewUri: jest.fn().mockReturnValue(''),
            cspSource: '',
            postMessage: jest.fn()
        },
        onDidChangeViewState: jest.fn(),
        onDidDispose: jest.fn(),
        reveal: jest.fn()
    } as unknown as WebviewPanel);

const getApiMock = (firstNodeId?: number) =>
    ({
        getTreeById: (treeId: GuidedAnswerTreeId) => {
            const tree = {
                TREE_ID: treeId
            } as unknown as GuidedAnswerTree;
            if (firstNodeId) {
                tree.FIRST_NODE_ID = firstNodeId;
            }
            return Promise.resolve(tree);
        },
        getNodeById: (nodeId: GuidedAnswerNodeId) => Promise.resolve({ NODE_ID: nodeId, TITLE: `Node ${nodeId}` }),
        getNodePath: (nodeIdPath: GuidedAnswerNodeId[]) =>
            Promise.resolve(nodeIdPath.map((nodeId) => ({ NODE_ID: nodeId }))),
        getTrees: () => Promise.resolve([{ TREEE_ID: 1 }, { TREEE_ID: 2 }, { TREEE_ID: 3 }])
    } as unknown as GuidedAnswerAPI);
