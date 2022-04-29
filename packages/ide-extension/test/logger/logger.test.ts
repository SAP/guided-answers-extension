import { OutputChannel, window } from 'vscode';
import { logString } from '../../src/logger/logger';

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
});
