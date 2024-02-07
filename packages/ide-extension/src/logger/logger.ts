import { ExtensionLogger } from '@sap-ux/logger';
const logger = new ExtensionLogger('Guided Answers Extension');

/**
 * Log a trace message.
 *
 * @param message - trace message
 * @param args - additional arguments
 */
export function logTrace(message: string, ...args: any[]): void {
    logger.trace(message, ...args);
}

/**
 * Log debug message.
 *
 * @param message - debug message
 * @param args - additional arguments
 */
export function logDebug(message: string, ...args: any[]): void {
    logger.debug(message, ...args);
}

/**
 * Log debug message.
 *
 * @param message - info message
 * @param args - additional arguments
 */
export function logInfo(message: string, ...args: any[]): void {
    logger.info(message, ...args);
}

/**
 * Log warning message.
 *
 * @param message - warning message
 * @param args - additional arguments
 */
export function logWarn(message: string, ...args: any[]): void {
    logger.warn(message, ...args);
}

/**
 * Log error message.
 *
 * @param error - error message or object
 * @param args - additional arguments
 */
export function logError(error: string | Error, ...args: any[]): void {
    logger.error(error as string, ...args);
}
