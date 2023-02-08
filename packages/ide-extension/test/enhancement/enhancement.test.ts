import { Extension, extensions } from 'vscode';
import { getHtmlEnhancements } from '../../src/enhancement/enhancements';
import * as loggerMock from '../../src/logger/logger';

jest.mock(
    '../../src/enhancement/enhancements.json',
    () => ({
        htmlEnhancements: [
            {
                text: 'Replace in SBAS with terminal command',
                command: {
                    label: 'Command for node in VSCODE',
                    exec: {
                        cwd: '',
                        arguments: ['node', '--version']
                    },
                    environment: ['SBAS']
                }
            },
            {
                text: 'Replace in VSCODE and SBAS',
                command: {
                    exec: {
                        extensionId: 'extension.1',
                        commandId: 'command.one'
                    },
                    environment: ['VSCODE', 'SBAS']
                }
            },
            {
                text: 'Replace in SBAS',
                command: {
                    exec: {
                        extensionId: 'extension.2',
                        commandId: 'command.two'
                    },
                    environment: ['SBAS']
                }
            },
            {
                text: 'Replace in VSCODE',
                command: {
                    exec: {
                        extensionId: 'extension.3',
                        commandId: 'command.three'
                    },
                    environment: ['VSCODE']
                }
            }
        ]
    }),
    { virtual: true }
);

describe('Tests for getHtmlEnhancements()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    test('Test getHtmlEnhancements() for SBAS, all extensions installed', () => {
        //  Mock setup
        const log = jest.spyOn(loggerMock, 'logString').mockImplementation(() => undefined);
        jest.spyOn(extensions, 'getExtension').mockImplementation(() => true as unknown as Extension<any>);

        // Test execution
        const htmlEnhancements = getHtmlEnhancements('SBAS');

        // Check results
        expect(htmlEnhancements.length).toBe(3);
        expect(htmlEnhancements.find((h) => h.text === 'Replace in SBAS with terminal command')).toBeDefined();
        expect(htmlEnhancements.find((h) => h.text === 'Replace in VSCODE and SBAS')).toBeDefined();
        expect(htmlEnhancements.find((h) => h.text === 'Replace in SBAS')).toBeDefined();
        expect(log).toBeCalled();
    });

    test('Test getEnhancements() for VSCODE, all extensions installed', () => {
        //  Mock setup
        jest.spyOn(loggerMock, 'logString').mockImplementation(() => undefined);
        jest.spyOn(extensions, 'getExtension').mockImplementation(() => true as unknown as Extension<any>);

        // Test execution
        const htmlEnhancements = getHtmlEnhancements('VSCODE');

        // Check results
        expect(htmlEnhancements.length).toBe(2);
        expect(htmlEnhancements.find((h) => h.text === 'Replace in VSCODE and SBAS')).toBeDefined();
        expect(htmlEnhancements.find((h) => h.text === 'Replace in VSCODE')).toBeDefined();
    });

    test('Test getEnhancements() for VSCODE, extensions 1 and 2 installed', () => {
        //  Mock setup
        jest.spyOn(loggerMock, 'logString').mockImplementation(() => undefined);
        jest.spyOn(extensions, 'getExtension').mockImplementation((extensionId: string) => {
            return extensionId.endsWith('.1') || extensionId.endsWith('.2')
                ? (true as unknown as Extension<any>)
                : undefined;
        });

        // Test execution
        const htmlEnhancements = getHtmlEnhancements('VSCODE');

        // Check results
        expect(htmlEnhancements.length).toBe(1);
        expect(htmlEnhancements.find((h) => h.text === 'Replace in VSCODE and SBAS')).toBeDefined();
    });
});
