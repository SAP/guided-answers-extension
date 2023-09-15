import type { LogOutputChannel } from 'vscode';
import { window } from 'vscode';

let channel: LogOutputChannel;

/**
 * Get instance of LogOutputChannel, create if not initialized.
 *
 * @returns - LogOutputChannel
 */
function getLogOutputChannel(): LogOutputChannel {
    if (!channel) {
        channel = window.createOutputChannel(`Guided Answers Extension`, { log: true });
    }
    return channel;
}

/**
 * Log a trace message.
 *
 * @param message - trace message
 * @param args - additional arguments
 */
export function logTrace(message: string, ...args: any[]): void {
    const logOutputChannel = getLogOutputChannel();
    if (args.length <= 0) {
        logOutputChannel.trace(message);
    } else {
        logOutputChannel.trace(message, ...args);
    }
}

/**
 * Log debug message.
 *
 * @param message - debug message
 * @param args - additional arguments
 */
export function logDebug(message: string, ...args: any[]): void {
    const logOutputChannel = getLogOutputChannel();
    if (args.length <= 0) {
        logOutputChannel.debug(message);
    } else {
        logOutputChannel.debug(message, ...args);
    }
}

/**
 * Log debug message.
 *
 * @param message - info message
 * @param args - additional arguments
 */
export function logInfo(message: string, ...args: any[]): void {
    const logOutputChannel = getLogOutputChannel();
    if (args.length <= 0) {
        logOutputChannel.info(message);
    } else {
        logOutputChannel.info(message, ...args);
    }
}

/**
 * Log warning message.
 *
 * @param message - warning message
 * @param args - additional arguments
 */
export function logWarn(message: string, ...args: any[]): void {
    const logOutputChannel = getLogOutputChannel();
    if (args.length <= 0) {
        logOutputChannel.warn(message);
    } else {
        logOutputChannel.warn(message, ...args);
    }
}

/**
 * Log error message.
 *
 * @param error - error message or object
 * @param args - additional arguments
 */
export function logError(error: string | Error, ...args: any[]): void {
    const logOutputChannel = getLogOutputChannel();
    if (args.length <= 0) {
        logOutputChannel.error(error);
    } else {
        logOutputChannel.error(error, ...args);
    }
}
