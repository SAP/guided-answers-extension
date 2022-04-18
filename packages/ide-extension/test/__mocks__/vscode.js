const Uri = {
    parse: jest.fn(),
    file: (path) => new FakeUri('', '', path)
};

const window = {
    createOutputChannel: jest.fn()
};

const vscode = {
    Uri,
    window
};

module.exports = vscode;
