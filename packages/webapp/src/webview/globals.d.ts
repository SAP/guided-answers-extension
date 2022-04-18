interface Window {
    vscode: {
        postMessage: (message: string | JSON) => void;
    };
}
