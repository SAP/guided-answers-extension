import { LogOutputChannel, window } from 'vscode';
import { logTrace, logDebug, logInfo, logWarn, logError } from '../../src/logger/logger';

describe('Tests for logging', () => {
    let channelMock: LogOutputChannel;
    const testArgs = ['string', { object: 'value' }, ['arr1', 'arr2']];
    beforeAll(() => {
        channelMock = {
            trace: jest.fn(),
            debug: jest.fn(),
            info: jest.fn(),
            warn: jest.fn(),
            error: jest.fn()
        } as unknown as LogOutputChannel;
        jest.spyOn(window, 'createOutputChannel').mockImplementation(() => channelMock);
    });
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Test for logTrace() without arguments', () => {
        // Test execution
        logTrace('TRACE_MESSAGE');

        // Result check
        expect(channelMock.trace).toBeCalledWith('TRACE_MESSAGE');
    });

    test('Test for logTrace() with arguments', () => {
        // Test execution
        logTrace('TRACE_MESSAGE', ...testArgs);

        // Result check
        expect(channelMock.trace).toBeCalledWith('TRACE_MESSAGE', ...testArgs);
    });

    test('Test for logDebug() without arguments', () => {
        // Test execution
        logDebug('DEBUG_MESSAGE');

        // Result check
        expect(channelMock.debug).toBeCalledWith('DEBUG_MESSAGE');
    });

    test('Test for logDebug() with arguments', () => {
        // Test execution
        logDebug('DEBUG_MESSAGE', ...testArgs);

        // Result check
        expect(channelMock.debug).toBeCalledWith('DEBUG_MESSAGE', ...testArgs);
    });

    test('Test for logInfo() without arguments', () => {
        // Test execution
        logInfo('INFO_MESSAGE');

        // Result check
        expect(channelMock.info).toBeCalledWith('INFO_MESSAGE');
    });

    test('Test for logInfo() with arguments', () => {
        // Test execution
        logInfo('INFO_MESSAGE', ...testArgs);

        // Result check
        expect(channelMock.info).toBeCalledWith('INFO_MESSAGE', ...testArgs);
    });

    test('Test for logWarn() without arguments', () => {
        // Test execution
        logWarn('WARN_MESSAGE');

        // Result check
        expect(channelMock.warn).toBeCalledWith('WARN_MESSAGE');
    });

    test('Test for logWarn() with arguments', () => {
        // Test execution
        logWarn('WARN_MESSAGE', ...testArgs);

        // Result check
        expect(channelMock.warn).toBeCalledWith('WARN_MESSAGE', ...testArgs);
    });

    test('Test for logError() without arguments', () => {
        // Test execution
        logError('ERROR_MESSAGE');

        // Result check
        expect(channelMock.error).toBeCalledWith('ERROR_MESSAGE');
    });

    test('Test for logError() with arguments', () => {
        // Test execution
        logError('ERROR_MESSAGE', ...testArgs);

        // Result check
        expect(channelMock.error).toBeCalledWith('ERROR_MESSAGE', ...testArgs);
    });
});
