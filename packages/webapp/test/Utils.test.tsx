import { focusOnElement, extractLinkInfo } from '../src/webview/ui/components/utils';

describe('Test utilities', () => {
    beforeEach(() => {
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: any): any => cb());
    });

    afterEach(() => {
        //@ts-ignore
        window.requestAnimationFrame.mockRestore();
    });

    it('should focus on an element when it exists', () => {
        // Arrange
        const mockElement = document.createElement('button');
        mockElement.setAttribute('id', 'mock-button');
        document.body.appendChild(mockElement);

        // Act
        focusOnElement('#mock-button');

        // Assert
        expect(document.activeElement).toBe(mockElement);

        // Clean up
        document.body.removeChild(mockElement);
    });

    it('should do nothing when the element does not exist', () => {
        // Arrange
        const nonExistentSelector = '#does-not-exist';

        // Act
        focusOnElement(nonExistentSelector);
    });

    it('should extract link info', () => {
        expect(
            extractLinkInfo('vscode://saposs.sap-guided-answers-extension#/tree/2827/actions/41344:41346:57775:57776')
        ).toStrictEqual({
            treeId: 2827,
            nodeIdPath: [41344, 41346, 57775, 57776]
        });
    });

    it('should extract link info, not a node link', () => {
        expect(extractLinkInfo('vscode://saposs.sap-guided-answers-extension#/some/fake/link')).toBeUndefined();
    });
});
