import { commands, window } from 'vscode';
import type { LogOutputChannel, Terminal } from 'vscode';
import { Command } from '@sap/guided-answers-extension-types';
import { handleCommand } from '../../src/enhancement';

const loggerMock = { error: jest.fn(), info: jest.fn() } as Partial<LogOutputChannel>;
jest.spyOn(window, 'createOutputChannel').mockImplementation(() => loggerMock as LogOutputChannel);

describe('Test for handleCommand()', () => {
    const env = process.env;

    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
        process.env = { ...env };
    });

    afterEach(() => {
        process.env = env;
    });

    test('Execute VSCode command', () => {
        //  Mock setup
        const executeCommandMock = jest.spyOn(commands, 'executeCommand');
        const command: Partial<Command> = {
            exec: {
                extensionId: 'TEST.EXTENSION',
                commandId: 'TEST.COMMAND',
                argument: {
                    fsPath: 'TESTPATH'
                }
            }
        };

        // Test execution
        handleCommand(command as Command);

        // Check results
        expect(executeCommandMock).toBeCalledTimes(1);
        expect(executeCommandMock).toBeCalledWith('TEST.COMMAND', { fsPath: 'TESTPATH' });
        expect(loggerMock.info).toBeCalledWith(expect.stringContaining('TEST.COMMAND'), {
            exec: { extensionId: 'TEST.EXTENSION', commandId: 'TEST.COMMAND', argument: { fsPath: 'TESTPATH' } }
        });
    });

    test('VSCode command throws error', async () => {
        //  Mock setup
        jest.spyOn(commands, 'executeCommand').mockRejectedValueOnce('COMMAND_ERROR');
        const command: Partial<Command> = {
            exec: {
                extensionId: 'TEST.EXTENSION',
                commandId: 'TEST.COMMAND'
            }
        };

        // Test execution
        handleCommand(command as Command);

        // Check results
        await (() => new Promise(setImmediate))();
        expect(loggerMock.error).toBeCalledWith(expect.stringContaining('Error'), 'COMMAND_ERROR');
    });

    test('Execute terminal command without cwd', () => {
        //  Mock setup
        const terminalMock: Partial<Terminal> = {
            show: jest.fn(),
            sendText: jest.fn()
        };
        jest.spyOn(window, 'createTerminal').mockImplementationOnce(() => terminalMock as Terminal);
        const command: Partial<Command> = {
            exec: {
                arguments: ['TEST.ARG']
            }
        };

        // Test execution
        handleCommand(command as Command);

        // Check results
        expect(terminalMock.show).toBeCalledTimes(1);
        expect(terminalMock.sendText).toHaveBeenCalledTimes(1);
        expect(terminalMock.sendText).toBeCalledWith('TEST.ARG');
        expect(loggerMock.info).toBeCalledWith(expect.stringContaining('TEST.ARG'), {
            exec: { arguments: ['TEST.ARG'] }
        });
    });

    test('Execute terminal command with cwd', () => {
        //  Mock setup
        const terminalMock: Partial<Terminal> = {
            show: jest.fn(),
            sendText: jest.fn()
        };
        jest.spyOn(window, 'createTerminal').mockImplementationOnce(() => terminalMock as Terminal);
        const command: Partial<Command> = {
            exec: {
                cwd: 'TEST/CWD',
                arguments: ['ARG.ONE', 'ARG.TWO']
            }
        };

        // Test execution
        handleCommand(command as Command);

        // Check results
        expect(terminalMock.show).toBeCalledTimes(1);
        expect(terminalMock.sendText).toHaveBeenCalledTimes(2);
        expect(terminalMock.sendText).toHaveBeenNthCalledWith(1, 'cd "TEST/CWD"');
        expect(terminalMock.sendText).toHaveBeenNthCalledWith(2, 'ARG.ONE ARG.TWO');
        expect(loggerMock.info).toBeCalledWith(expect.stringContaining('ARG.ONE ARG.TWO'), {
            exec: { cwd: 'TEST/CWD', arguments: ['ARG.ONE', 'ARG.TWO'] }
        });
    });

    test('Execute terminal creation error, ', () => {
        //  Mock setup
        jest.spyOn(window, 'createTerminal').mockImplementationOnce(() => undefined as unknown as Terminal);
        const command: Partial<Command> = {
            exec: {
                cwd: 'TEST/CWD',
                arguments: ['ARG.ONE', 'ARG.TWO']
            }
        };

        // Test execution
        try {
            handleCommand(command as Command);
            fail('handleCommand() should have thrown error but did not');
        } catch (error) {
            // Check results
            expect(error).toBeDefined();
        }
    });
});
