import { OutputChannel, window } from 'vscode';
import { logString, traceString } from '../../src/logger/logger';

describe('Tests for logging', () => {
    test('Test for logString()', () => {
        // Mock setup
        const channelMock = {
            appendLine: jest.fn()
        } as unknown as OutputChannel;
        jest.spyOn(window, 'createOutputChannel').mockImplementation(() => channelMock);

        // Test execution
        logString('LOG_MESSAGE');

        // Result check
        expect(channelMock.appendLine).toBeCalledWith('LOG_MESSAGE');
    });

    test('Test for traceString()', () => {
        // Mock setup
        const originalLogFn = console.log;
        console.log = jest.fn();

        // Test execution
        traceString('TRACE_MESSAGE');

        // Result check
        expect(console.log).toBeCalledWith('TRACE_MESSAGE');
        console.log = originalLogFn;
    });
});
