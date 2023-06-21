import { focusOnElement } from '../src/webview/ui/components/utils';

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
});
