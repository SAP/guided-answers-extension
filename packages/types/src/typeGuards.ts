import type { TerminalCommand, VSCodeCommand } from './types';

/**
 * Type guard to check if command is VSCode command.
 *
 * @param exec - exec property of command
 * @returns true: is VSCode commmand; false: no VSCode command
 */
export function isVSCodeCommand(exec: VSCodeCommand | TerminalCommand): exec is VSCodeCommand {
    return (exec as VSCodeCommand).commandId !== undefined && (exec as VSCodeCommand).extensionId !== undefined;
}

/**
 * Type guard to check if command is terminal command.
 *
 * @param exec - exec property of command
 * @returns true: is terminal commmand; false: no terminal command
 */
export function isTerminalCommand(exec: VSCodeCommand | TerminalCommand): exec is TerminalCommand {
    return (exec as TerminalCommand).arguments !== undefined && Array.isArray((exec as TerminalCommand).arguments);
}
