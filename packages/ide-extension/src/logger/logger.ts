import { window } from 'vscode';

const channel = window.createOutputChannel(`Guided Answers Extension`);

/**
 * Log a message to the output console.
 *
 * @param message - log message
 */
export function logString(message: string): void {
    channel.appendLine(message);
}
