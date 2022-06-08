import { commands, window } from 'vscode';
import type { Command } from '@sap/guided-answers-extension-types';
import { isTerminalCommand, isVSCodeCommand } from '@sap/guided-answers-extension-types';
import { logString } from '../logger/logger';

/**
 * Execute command execution requests.
 *
 * @param command - the command which could be VSCode command or terminal command
 */
export function handleCommand(command: Command): void {
    if (isVSCodeCommand(command.exec)) {
        logString(
            `Executing VSCode command '${
                command.exec.commandId
            }'. Full command info including arguments:\n${JSON.stringify(command, null, 2)} `
        );
        commands.executeCommand(command.exec.commandId, command.exec.argument);
    }
    if (isTerminalCommand(command.exec)) {
        const terminal = window.createTerminal(`Guided Answers extension by SAP`);
        if (terminal) {
            const commandString = command.exec.arguments.join(' ');
            terminal.show();
            logString(
                `Executing terminal command '${commandString}'. Full command info:\n${JSON.stringify(command, null, 2)}`
            );
            if (command.exec.cwd) {
                terminal.sendText(`cd "${command.exec.cwd}"`);
            }
            terminal.sendText(commandString);
        } else {
            throw Error(`Unable to process command: ${JSON.stringify(command, null, 4)}`);
        }
    }
}
