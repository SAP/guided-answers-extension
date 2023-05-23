import { initBookmarks, getAllBookmarks, updateBookmarks } from '../../src/bookmarks';
import type { Memento } from 'vscode';
import { logString } from '../../src/logger/logger';

jest.mock('../../src/logger/logger', () => ({
    logString: jest.fn()
}));

let mockGlobalState: jest.Mocked<Memento>;

const mockBookmarks = {
    '1-1': {
        tree: {
            TREE_ID: 1,
            TITLE: 'Bookmark 1 Title',
            DESCRIPTION: 'Bookmark 1 Description',
            PRODUCT: 'Product 1, Product 2',
            COMPONENT: 'Component 1, Component 2',
            AVAILABILITY: 'test',
            FIRST_NODE_ID: 1
        },
        nodePath: [
            {
                NODE_ID: 1,
                TITLE: 'Forty-two',
                BODY: `<p>Body of solution to all questions <img src="services/backend.xsjs?cmd=viewImage&amp;id=1" width="200" height="100" /><script>alert("evil");</script></p>`,
                QUESTION: 'Answer to the Ultimate Question of Life, the Universe, and Everything',
                EDGES: [
                    {
                        LABEL: 'Yes',
                        TARGET_NODE: 42,
                        ORD: 1
                    }
                ]
            }
        ]
    },
    '2-1': {
        tree: {
            TREE_ID: 2,
            TITLE: 'Bookmark 1 Title',
            DESCRIPTION: 'Bookmark 1 Description',
            PRODUCT: 'Product 1, Product 2',
            COMPONENT: 'Component 1, Component 2',
            AVAILABILITY: 'test',
            FIRST_NODE_ID: 1
        },
        nodePath: [
            {
                NODE_ID: 1,
                TITLE: 'Forty-two',
                BODY: `<p>Body of solution to all questions <img src="services/backend.xsjs?cmd=viewImage&amp;id=1" width="200" height="100" /><script>alert("evil");</script></p>`,
                QUESTION: 'Answer to the Ultimate Question of Life, the Universe, and Everything',
                EDGES: [
                    {
                        LABEL: 'Yes',
                        TARGET_NODE: 42,
                        ORD: 1
                    }
                ]
            }
        ]
    }
};

beforeEach(() => {
    mockGlobalState = {
        get: jest.fn(),
        update: jest.fn(() => Promise.resolve())
    } as unknown as jest.Mocked<Memento>;
});

describe('Bookmark functions', () => {
    test('initialize bookmarks', () => {
        initBookmarks(mockGlobalState);
        expect(mockGlobalState).toBeDefined();
    });

    test('get all bookmarks', () => {
        mockGlobalState.get.mockReturnValue(mockBookmarks);

        initBookmarks(mockGlobalState);
        const bookmarks = getAllBookmarks();
        expect(bookmarks).toEqual(mockBookmarks);
    });

    test('get all bookmarks when no bookmarks are set', () => {
        mockGlobalState.get.mockReturnValue(undefined);

        initBookmarks(mockGlobalState);
        const bookmarks = getAllBookmarks();
        expect(bookmarks).toEqual({});
    });

    test('update bookmarks', async () => {
        initBookmarks(mockGlobalState);
        await updateBookmarks(mockBookmarks);

        expect(mockGlobalState.update).toHaveBeenCalledWith('bookmark', mockBookmarks);
    });

    test('delete all bookmarks', async () => {
        initBookmarks(mockGlobalState);
        await updateBookmarks({});

        expect(mockGlobalState.update).toHaveBeenCalledWith('bookmark', undefined);
    });

    test('log error when updating bookmarks fails', async () => {
        const error = new Error('Update error');
        mockGlobalState.update.mockReturnValue(Promise.reject(error));

        initBookmarks(mockGlobalState);
        await updateBookmarks(mockBookmarks);

        expect(logString).toHaveBeenCalledWith(`Error updating bookmarks.\n${error.toString()}`);
    });
});
