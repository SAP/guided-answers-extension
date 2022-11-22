/**
 * Defines the React 16 Adapter for Enzyme.
 *
 * @link http://airbnb.io/enzyme/docs/installation/#working-with-react-16
 * @copyright 2017 Airbnb, Inc.
 */
const enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');

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

enzyme.configure({ adapter: new Adapter() });
