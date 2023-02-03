import { join } from 'path';
import { URI } from 'vscode-uri';
import { ExtensionContext, commands, window, WebviewPanel } from 'vscode';
import type TelemetryReporter from '@vscode/extension-telemetry';
import * as telemetry from '../src/telemetry/telemetry';
import * as logger from '../src/logger/logger';
import { activate } from '../src/extension';

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

        // Test execution
        activate(context as unknown as ExtensionContext);

        // Result check
        expect(subscriptionsMock.mock.calls[0][0]).toBe('sap.ux.guidedAnswer.openGuidedAnswer');
        expect(context.subscriptions.length).toBe(2);
        // First subscription should be telemetry
        expect(typeof (context.subscriptions[0] as TelemetryReporter).sendTelemetryEvent).toBe('function');
        // Second subscription should be start command handler
        expect(typeof context.subscriptions[1]).toBe('function');
    });

    test('activate extension even if telemetry throws error', () => {
        // Mock setup
        const subscriptionsMock = jest.spyOn(commands, 'registerCommand');
        const context = {
            subscriptions: []
        };
        jest.spyOn(logger, 'logString').mockImplementation(() => null);
        jest.spyOn(telemetry, 'initTelemetry').mockImplementationOnce(() => {
            throw Error();
        });

        // Test execution
        activate(context as unknown as ExtensionContext);

        // Result check
        expect(subscriptionsMock.mock.calls[0][0]).toBe('sap.ux.guidedAnswer.openGuidedAnswer');
        expect(context.subscriptions.length).toBe(1);
    });

    test('execute command', async () => {
        // Mock setup
        const loggerMock = jest.spyOn(logger, 'logString').mockImplementation(() => null);
        const subscriptionsMock = jest.spyOn(commands, 'registerCommand');
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
        expect(loggerMock).toBeCalled();
    });

    test('execute command with parameters', async () => {
        // Mock setup
        const loggerMock = jest.spyOn(logger, 'logString').mockImplementation(() => null);
        const subscriptionsMock = jest.spyOn(commands, 'registerCommand');
        const context = {
            subscriptions: []
        };

        // Test execution
        activate(context as unknown as ExtensionContext);
        await subscriptionsMock.mock.calls[0][1]({ treeId: 0, nodeIdPath: [1, 2, 3] });
        // Result check
        expect(loggerMock.mock.calls[0][0]).toContain('{"treeId":0,"nodeIdPath":[1,2,3]}');
    });

    test('execute command error occurs', async () => {
        // Mock setup
        jest.spyOn(logger, 'logString').mockImplementation(() => {
            throw Error('ERROR');
        });
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
