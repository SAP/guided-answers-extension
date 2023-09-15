import { commands, window } from 'vscode';
import type { Command } from '@sap/guided-answers-extension-types';
import { isTerminalCommand, isVSCodeCommand } from '@sap/guided-answers-extension-types';
import { logError, logInfo } from '../logger/logger';

/**
 * Execute command execution requests.
 *
 * @param command - the command which could be VSCode command or terminal command
 */
export function handleCommand(command: Command): void {
    if (isVSCodeCommand(command.exec)) {
        const commandId = command.exec.commandId;
        const argument = command.exec.argument;
        logInfo(`Executing VSCode command '${commandId}'. Full command info including arguments:`, command);
        commands
            .executeCommand(commandId, argument)
            ?.then(undefined, (error) => logError(`Error while executing command '${commandId}'`, error));
    }
    if (isTerminalCommand(command.exec)) {
        const terminal = window.createTerminal(`Guided Answers extension by SAP`);
        if (terminal) {
            const commandString = command.exec.arguments.join(' ');
            terminal.show();
            logInfo(`Executing terminal command '${commandString}'. Full command info:`, command);
            if (command.exec.cwd) {
                terminal.sendText(`cd "${command.exec.cwd}"`);
            }
            terminal.sendText(commandString);
        } else {
            throw Error(`Unable to process command: ${JSON.stringify(command, null, 4)}`);
        }
    }
}
