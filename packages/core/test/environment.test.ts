import { getFiltersForIde, getIde } from '../src';
import { core, devspace } from '@sap/bas-sdk';
import { IDE } from '@sap/guided-answers-extension-types';

describe('Test function getFiltersForIde()', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('Filter for SBAS environment', async () => {
        // Mock setup
        const devspaceMock = jest
            .spyOn(devspace, 'getDevspaceInfo')
            .mockImplementation(() => Promise.resolve({ pack: 'SAP Fiori' } as unknown as devspace.DevspaceInfo));

        // Test execution
        const filters = await getFiltersForIde('SBAS');

        // Result check
        expect(devspaceMock).toBeCalled();
        expect(filters).toEqual({
            component: [
                'CA-UX-IDE',
                'CA-FE-FLP-EU',
                'CA-FE-FLP-DT',
                'CA-FE-FAL',
                'CA-UI2-INT-BE',
                'CA-UI2-INT-FE',
                'CA-UI2-THD'
            ]
        });
    });

    test('Filter for invalid SBAS environment', async () => {
        // Mock setup
        const devspaceMock = jest
            .spyOn(devspace, 'getDevspaceInfo')
            .mockImplementation(() => Promise.resolve({ pack: 'INVALID_PACK' } as unknown as devspace.DevspaceInfo));

        // Test execution
        const filters = await getFiltersForIde('SBAS');

        // Result check
        expect(devspaceMock).toBeCalled();
        expect(filters).toEqual({});
    });

    test('Filter for VSCODE environment, nothing there yet, might change', async () => {
        // Mock setup
        const devspaceMock = jest
            .spyOn(devspace, 'getDevspaceInfo')
            .mockImplementation(() => Promise.resolve({ pack: 'INVALID_PACK' } as unknown as devspace.DevspaceInfo));

        // Test execution
        const filters = await getFiltersForIde('VSCODE');

        // Result check
        expect(devspaceMock).not.toBeCalled();
        expect(filters).toEqual({});
    });

    test('Filter for invalid environment, should return empty filer', async () => {
        // Test execution
        const filters = await getFiltersForIde('INVALID_ENV' as unknown as IDE);

        // Result check
        expect(filters).toEqual({});
    });
});

describe('Test function getIde()', () => {
    test('Mock environment as VSCODE', async () => {
        // Mock setup
        const coreMock = jest.spyOn(core, 'isAppStudio').mockImplementation(() => Promise.resolve(false));

        // Test execution
        const ide = await getIde();

        // Result check
        expect(ide).toBe('VSCODE');
        expect(coreMock).toBeCalled();
    });

    test('Mock environment as SBAS', async () => {
        // Mock setup
        const coreMock = jest.spyOn(core, 'isAppStudio').mockImplementation(() => Promise.resolve(true));

        // Test execution
        const ide = await getIde();

        // Result check
        expect(ide).toBe('SBAS');
        expect(coreMock).toBeCalled();
    });
});
