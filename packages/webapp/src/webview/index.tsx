import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { App } from './ui/components/App';
import { actions, store } from './state';
import { initI18n } from './i18n';

/**
 * Initialization of i18n, icons
 */
initI18n();

/**
 * Render app
 */
render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById('root') as HTMLElement
);

/**
 * Fire action which is captured in hosting app (ide-extension) to signal that we are ready to receive messages
 */
actions.webviewReady();

/**Once webview is ready we focus to search field */
document.getElementById('search-field')?.focus();
