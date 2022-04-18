import { commands, window } from 'vscode';
import type { Command, TerminalCommand, VSCodeCommand } from '@sap/guided-answers-extension-types';

/**
 * Type guard to check if command is VSCode command.
 *
 * @param exec - exec property of command
 * @returns true: is VSCode commmand; false: no VSCode command
 */
function isVSCodeCommand(exec: VSCodeCommand | TerminalCommand): exec is VSCodeCommand {
    return (exec as VSCodeCommand).commandId !== undefined;
}

/**
 * Type guard to check if command is terminal command.
 *
 * @param exec - exec property of command
 * @returns true: is terminal commmand; false: no terminal command
 */
function isTerminalCommand(exec: VSCodeCommand | TerminalCommand): exec is TerminalCommand {
    return (exec as TerminalCommand).cwd !== undefined;
}

/**
 * Execute command execution requests (actions from app info webview).
 *
 * @param command - the command which could be VSCode command or terminal command
 */
export function handleCommand(command: Command): void {
    if (isVSCodeCommand(command.exec)) {
        commands.executeCommand(command.exec.commandId, command.exec.argument);
    }
    if (isTerminalCommand(command.exec)) {
        const terminal = window.createTerminal(`Guided Answers Terminal`);
        if (terminal) {
            const commandString = command.exec.arguments.join(' ');
            terminal.show();
            if (command.exec.cwd) {
                terminal.sendText(`cd "${command.exec.cwd}"`);
            }
            terminal.sendText(commandString);
        } else {
            throw Error(`Unable to process command: ${JSON.stringify(command, null, 4)}`);
        }
    }
}
