import { focusOnElement } from '../src/webview/ui/components/utils';

describe('Test utilities', () => {
    beforeEach(() => {
        jest.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: any): any => cb());
    });

    afterEach(() => {
        //@ts-ignore
        window.requestAnimationFrame.mockRestore();
    });

    it('Should focus on element', () => {
        const spyFunc = jest.fn();
        Object.defineProperty(global.document, 'querySelector', { value: spyFunc });
        focusOnElement('.home-icon');
        expect(spyFunc).toHaveBeenCalled();
    });
});
