import i18next from 'i18next';
import type { Middleware, MiddlewareAPI, Dispatch, Action } from 'redux';
import type { GuidedAnswerActions } from '@sap/guided-answers-extension-types';
import type { AppState } from '../types';

declare let window: Window;
declare let acquireVsCodeApi: () => typeof window['vscode'];

/**
 * Communication between IDE extension and web view is realized through the communication middleware
 * window event listener for incoming messages in to the webview
 * post message for outgoing messages to the host.
 *
 * @param store - redux store
 * @returns - redux middleware
 */
export const communicationMiddleware: Middleware<
    Dispatch<GuidedAnswerActions>,
    AppState,
    Dispatch<GuidedAnswerActions>
> = (store: MiddlewareAPI) => {
    // Add event handler, this will dispatch incomming state updates
    window.addEventListener('message', (event: MessageEvent) => {
        if (event.origin === window.origin) {
            console.log(i18next.t('MESSAGE_RECEIVED'), event);
            if (event.data && typeof event.data.type === 'string') {
                store.dispatch(event.data);
            }
        } else {
            console.error(i18next.t('UNKNOWN_ORIGIN') + event.origin);
        }
    });
    try {
        window.vscode = acquireVsCodeApi();
    } catch (e) {
        console.error(i18next.t('ERROR_NOT_RUNNING_IN_WEB_VIEW'));
    }
    return (next: Dispatch<GuidedAnswerActions>) =>
        (action): Action => {
            action = next(action);
            if (action && typeof action.type === 'string' && !action.type.startsWith('[view]')) {
                window.vscode.postMessage(action);
                console.log(i18next.t('REACT_ACTION_POSTED'), action);
            }
            return action;
        };
};
