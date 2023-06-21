const URI = require('vscode-uri');

const commands = {
    executeCommand: jest.fn(),
    registerCommand: (id, handler) => handler
};

const env = {
    machineId: 'machine-id',
    sessionId: 'session-id',
    appName: 'app-name'
};

const extensions = {
    all: [{ id: 'Extension1' }, { id: 'Extension2' }],
    getExtension: jest.fn()
};

const ViewColumn = {
    Active: -1,
    Beside: -2,
    One: 1,
    Two: 2,
    Three: 3,
    Four: 4,
    Five: 5,
    Six: 6,
    Seven: 7,
    Eight: 8,
    Nine: 9
};

const window = {
    createOutputChannel: () => {
        appendLine: jest.fn();
    },
    createWebviewPanel: jest.fn().mockImplementation(() => {
        return {
            webview: {
                html: '',
                onDidReceiveMessage: jest.fn(),
                asWebviewUri: jest.fn().mockReturnValue(''),
                cspSource: ''
            },
            onDidChangeViewState: jest.fn(),
            onDidDispose: jest.fn()
        };
    }),
    createTerminal: () => {
        show: jest.fn();
        sendText: jest.fn();
    },
    showErrorMessage: jest.fn(),
    registerUriHandler: (handler) => handler,
    registerWebviewPanelSerializer: jest.fn()
};

const workspace = {
    getConfiguration: jest.fn().mockImplementation(() => {
        return {
            get: jest.fn()
        };
    }),
    onDidChangeConfiguration: jest.fn().mockReturnValue({ dispose: jest.fn() })
};

const vscode = {
    commands,
    env,
    extensions,
    Uri: URI.URI,
    ViewColumn,
    window,
    workspace
};

module.exports = vscode;
