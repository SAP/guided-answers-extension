interface Window {
    vscode: {
        postMessage: (message: string | JSON) => void;
        setState: (state: string) => void;
    };
}
