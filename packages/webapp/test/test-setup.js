class ResizeObserver {
    observe() {
        // do nothing
    }
    unobserve() {
        // do nothing
    }
    disconnect() {
        // do nothing
    }
}

window.ResizeObserver = ResizeObserver;

global.vscode = { postMessage: (e) => {} };

global.window = window;

global.acquireVsCodeApi = () => typeof window['vscode'];
