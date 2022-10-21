import { Extension, extensions } from 'vscode';
import { getEnhancements } from '../../src/enhancement/enhancements';
import * as loggerMock from '../../src/logger/logger';

jest.mock(
    '../../src/enhancement/enhancements.json',
    () => ({
        nodeEnhancements: [
            {
                nodeId: 1,
                command: {
                    label: 'Command for node in VSCODE and SBAS',
                    exec: {
                        extensionId: 'extension.1',
                        commandId: 'command.sbasvscode'
                    },
                    environment: ['VSCODE', 'SBAS']
                }
            },
            {
                nodeId: 2,
                command: {
                    label: 'Command for node in VSCODE',
                    exec: {
                        cwd: '',
                        arguments: ['code', '--version']
                    },
                    environment: ['VSCODE']
                }
            },
            {
                nodeId: 3,
                command: {
                    label: 'Command for node in SBAS',
                    exec: {
                        cwd: '',
                        arguments: ['pwd']
                    },
                    environment: ['SBAS']
                }
            }
        ],
        htmlEnhancements: [
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

describe('Tests for getEnhancements()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetModules();
    });

    test('Test getEnhancements() for SBAS, all extensions installed', () => {
        //  Mock setup
        const log = jest.spyOn(loggerMock, 'logString').mockImplementation(() => undefined);
        jest.spyOn(extensions, 'getExtension').mockImplementation(() => true as unknown as Extension<any>);

        // Test execution
        const { nodeEnhancements, htmlEnhancements } = getEnhancements('SBAS');

        // Check results
        expect(nodeEnhancements.length).toBe(2);
        expect(nodeEnhancements.find((n) => n.nodeId === 1)).toBeDefined();
        expect(nodeEnhancements.find((n) => n.nodeId === 2)).toBeUndefined();
        expect(nodeEnhancements.find((n) => n.nodeId === 3)).toBeDefined();
        expect(htmlEnhancements.length).toBe(2);
        expect(htmlEnhancements.find((h) => h.text === 'Replace in VSCODE and SBAS')).toBeDefined();
        expect(htmlEnhancements.find((h) => h.text === 'Replace in SBAS')).toBeDefined();
        expect(log).toBeCalled();
    });

    test('Test getEnhancements() for VSCODE, all extensions installed', () => {
        //  Mock setup
        jest.spyOn(loggerMock, 'logString').mockImplementation(() => undefined);
        jest.spyOn(extensions, 'getExtension').mockImplementation(() => true as unknown as Extension<any>);

        // Test execution
        const { nodeEnhancements, htmlEnhancements } = getEnhancements('VSCODE');

        // Check results
        expect(nodeEnhancements.length).toBe(2);
        expect(nodeEnhancements.find((n) => n.nodeId === 1)).toBeDefined();
        expect(nodeEnhancements.find((n) => n.nodeId === 2)).toBeDefined();
        expect(nodeEnhancements.find((n) => n.nodeId === 3)).toBeUndefined();
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
        const { nodeEnhancements, htmlEnhancements } = getEnhancements('VSCODE');

        // Check results
        expect(nodeEnhancements.length).toBe(2);
        expect(nodeEnhancements.find((n) => n.nodeId === 1)).toBeDefined();
        expect(nodeEnhancements.find((n) => n.nodeId === 2)).toBeDefined();
        expect(htmlEnhancements.length).toBe(1);
        expect(htmlEnhancements.find((h) => h.text === 'Replace in VSCODE and SBAS')).toBeDefined();
    });
});
