import type { LogOutputChannel, Memento, WebviewPanel } from 'vscode';
import { window, commands, ViewColumn } from 'vscode';
import * as coreMock from '@sap/guided-answers-extension-core';
import {
    EXECUTE_COMMAND,
    SEARCH_TREE,
    SELECT_NODE,
    NAVIGATE,
    SET_ACTIVE_TREE,
    UPDATE_ACTIVE_NODE,
    UPDATE_GUIDED_ANSWER_TREES,
    UPDATE_NETWORK_STATUS,
    WEBVIEW_READY,
    BETA_FEATURES,
    SEND_FEEDBACK_OUTCOME,
    SEND_FEEDBACK_COMMENT,
    SET_QUERY_VALUE,
    FILL_SHARE_LINKS,
    RESTORE_STATE,
    SEND_TELEMETRY,
    GET_BOOKMARKS,
    SYNCHRONIZE_BOOKMARK,
    UPDATE_BOOKMARKS,
    GET_LAST_VISITED_GUIDES,
    UPDATE_LAST_VISITED_GUIDES
} from '@sap/guided-answers-extension-types';
import type {
    Bookmarks,
    Command,
    GuidedAnswerActions,
    GuidedAnswerAPI,
    GuidedAnswerNode,
    GuidedAnswerNodeId,
    GuidedAnswerTree,
    GuidedAnswerTreeId,
    GuidedAnswerTreeSearchResult,
    LastVisitedGuide,
    AppState
} from '@sap/guided-answers-extension-types';
import { GuidedAnswersPanel, GuidedAnswersSerializer } from '../../src/panel/guidedAnswersPanel';
import * as logger from '../../src/logger/logger';
import * as telemetry from '../../src/telemetry';
import type { StartOptions } from '../../src/types';
import { initBookmarks } from '../../src/bookmarks';
import { initLastVisited } from '../../src/last-visited';

type WebviewMessageCallback = (action: GuidedAnswerActions) => void;

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
    }) as unknown as WebviewPanel;

const getApiMock = (firstNodeId?: number): GuidedAnswerAPI =>
    ({
        getApiInfo: () => ({ host: 'HOST', version: 'VERSION' }),
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
        getTrees: () => Promise.resolve([{ TREE_ID: 1 }, { TREE_ID: 2 }, { TREE_ID: 3 }]),
        sendFeedbackOutcome: jest.fn(),
        sendFeedbackComment: jest.fn()
    }) as unknown as GuidedAnswerAPI;

const delay = async (ms: number) => {
    return new Promise((resolve) => setTimeout(resolve, ms));
};

const loggerMock = { error: jest.fn(), info: jest.fn() } as Partial<LogOutputChannel>;
jest.spyOn(window, 'createOutputChannel').mockImplementation(() => loggerMock as LogOutputChannel);

describe('GuidedAnswersPanel', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Smoke test new GuidedAnswersPanel', () => {
        // Test execution
        const gaPanel = new GuidedAnswersPanel();

        // Result check
        expect(gaPanel).toBeDefined();
    });

    test('Startup error for telemetry', async () => {
        // Mock setup
        jest.spyOn(telemetry, 'trackEvent').mockRejectedValueOnce('TELEMETRY_ERROR');

        // Test execution
        new GuidedAnswersPanel();

        // Result check
        await (() => new Promise(setImmediate))();
        expect(loggerMock.error).toBeCalledWith(
            expect.stringContaining('Error'),
            expect.stringContaining('TELEMETRY_ERROR')
        );
    });

    test('GuidedAnswersPanel communication WEBVIEW_READY', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);

        // Test execution
        const panel = new GuidedAnswersPanel();
        panel.show();
        await onDidReceiveMessageMock({ type: WEBVIEW_READY });

        // Result check
        expect(loggerMock.info).toBeCalledWith('Webview is ready to receive actions');
    });

    test('GuidedAnswersPanel for SBAS, should set quick filters', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        const getFiltersForIdeSpy = jest
            .spyOn(coreMock, 'getFiltersForIde')
            .mockImplementation(() => Promise.resolve({ component: ['AB-CD', 'EFG-H'] }));

        // Test execution
        const panel = new GuidedAnswersPanel({ ide: 'SBAS' });
        panel.show();
        await onDidReceiveMessageMock({ type: WEBVIEW_READY });

        // Result check
        expect(loggerMock.info).toBeCalledWith('Webview is ready to receive actions');
        expect(getFiltersForIdeSpy).toBeCalledWith('SBAS');
        const searchCall = (webViewPanelMock.webview.postMessage as jest.Mock).mock.calls.find((c) =>
            c.find((p: { type: string }) => p.type === 'SET_QUICK_FILTERS')
        )[0];
        expect(searchCall).toEqual({ type: 'SET_QUICK_FILTERS', payload: [{ component: ['AB-CD', 'EFG-H'] }] });
    });

    test('GuidedAnswersPanel for SBAS with error in getFiltersForIde(), should log error', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        jest.spyOn(coreMock, 'getFiltersForIde').mockImplementation(() => {
            throw Error('GET_FILTERS_ERROR');
        });

        // Test execution
        const panel = new GuidedAnswersPanel({ ide: 'SBAS' });
        panel.show();
        await onDidReceiveMessageMock({ type: WEBVIEW_READY });

        // Result check
        expect(loggerMock.error).toBeCalledWith(
            expect.stringContaining('Error'),
            expect.objectContaining({
                message: 'GET_FILTERS_ERROR'
            })
        );
    });

    test('GuidedAnswersPanel communication WEBVIEW_READY with start parameter tree id', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        jest.spyOn(coreMock, 'getGuidedAnswerApi').mockImplementation(() => getApiMock(1234));

        // Test execution
        const panel = new GuidedAnswersPanel({ startOptions: { treeId: 1 } });
        panel.show();
        await onDidReceiveMessageMock({ type: WEBVIEW_READY });

        // Result check
        expect(loggerMock.info).toBeCalledWith('Webview is ready to receive actions');
        expect((webViewPanelMock.webview.postMessage as jest.Mock).mock.calls).toEqual([
            [{ type: SET_ACTIVE_TREE, payload: { TREE_ID: 1, FIRST_NODE_ID: 1234 } }],
            [{ type: UPDATE_ACTIVE_NODE, payload: { NODE_ID: 1234, TITLE: 'Node 1234' } }],
            [{ type: BETA_FEATURES, payload: false }],
            [{ type: UPDATE_NETWORK_STATUS, payload: 'OK' }],
            [{ type: GET_BOOKMARKS, payload: {} }],
            [{ type: GET_LAST_VISITED_GUIDES, payload: [] }]
        ]);
    });

    test('GuidedAnswersPanel communication WEBVIEW_READY with start parameters tree id and node path', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        jest.spyOn(coreMock, 'getGuidedAnswerApi').mockImplementation(() => getApiMock());

        // Test execution
        const panel = new GuidedAnswersPanel({ startOptions: { treeId: 11, nodeIdPath: [100, 200, 300] } });
        panel.show();
        await onDidReceiveMessageMock({ type: WEBVIEW_READY });

        // Result check
        expect(loggerMock.info).toBeCalledWith('Webview is ready to receive actions');
        expect((webViewPanelMock.webview.postMessage as jest.Mock).mock.calls).toEqual([
            [{ type: SET_ACTIVE_TREE, payload: { TREE_ID: 11 } }],
            [{ type: UPDATE_ACTIVE_NODE, payload: { NODE_ID: 100 } }],
            [{ type: UPDATE_ACTIVE_NODE, payload: { NODE_ID: 200 } }],
            [{ type: UPDATE_ACTIVE_NODE, payload: { NODE_ID: 300 } }],
            [{ type: BETA_FEATURES, payload: false }],
            [{ type: UPDATE_NETWORK_STATUS, payload: 'OK' }],
            [{ type: GET_BOOKMARKS, payload: {} }],
            [{ type: GET_LAST_VISITED_GUIDES, payload: [] }]
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
        jest.spyOn(coreMock, 'getGuidedAnswerApi').mockImplementation(() => localApiMock);

        // Test execution
        const panel = new GuidedAnswersPanel({ startOptions: { treeId: NaN } });
        panel.show();
        await onDidReceiveMessageMock({ type: WEBVIEW_READY });

        // Result check
        const errorLog = (loggerMock.error as jest.Mock).mock.calls.find((e) => e[0].includes('MOCKED_API_ERROR'))[1];
        expect(errorLog).toEqual({ treeId: NaN });
        expect(webViewPanelMock.webview.postMessage).toBeCalledWith({ type: UPDATE_NETWORK_STATUS, payload: 'OK' });
    });

    test('GuidedAnswersPanel communication WEBVIEW_READY, invalid start params', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);

        // Test execution
        const panel = new GuidedAnswersPanel({ startOptions: 'INVALID_PARAM' as unknown as StartOptions });
        panel.show();
        await onDidReceiveMessageMock({ type: WEBVIEW_READY });

        // Result check
        expect((loggerMock.error as jest.Mock).mock.calls.find((e) => e[1].includes('INVALID_PARAM'))[0]).toBeDefined();
        expect(webViewPanelMock.webview.postMessage).toBeCalledWith({ type: UPDATE_NETWORK_STATUS, payload: 'OK' });
    });

    test('GuidedAnswersPanel communication SELECT_NODE', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        jest.spyOn(coreMock, 'getGuidedAnswerApi').mockImplementation(() => getApiMock());

        // Test execution
        const panel = new GuidedAnswersPanel();
        panel.show();
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
        jest.spyOn(coreMock, 'getGuidedAnswerApi').mockImplementation(() => localApiMock);

        // Test execution
        const panel = new GuidedAnswersPanel();
        panel.show();
        await onDidReceiveMessageMock({ type: SELECT_NODE, payload: NaN });

        // Result check
        expect(loggerMock.error).toBeCalledWith(
            expect.stringContaining(SELECT_NODE),
            expect.stringContaining('GET_NODE_API_ERROR')
        );
        expect(webViewPanelMock.webview.postMessage).not.toBeCalled();
    });

    test('GuidedAnswersPanel communication NAVIGATE', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        jest.spyOn(coreMock, 'getGuidedAnswerApi').mockImplementation(() => getApiMock());

        // Test execution
        const panel = new GuidedAnswersPanel();
        panel.show();
        await onDidReceiveMessageMock({ type: NAVIGATE, payload: { treeId: 1, nodeIdPath: [1, 2, 3] } });

        // Result check
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(1, {
            type: UPDATE_NETWORK_STATUS,
            payload: 'LOADING'
        });
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(2, {
            type: SET_ACTIVE_TREE,
            payload: { TREE_ID: 1 }
        });
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(3, {
            type: UPDATE_ACTIVE_NODE,
            payload: { NODE_ID: 1 }
        });
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(4, {
            type: UPDATE_ACTIVE_NODE,
            payload: { NODE_ID: 2 }
        });
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(5, {
            type: UPDATE_ACTIVE_NODE,
            payload: { NODE_ID: 3 }
        });
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(6, {
            type: UPDATE_NETWORK_STATUS,
            payload: 'OK'
        });
    });

    test('GuidedAnswersPanel communication NAVIGATE throws error', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        const localApiMock = getApiMock();
        localApiMock.getTreeById = () => {
            throw Error('GET_TREE_API_ERROR');
        };
        jest.spyOn(coreMock, 'getGuidedAnswerApi').mockImplementation(() => localApiMock);

        // Test execution
        const panel = new GuidedAnswersPanel();
        panel.show();
        await onDidReceiveMessageMock({ type: NAVIGATE, payload: { treeId: 1, nodeIdPath: [1, 2, 3] } });

        // Result check
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(1, {
            type: UPDATE_NETWORK_STATUS,
            payload: 'LOADING'
        });
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(2, {
            type: UPDATE_NETWORK_STATUS,
            payload: 'ERROR'
        });
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
        const panel = new GuidedAnswersPanel();
        panel.show();
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
        jest.spyOn(coreMock, 'getGuidedAnswerApi').mockImplementation(() => getApiMock());

        // Test execution
        const panel = new GuidedAnswersPanel();
        panel.show();
        await onDidReceiveMessageMock({ type: SEARCH_TREE, payload: {} });

        // Result check
        expect(webViewPanelMock.webview.postMessage).toBeCalledWith({
            type: UPDATE_GUIDED_ANSWER_TREES,
            payload: { searchResult: [{ TREE_ID: 1 }, { TREE_ID: 2 }, { TREE_ID: 3 }] }
        });
    });

    test('GuidedAnswersPanel communication SEARCH_TREE with URL', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        jest.spyOn(coreMock, 'getGuidedAnswerApi').mockImplementation(() => getApiMock());

        // Test execution
        const panel = new GuidedAnswersPanel();
        panel.show();
        await onDidReceiveMessageMock({ type: SEARCH_TREE, payload: { query: '#/tree/12/actions/34:56' } });

        // Result check
        expect(webViewPanelMock.webview.postMessage).toBeCalledTimes(6);
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(1, {
            type: UPDATE_NETWORK_STATUS,
            payload: 'LOADING'
        });
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(2, {
            type: SET_ACTIVE_TREE,
            payload: { TREE_ID: 12 }
        });
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(3, {
            type: UPDATE_ACTIVE_NODE,
            payload: { NODE_ID: 34 }
        });
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(4, {
            type: UPDATE_ACTIVE_NODE,
            payload: { NODE_ID: 56 }
        });
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(5, {
            type: UPDATE_NETWORK_STATUS,
            payload: 'OK'
        });
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(6, {
            type: SET_QUERY_VALUE,
            payload: ''
        });
    });

    test('GuidedAnswersPanel communication SEARCH_TREE, server error', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        const apiMock = getApiMock();
        apiMock.getTrees = async () => {
            return Promise.reject();
        };
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        jest.spyOn(coreMock, 'getGuidedAnswerApi').mockReturnValue(apiMock);

        // Test execution
        const panel = new GuidedAnswersPanel();
        panel.show();
        await onDidReceiveMessageMock({
            type: SEARCH_TREE,
            payload: { query: 'any', paging: { responseSize: 5, offset: 0 } }
        });

        // Result check
        expect(webViewPanelMock.webview.postMessage).toBeCalledTimes(1);
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(1, {
            type: UPDATE_NETWORK_STATUS,
            payload: 'ERROR'
        });
    });

    test('GuidedAnswersPanel communication SEARCH_TREE with paging offset = 0 and delay, loading', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        const apiMock = getApiMock();
        apiMock.getTrees = async () => {
            await delay(2100);
            return Promise.resolve([
                { TREE_ID: 1 },
                { TREE_ID: 2 },
                { TREE_ID: 3 }
            ] as unknown as GuidedAnswerTreeSearchResult);
        };
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        jest.spyOn(coreMock, 'getGuidedAnswerApi').mockReturnValue(apiMock);

        // Test execution
        const panel = new GuidedAnswersPanel();
        panel.show();
        await onDidReceiveMessageMock({
            type: SEARCH_TREE,
            payload: { query: 'any', paging: { responseSize: 5, offset: 0 } }
        });

        // Result check
        // expect(webViewPanelMock.webview.postMessage).toBeCalledTimes(3);
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(1, {
            type: UPDATE_NETWORK_STATUS,
            payload: 'LOADING'
        });
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(2, {
            type: UPDATE_NETWORK_STATUS,
            payload: 'OK'
        });
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(3, {
            type: 'UPDATE_GUIDED_ANSWER_TREES',
            payload: {
                searchResult: [{ TREE_ID: 1 }, { TREE_ID: 2 }, { TREE_ID: 3 }],
                pagingOptions: { responseSize: 5, offset: 0 }
            }
        });
    });

    test('GuidedAnswersPanel communication SEARCH_TREE with paging offset > 0 and delay, not loading', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        const apiMock = getApiMock();
        apiMock.getTrees = async () => {
            await delay(2100);
            return Promise.resolve([
                { TREE_ID: 1 },
                { TREE_ID: 2 },
                { TREE_ID: 3 }
            ] as unknown as GuidedAnswerTreeSearchResult);
        };
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        jest.spyOn(coreMock, 'getGuidedAnswerApi').mockReturnValue(apiMock);

        // Test execution
        const panel = new GuidedAnswersPanel();
        panel.show();
        await onDidReceiveMessageMock({
            type: SEARCH_TREE,
            payload: { query: 'any', paging: { responseSize: 5, offset: 10 } }
        });

        // Result check
        expect(webViewPanelMock.webview.postMessage).toBeCalledTimes(2);
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(1, {
            type: UPDATE_NETWORK_STATUS,
            payload: 'OK'
        });
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(2, {
            type: 'UPDATE_GUIDED_ANSWER_TREES',
            payload: {
                searchResult: [{ TREE_ID: 1 }, { TREE_ID: 2 }, { TREE_ID: 3 }],
                pagingOptions: { responseSize: 5, offset: 10 }
            }
        });
    });

    test('GuidedAnswersPanel communication SEND_FEEDBACK_OUTCOME', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        const localApiMock = getApiMock();
        const guidedAnswerApiSpy = jest.spyOn(coreMock, 'getGuidedAnswerApi').mockImplementation(() => localApiMock);

        // Test execution
        const panel = new GuidedAnswersPanel();
        panel.show();
        await onDidReceiveMessageMock({ type: SEND_FEEDBACK_OUTCOME, payload: { nodeId: 1, treeId: 2, solved: true } });

        // Result check
        expect(guidedAnswerApiSpy).toBeCalled();
        expect(localApiMock.sendFeedbackOutcome).toBeCalledWith({ nodeId: 1, treeId: 2, solved: true });
    });

    test('GuidedAnswersPanel communication SEND_FEEDBACK_COMMENT', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        const localApiMock = getApiMock();
        const guidedAnswerApiSpy = jest.spyOn(coreMock, 'getGuidedAnswerApi').mockImplementation(() => localApiMock);

        // Test execution
        const panel = new GuidedAnswersPanel();
        panel.show();
        await onDidReceiveMessageMock({
            type: SEND_FEEDBACK_COMMENT,
            payload: { nodeId: 1, treeId: 2, comment: 'test' }
        });

        // Result check
        expect(guidedAnswerApiSpy).toBeCalled();
        expect(localApiMock.sendFeedbackComment).toBeCalledWith({ nodeId: 1, treeId: 2, comment: 'test' });
    });

    test('GuidedAnswersPanel communication FILL_SHARE_LINKS', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        const localApiMock = getApiMock();
        const guidedAnswerApiSpy = jest.spyOn(coreMock, 'getGuidedAnswerApi').mockImplementation(() => localApiMock);

        // Test execution
        const panel = new GuidedAnswersPanel();
        panel.show();
        await onDidReceiveMessageMock({
            type: FILL_SHARE_LINKS,
            payload: { treeId: 123, nodeIdPath: [456] }
        });

        // Result check
        expect(guidedAnswerApiSpy).toBeCalled();
    });

    test('GuidedAnswersPanel communication SEND_TELEMETRY with error handling', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() =>
            getWebViewPanelMock((callback: WebviewMessageCallback) => {
                onDidReceiveMessageMock = callback;
            })
        );
        const telemetryMock = jest.spyOn(telemetry, 'trackAction').mockRejectedValueOnce('TRACK_ACTION_ERROR');

        // Test execution
        const panel = new GuidedAnswersPanel();
        panel.show();
        await onDidReceiveMessageMock({
            type: SEND_TELEMETRY,
            payload: { action: { type: SEND_TELEMETRY, payload: {} as any }, state: {} as unknown as AppState }
        });

        // Result check
        await (() => new Promise(setImmediate))();
        expect(telemetryMock).toBeCalledWith({
            type: 'SEND_TELEMETRY',
            payload: {
                action: {
                    type: 'SEND_TELEMETRY',
                    payload: {}
                },
                state: {}
            }
        });
        expect(loggerMock.error).toBeCalledWith(
            expect.stringContaining('Error'),
            expect.stringContaining('TRACK_ACTION_ERROR')
        );
    });

    test('GuidedAnswersPanel communication SYNCHRONIZE_BOOKMARK', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        jest.spyOn(coreMock, 'getGuidedAnswerApi').mockImplementation(() => getApiMock(1));

        // Test execution
        const panel = new GuidedAnswersPanel();
        panel.show();
        await onDidReceiveMessageMock({
            type: SYNCHRONIZE_BOOKMARK,
            payload: {
                tree: { TREE_ID: 1, TITLE: 'One' } as GuidedAnswerTree,
                nodePath: [
                    { NODE_ID: 2, BODY: 'body2' } as GuidedAnswerNode,
                    { NODE_ID: 3, BODY: 'body3' } as GuidedAnswerNode
                ],
                createdAt: '2023-05-23T21:46:42.223Z'
            }
        });

        // Result check
        await (() => new Promise(setImmediate))();
        expect(webViewPanelMock.webview.postMessage).toBeCalledTimes(5);
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(1, {
            type: 'UPDATE_BOOKMARKS',
            payload: {
                bookmarks: {
                    '1-2:3': {
                        tree: {
                            TREE_ID: 1,
                            FIRST_NODE_ID: 1
                        },
                        nodePath: [
                            {
                                NODE_ID: 2
                            },
                            {
                                NODE_ID: 3
                            }
                        ],
                        createdAt: '2023-05-23T21:46:42.223Z'
                    }
                }
            }
        });
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(2, {
            type: 'GO_TO_ALL_ANSWERS'
        });
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(3, {
            type: 'SET_ACTIVE_TREE',
            payload: {
                TREE_ID: 1,
                FIRST_NODE_ID: 1
            }
        });
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(4, {
            type: 'UPDATE_ACTIVE_NODE',
            payload: {
                NODE_ID: 2
            }
        });
        expect(webViewPanelMock.webview.postMessage).toHaveBeenNthCalledWith(5, {
            type: 'UPDATE_ACTIVE_NODE',
            payload: {
                NODE_ID: 3
            }
        });
    });

    test('GuidedAnswersPanel communication UPDATE_BOOKMARKS', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() =>
            getWebViewPanelMock((callback: WebviewMessageCallback) => {
                onDidReceiveMessageMock = callback;
            })
        );
        const bookmarksMock = {
            '1-2:3': {
                tree: {
                    TREE_ID: 1,
                    TITLE: 'Bookmark Title',
                    SCORE: 0.1
                },
                nodePath: [{ NODE_ID: 2 }, { NODE_ID: 3 }],
                createdAt: '2023-05-23T15:41:00.478Z'
            }
        } as unknown as Bookmarks;
        const expectBookmarks = JSON.parse(JSON.stringify(bookmarksMock));
        delete expectBookmarks['1-2:3'].tree.SCORE;

        const globalStateMock = {
            update: jest.fn()
        } as Partial<Memento>;
        initBookmarks(globalStateMock as Memento);

        // Test execution
        const panel = new GuidedAnswersPanel();
        panel.show();
        await onDidReceiveMessageMock({
            type: UPDATE_BOOKMARKS,
            payload: {
                bookmarkKey: '1-2:3',
                bookmarks: bookmarksMock
            }
        });

        // Result check
        expect(globalStateMock.update).toBeCalledWith('bookmark', expectBookmarks);
    });

    test('GuidedAnswersPanel communication UPDATE_LAST_VISITED_GUIDES', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() =>
            getWebViewPanelMock((callback: WebviewMessageCallback) => {
                onDidReceiveMessageMock = callback;
            })
        );
        const lastVisitedMock = [
            {
                tree: {
                    TREE_ID: 1,
                    TITLE: 'Bookmark Title'
                },
                nodePath: [{ NODE_ID: 2 }, { NODE_ID: 3 }],
                createdAt: '2023-05-23T15:41:00.478Z'
            }
        ] as LastVisitedGuide[];

        const globalStateMock = {
            update: jest.fn()
        } as Partial<Memento>;
        initLastVisited(globalStateMock as Memento);

        // Test execution
        const panel = new GuidedAnswersPanel();
        panel.show();
        await onDidReceiveMessageMock({
            type: UPDATE_LAST_VISITED_GUIDES,
            payload: lastVisitedMock
        });

        // Result check
        expect(globalStateMock.update).toBeCalledWith('lastVisitedGuides', lastVisitedMock);
    });

    test('GuidedAnswersPanel communication unhandled action', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);

        // Test execution
        const panel = new GuidedAnswersPanel();
        panel.show();
        await onDidReceiveMessageMock({ type: 'UNHANDLED', payload: '' } as unknown as GuidedAnswerActions);

        // Result check
        expect(webViewPanelMock.webview.postMessage).not.toBeCalled();
    });

    test('GuidedAnswersPanel communication exception when sending action', async () => {
        // Mock setup
        let onDidReceiveMessageMock: WebviewMessageCallback = () => {};
        const webViewPanelMock = getWebViewPanelMock((callback: WebviewMessageCallback) => {
            onDidReceiveMessageMock = callback;
        });
        webViewPanelMock.webview.postMessage = () => Promise.reject('COMMUNICATION_ERROR');
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);

        // Test execution
        const panel = new GuidedAnswersPanel();
        panel.show();
        await onDidReceiveMessageMock({ type: WEBVIEW_READY });

        // Result check
        expect(loggerMock.error).toBeCalledWith(
            expect.stringContaining('Error'),
            expect.stringContaining('COMMUNICATION_ERROR')
        );
    });

    test('GuidedAnswersPanel restart with options', async () => {
        // Test execution
        const panel: any = new GuidedAnswersPanel();
        expect(panel.startOptions).toBe(undefined);
        expect(panel.webview).toBe(undefined);

        panel.restartWithOptions({ treeId: 0, nodeIdPath: [1, 2, 3] });
        expect(panel.startOptions).toStrictEqual({ treeId: 0, nodeIdPath: [1, 2, 3] });
    });

    test('GuidedAnswersPanel start with openToSide passed in options as true', async () => {
        // Mock setup
        let argViewType;
        let argTitle;
        let argShowOptions;
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(
            (
                viewType: string,
                title: string,
                showOptions: ViewColumn | { viewColumn: ViewColumn; preserveFocus?: boolean | undefined }
            ) => {
                argViewType = viewType;
                argTitle = title;
                argShowOptions = showOptions;
                return getWebViewPanelMock(() => {});
            }
        );
        // Test execution
        new GuidedAnswersPanel({ startOptions: { treeId: 1, openToSide: true } });

        // Result check
        expect(argViewType).toBe('sap.ux.guidedAnswer.view');
        expect(argTitle).toBe('Guided Answers extension by SAP');
        expect(argShowOptions).toBe(ViewColumn.Beside);
    });

    test('GuidedAnswersPanel restart with openToSide passed in options as true', async () => {
        // Mock setup
        const mockWebviewPanel = getWebViewPanelMock(() => {});
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => mockWebviewPanel);

        // Test execution
        const panel: any = new GuidedAnswersPanel();
        expect(panel.startOptions).toBe(undefined);
        expect(panel.webview).toBe(undefined);

        panel.restartWithOptions({ openToSide: true });
        expect(panel.startOptions).toStrictEqual({ openToSide: true });
        expect(mockWebviewPanel.reveal).toBeCalledWith(ViewColumn.Beside);
    });
});

describe('GuidedAnswersPanel deserialization', () => {
    let logErrorMock: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        logErrorMock = jest.spyOn(logger, 'logError').mockImplementation(() => null);
    });

    test('Deserialize GuidedAnswersPanel with state', () => {
        // Mock setup
        const panelMock = {
            reveal: jest.fn(),
            onDidDispose: jest.fn(),
            webview: {
                asWebviewUri: jest.fn().mockImplementation((uri) => uri),
                onDidReceiveMessage: jest.fn(),
                postMessage: jest.fn()
            }
        } as unknown as WebviewPanel;

        // Test execution and result check
        const serializer = new GuidedAnswersSerializer();
        serializer.deserializeWebviewPanel(panelMock, '{"mock": "state"}');
        expect(GuidedAnswersPanel.getInstance()?.panel).toBe(panelMock);
        expect(panelMock.reveal).toBeCalled();
        expect(panelMock.onDidDispose).toBeCalledWith(expect.any(Function));

        (panelMock.webview.onDidReceiveMessage as jest.Mock).mock.calls[0][0]({ type: WEBVIEW_READY });
        expect(panelMock.webview.postMessage).toBeCalledWith({ type: RESTORE_STATE, payload: { mock: 'state' } });
    });

    test('Deserialize GuidedAnswersPanel with state, then dispose', () => {
        // Mock setup
        const panelMock = {
            reveal: jest.fn(),
            onDidDispose: jest.fn(),
            webview: {
                asWebviewUri: jest.fn().mockImplementation((uri) => uri),
                onDidReceiveMessage: jest.fn()
            }
        } as unknown as WebviewPanel;

        // Test execution and result check
        const serializer = new GuidedAnswersSerializer();
        serializer.deserializeWebviewPanel(panelMock, '{}');
        expect(GuidedAnswersPanel.getInstance()?.panel).toBe(panelMock);
        (panelMock.onDidDispose as jest.Mock).mock.calls[0][0]();

        expect(GuidedAnswersPanel.getInstance()?.panel).toBeUndefined();
    });

    test('Deserialize GuidedAnswersPanel with empty state, should dispose', () => {
        // Mock setup
        const panelMock = {
            reveal: jest.fn(),
            dispose: jest.fn()
        } as unknown as WebviewPanel;

        // Test execution
        const serializer = new GuidedAnswersSerializer();
        serializer.deserializeWebviewPanel(panelMock, '');

        // Result check
        expect(panelMock.dispose).toBeCalled();
    });

    test('Deserialize GuidedAnswersPanel with invalid state, should dispose', () => {
        // Mock setup
        const panelMock = {
            reveal: jest.fn(),
            dispose: jest.fn()
        } as unknown as WebviewPanel;

        // Test execution
        const serializer = new GuidedAnswersSerializer();
        serializer.deserializeWebviewPanel(panelMock, '{');

        // Result check
        expect(panelMock.dispose).toBeCalled();
        expect(logErrorMock.mock.calls[0][1].toString()).toContain('JSON');
    });
});
