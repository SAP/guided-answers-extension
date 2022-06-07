import { isTerminalCommand, isVSCodeCommand } from '../src/typeGuards';
import type { TerminalCommand, VSCodeCommand } from '../src/types';

describe('Test type guards', () => {
    test('Test isTerminalCommand', () => {
        expect(isTerminalCommand({ cwd: 'ANY_CWD', arguments: [] } as TerminalCommand)).toBeTruthy();
        expect(isTerminalCommand({ cwd: 'OTHER_CWD' } as TerminalCommand)).toBeFalsy();
        expect(isTerminalCommand({ commandId: 'ANY_COMMANDID' } as VSCodeCommand)).toBeFalsy();
    });
    test('Test isVSCodeCommand', () => {
        expect(isVSCodeCommand({ commandId: 'ANY_COMMAND', extensionId: 'ANY_EXT' } as VSCodeCommand)).toBeTruthy();
        expect(isVSCodeCommand({ commandId: 'ANY_COMMANDID' } as VSCodeCommand)).toBeFalsy();
        expect(isVSCodeCommand({ cwd: 'ANY_COMMAND' } as TerminalCommand)).toBeFalsy();
    });
});
