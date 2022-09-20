import type { Action, Middleware } from 'redux';
const vscode = {
    postMessage: jest.fn()
};
window.acquireVsCodeApi = (): typeof vscode => vscode;
import { store } from '../../src/webview/state/store';
import { communicationMiddleware } from '../../src/webview/state/middleware';
declare global {
    interface Window {
        acquireVsCodeApi: () => void;
    }
}

export interface DOMEventListenerMock {
    simulateEvent: (name: string, value: object) => void;
    cleanDomEventListeners: () => void;
    domEventListeners: { [k: string]: Array<Function> };
}

export const mockDomEventListener = (handler: Document | Window | Element = document): DOMEventListenerMock => {
    const domEventListeners: { [k: string]: Array<Function> } = {};
    // Mock for add event listener
    handler.addEventListener = jest.fn((event, cb) => {
        if (!domEventListeners[event]) {
            domEventListeners[event] = [];
        }
        domEventListeners[event].push(cb as Function);
    });
    handler.removeEventListener = jest.fn((event, cb) => {
        if (domEventListeners[event]) {
            const index = domEventListeners[event].findIndex((storedCb) => storedCb === cb);
            if (index !== -1) {
                domEventListeners[event].splice(index, 1);
            }
            if (domEventListeners[event].length === 0) {
                delete domEventListeners[event];
            }
        }
    });
    return {
        simulateEvent: (name: string, value: object): void => {
            if (domEventListeners[name]) {
                for (const cb of domEventListeners[name]) {
                    cb(value);
                }
            }
        },
        cleanDomEventListeners: (): void => {
            for (const eventName in domEventListeners) {
                delete domEventListeners[eventName];
            }
        },
        domEventListeners
    };
};

describe('Middleware', () => {
    const windowEventListenerMock = mockDomEventListener(window);
    const create = (): {
        store: typeof store;
        next: { mockReturnValue: (action: Action) => void };
        invoke: (action: Action) => Middleware;
    } => {
        const next = jest.fn();
        const invoke = (action: Action): Middleware => communicationMiddleware(store)(next)(action);
        return { store, next, invoke };
    };
    const { next, invoke } = create();
    const action = { type: 'TEST' };
    next.mockReturnValue(action);

    it('Handle messages', () => {
        // Post message
        const spyPostMessage = jest.spyOn(vscode, 'postMessage');
        const spyDispatch = jest.spyOn(store, 'dispatch');
        invoke(action);
        expect(next).toHaveBeenCalledWith(action);
        expect(spyPostMessage).toBeCalledTimes(1);
        expect(1).toEqual(1);
        // jsdom doesn't set proper orign for post message event. In middleware we check for window.origin, mock it here
        (window as { origin: string }).origin = '';
        // Receive message
        window.postMessage({ type: 'TEST' }, '*');
        // Check that message was dispatched
        setTimeout(() => {
            expect(spyDispatch).toBeCalledTimes(1);
        }, 1000);
    });

    it('Recive message - mismatching origin', () => {
        const spyDispatch = jest.spyOn(store, 'dispatch');
        windowEventListenerMock.simulateEvent('message', { origin: 'dummy' });
        expect(spyDispatch).toBeCalledTimes(0);
    });

    it('Recive message - valid state', () => {
        const spyDispatch = jest.spyOn(store, 'dispatch');
        windowEventListenerMock.simulateEvent('message', { origin: '', data: { type: 'action' } });
        expect(spyDispatch).toBeCalledTimes(1);
    });

    it('Recive message - data without type', () => {
        const spyDispatch = jest.spyOn(store, 'dispatch');
        windowEventListenerMock.simulateEvent('message', { origin: '', data: {} });
        expect(spyDispatch).toBeCalledTimes(0);
    });
});
