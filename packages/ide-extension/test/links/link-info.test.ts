import { extractLinkInfo, generateExtensionLink, generateWebLink } from '../../src/links/link-info';

describe('Test extractLinkInfo()', () => {
    test('Valid link with information', () => {
        expect(extractLinkInfo('https://host.domain/any/path/index.html#/tree/1/actions/2:3:4:5:6 ')).toEqual({
            treeId: 1,
            nodeIdPath: [2, 3, 4, 5, 6]
        });
    });

    test('Link with tree only', () => {
        expect(extractLinkInfo('anything#/tree/1978')).toEqual({ treeId: 1978 });
    });

    test('Invalid link', () => {
        expect(extractLinkInfo('#/tree/1/actions/2:3:4:5:6wrong')).toBeUndefined();
    });
});

describe('Test generateExtensionLink()', () => {
    test('Generate VSCode link with tree id', () => {
        expect(generateExtensionLink({ treeId: 123 })).toEqual(
            'vscode://saposs.sap-guided-answers-extension#/tree/123'
        );
    });
    test('Generate VSCode link with tree id and node id path', () => {
        expect(generateExtensionLink({ treeId: 123, nodeIdPath: [4, 5, 6, 7] })).toEqual(
            'vscode://saposs.sap-guided-answers-extension#/tree/123/actions/4:5:6:7'
        );
    });
});

describe('Test generateWebLink()', () => {
    test('Generate SAP web link with tree id', () => {
        expect(generateWebLink('host//', { treeId: 123 })).toEqual('host///dtp/viewer/index.html#/tree/123');
    });
});
