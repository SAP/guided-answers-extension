import { getInstalledExtensionIds } from '../../src/enhancement';

describe('Test for getInstalledExtensionIds()', () => {
    test('Get all extensions from vscode.js mock', () => {
        // Test execution
        const installedExtensions = Array.from(getInstalledExtensionIds());

        // Result check
        expect(installedExtensions.length).toBe(2);
        expect(installedExtensions.includes('extension1')).toBe(true);
        expect(installedExtensions.includes('extension2')).toBe(true);
    });
});
