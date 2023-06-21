export const focusOnElement = (buttonSelector: string): void => {
    requestAnimationFrame(() => {
        const button = document.querySelector(buttonSelector) as HTMLElement;
        if (button) {
            button.focus();
        }
    });
};
