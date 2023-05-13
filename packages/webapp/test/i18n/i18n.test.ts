import i18n from 'i18next';
import { initI18n } from '../../src/webview/i18n';

jest.mock('i18next');

describe('Tests for i18n', () => {
    let originalErrorFn: typeof console.error;

    beforeAll(() => {
        originalErrorFn = console.error;
    });

    afterEach(() => {
        console.error = originalErrorFn;
    });

    test('Error handling for i18n initialization', async () => {
        //Mock setup
        jest.spyOn(i18n, 'use').mockReturnValueOnce({
            init: () => Promise.reject('I18N_ERROR')
        } as any);
        console.error = jest.fn();

        // Test execution
        initI18n();

        // Result check
        await jest.runAllTimers();
        expect(console.error).toBeCalledWith(expect.stringContaining('I18N_ERROR'));
    });
});
