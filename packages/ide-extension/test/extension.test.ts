import { join } from 'path';
import { URI } from 'vscode-uri';
import { ExtensionContext, commands, window, WebviewPanel } from 'vscode';
import * as logger from '../src/logger/logger';
import { activate } from '../src/extension';

describe('Extension test', () => {
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
        expect(typeof context.subscriptions[0]).toBe('function');
    });

    test('execute command', () => {
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
        subscriptionsMock.mock.calls[0][1]();

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
});
