import { commands, Uri } from 'vscode';
import * as logger from '../../src/logger/logger';
import { GuidedAnswersUriHandler } from '../../src/links';

describe('Test GuidedAnswersUriHandler', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(logger, 'logString').mockImplementation(() => null);
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
});
