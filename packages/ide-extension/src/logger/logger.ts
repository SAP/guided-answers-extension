import type { OutputChannel } from 'vscode';
import { window } from 'vscode';

let channel: OutputChannel;

/**
 * Log a message to the output console.
 *
 * @param message - log message
 */
export function logString(message: string): void {
    if (!channel) {
        channel = window.createOutputChannel(`Guided Answers Extension`);
    }
    channel.appendLine(message);
}

/**
 * Add a message to trace.
 *
 * @param message - trace message
 */
export function traceString(message: string): void {
    console.log(message);
}
