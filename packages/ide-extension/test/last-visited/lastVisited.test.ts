import type { LogOutputChannel, Memento } from 'vscode';
import { window } from 'vscode';
import { LastVisitedGuide } from '@sap/guided-answers-extension-types';
import { initLastVisited, getAllLastVisitedGuides, updateLastVisitedGuides } from '../../src/last-visited';

const loggerMock = { error: jest.fn() } as Partial<LogOutputChannel>;
jest.spyOn(window, 'createOutputChannel').mockImplementation(() => loggerMock as LogOutputChannel);

let mockGlobalState: jest.Mocked<Memento>;

const mockLastVisited: LastVisitedGuide[] = [
    {
        tree: {
            TREE_ID: 1,
            TITLE: 'Bookmark 1 Title',
            DESCRIPTION: 'Bookmark 1 Description',
            PRODUCT: 'Product 1, Product 2',
            COMPONENT: 'Component 1, Component 2'
        },
        nodePath: [{ NODE_ID: 1, TITLE: 'Node 1' }],
        createdAt: 'time'
    },
    {
        tree: {
            TREE_ID: 2,
            TITLE: 'Bookmark 2 Title',
            DESCRIPTION: 'Bookmark 2 Description',
            PRODUCT: 'Product 1, Product 2',
            COMPONENT: 'Component 1, Component 2'
        },
        nodePath: [{ NODE_ID: 2, TITLE: 'Node 2' }],
        createdAt: 'time2'
    }
] as LastVisitedGuide[];

describe('LastVisited functions', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockGlobalState = {
            get: jest.fn(),
            update: jest.fn(() => Promise.resolve())
        } as unknown as jest.Mocked<Memento>;
    });

    test('get all last visited', () => {
        mockGlobalState.get.mockReturnValue(mockLastVisited);

        initLastVisited(mockGlobalState);
        const lastVisited = getAllLastVisitedGuides();
        expect(lastVisited).toEqual(mockLastVisited);
    });

    test('update last visited', async () => {
        initLastVisited(mockGlobalState);
        await updateLastVisitedGuides(mockLastVisited);

        expect(mockGlobalState.update).toHaveBeenCalledWith('lastVisitedGuides', mockLastVisited);
    });

    test('log error when updating last visited fails', async () => {
        const error = new Error('Update error');
        mockGlobalState.update.mockReturnValue(Promise.reject(error));

        initLastVisited(mockGlobalState);
        await updateLastVisitedGuides(mockLastVisited);

        expect(loggerMock.error).toHaveBeenCalledWith(
            expect.stringContaining('Error updating lastVisitedGuides'),
            expect.objectContaining({ message: 'Update error' })
        );
    });
});
