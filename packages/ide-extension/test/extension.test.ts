import { join } from 'path';
import { URI } from 'vscode-uri';
import type { LogOutputChannel } from 'vscode';
import { ExtensionContext, commands, window, WebviewPanel } from 'vscode';
import * as telemetry from '../src/telemetry/telemetry';
import * as logger from '../src/logger/logger';
import { activate } from '../src/extension';
import * as bookmarkMock from '../src/bookmarks';

const loggerMock = { error: jest.fn(), info: jest.fn() } as Partial<LogOutputChannel>;
jest.spyOn(window, 'createOutputChannel').mockImplementation(() => loggerMock as LogOutputChannel);

describe('Extension test', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('activate is function', () => {
        expect(typeof activate === 'function').toBeTruthy();
    });

    test('activate extension', () => {
        // Mock setup
        const subscriptionsMock = jest.spyOn(commands, 'registerCommand');
        const context = {
            subscriptions: []
        };
        jest.spyOn(telemetry, 'initTelemetry').mockImplementationOnce(
            () =>
                ({
                    client: 'mocked'
                } as any)
        );

        // Test execution
        activate(context as unknown as ExtensionContext);

        // Result check
        expect(subscriptionsMock.mock.calls[0][0]).toBe('sap.ux.guidedAnswer.openGuidedAnswer');
        expect(context.subscriptions.length).toBe(3);
        // First subscription should be telemetry
        expect((context.subscriptions[0] as any).client).toBe('mocked');
        // Second subscription should be start command handler
        expect(typeof context.subscriptions[1]).toBe('function');
        // Third subscription should be Uri handler
        expect(typeof (context.subscriptions[2] as any).handleUri).toBe('function');
    });

    test('activate extension even if telemetry throws error', () => {
        // Mock setup
        const subscriptionsMock = jest.spyOn(commands, 'registerCommand');
        const context = {
            subscriptions: []
        };
        jest.spyOn(telemetry, 'initTelemetry').mockImplementationOnce(() => {
            throw Error();
        });

        // Test execution
        activate(context as unknown as ExtensionContext);

        // Result check
        expect(subscriptionsMock.mock.calls[0][0]).toBe('sap.ux.guidedAnswer.openGuidedAnswer');
        expect(context.subscriptions.length).toBe(2);
    });

    test('active, error during initialization with global storage', () => {
        // Mock setup
        const context = {
            subscriptions: []
        };
        jest.spyOn(bookmarkMock, 'initBookmarks').mockImplementationOnce(() => {
            throw Error('BOOKMARK_ERROR');
        });

        // Test execution
        activate(context as unknown as ExtensionContext);

        // Result check
        expect(context.subscriptions.length).toBeGreaterThan(0);
        expect(loggerMock.error).toHaveBeenCalledWith(
            expect.stringContaining('Error'),
            expect.objectContaining({ message: 'BOOKMARK_ERROR' })
        );
    });

    test('execute command', async () => {
        // Mock setup
        const subscriptionsMock = jest.spyOn(commands, 'registerCommand');
        jest.spyOn(telemetry, 'initTelemetry').mockImplementationOnce(() => ({} as any));
        const webViewPanelMock = {
            webview: {
                html: '',
                onDidReceiveMessage: jest.fn(),
                asWebviewUri: jest.fn().mockReturnValue(''),
                cspSource: ''
            },
            onDidChangeViewState: jest.fn(),
            onDidDispose: jest.fn(),
            reveal: jest.fn()
        } as unknown as WebviewPanel;
        jest.spyOn(window, 'createWebviewPanel').mockImplementation(() => webViewPanelMock);
        const context = {
            subscriptions: []
        };

        // Test execution
        activate(context as unknown as ExtensionContext);
        await subscriptionsMock.mock.calls[0][1]();

        // Result check
        const replaceStr = URI.file(join(__dirname, '..')).with({ scheme: 'vscode-resource' }).toString();
        expect(
            webViewPanelMock.webview.html.replace(
                new RegExp(`${replaceStr}`.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'),
                ''
            )
        ).toMatchSnapshot();
        expect(webViewPanelMock.reveal).toBeCalled();
        expect(loggerMock.info).toBeCalled();
    });

    test('execute command with parameters', async () => {
        // Mock setup
        const subscriptionsMock = jest.spyOn(commands, 'registerCommand');
        jest.spyOn(telemetry, 'initTelemetry').mockImplementationOnce(() => ({} as any));
        const context = {
            subscriptions: []
        };

        // Test execution
        activate(context as unknown as ExtensionContext);
        await subscriptionsMock.mock.calls[0][1]({ treeId: 0, nodeIdPath: [1, 2, 3] });
        // Result check
        expect(loggerMock.info).toBeCalledWith('Guided Answers command called. Options:', {
            devSpace: '',
            ide: 'VSCODE',
            startOptions: { treeId: 0, nodeIdPath: [1, 2, 3] }
        });
    });

    test('execute command error occurs', async () => {
        // Mock setup
        jest.spyOn(logger, 'logInfo').mockImplementation(() => {
            throw Error('ERROR');
        });
        jest.spyOn(telemetry, 'initTelemetry').mockImplementationOnce(() => ({} as any));
        const showErrorMessageMock = jest.spyOn(window, 'showErrorMessage');
        const subscriptionsMock = jest.spyOn(commands, 'registerCommand');
        const context = {
            subscriptions: []
        };

        // Test execution
        activate(context as unknown as ExtensionContext);
        await subscriptionsMock.mock.calls[0][1]();

        // Result check
        expect(showErrorMessageMock.mock.calls[0][0]).toContain('ERROR');
    });
});
