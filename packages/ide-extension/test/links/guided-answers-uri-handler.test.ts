import type { LogOutputChannel } from 'vscode';
import { commands, Uri, window } from 'vscode';
import { GuidedAnswersUriHandler } from '../../src/links';

const loggerMock = { error: jest.fn(), info: jest.fn() } as Partial<LogOutputChannel>;
jest.spyOn(window, 'createOutputChannel').mockImplementation(() => loggerMock as LogOutputChannel);

describe('Test GuidedAnswersUriHandler', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Handle valid URI, should execute start command', () => {
        // Mock setup
        const executeCommandSpy = jest.spyOn(commands, 'executeCommand');

        // Test execution
        const uriHandler = new GuidedAnswersUriHandler();
        uriHandler.handleUri(Uri.parse(`vscode://saposs.sap-guided-answers-extension#/tree/1/actions/2:3`));

        // Result check
        expect(executeCommandSpy).toBeCalledWith('sap.ux.guidedAnswer.openGuidedAnswer', {
            treeId: 1,
            nodeIdPath: [2, 3]
        });
    });

    test('Handle invalid URI, should not execute start command', () => {
        // Mock setup
        const executeCommandSpy = jest.spyOn(commands, 'executeCommand');

        // Test execution
        const uriHandler = new GuidedAnswersUriHandler();
        uriHandler.handleUri(Uri.parse(`https://host.domain:123/invalid`));

        // Result check
        expect(executeCommandSpy).not.toBeCalled();
    });

    test('Calling startup command throws error', async () => {
        // Mock setup
        jest.spyOn(commands, 'executeCommand').mockRejectedValueOnce('START_ERROR');

        // Test execution
        const uriHandler = new GuidedAnswersUriHandler();
        uriHandler.handleUri(Uri.parse(`#/tree/42`));

        // Result check
        await (() => new Promise(setImmediate))();
        expect(loggerMock.error).toBeCalledWith(
            expect.stringContaining('Error'),
            expect.stringContaining('START_ERROR')
        );
    });
});
