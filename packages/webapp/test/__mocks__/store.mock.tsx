import React from 'react';

import { configureStore } from '@reduxjs/toolkit';
import { render as rtlRender } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';

import '@testing-library/jest-dom';

import { Provider } from 'react-redux';
import { I18nextProvider } from 'react-i18next';

import type { AppState } from '../../src/webview/types';
import { reducer } from '../../src/webview/state/reducers';

import i18nMock from './i18n.mock';

interface WrapperProps {
    children?: React.ReactNode;
}

function render(ui: React.ReactElement, { initialState = {} } = {}): RenderResult {
    const store = configureStore({ reducer: reducer, preloadedState: initialState });

    const _wrapper = ({ children }: WrapperProps) => {
        return (
            <Provider store={store}>
                <I18nextProvider i18n={i18nMock}>{children}</I18nextProvider>
            </Provider>
        );
    };

    return rtlRender(ui, { wrapper: _wrapper });
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { render };

export const appState: AppState = {
    networkStatus: 'OK',
    query: '',
    guidedAnswerTreeSearchResult: {
        trees: [],
        resultSize: 1,
        productFilters: [],
        componentFilters: []
    },
    activeGuidedAnswerNode: [],
    activeNodeSharing: null,
    betaFeatures: false,
    guideFeedback: true,
    selectedProductFilters: [],
    selectedComponentFilters: [],
    pageSize: 20,
    feedbackStatus: false,
    feedbackResponse: false,
    bookmarks: {},
    activeScreen: 'HOME',
    lastVisitedGuides: [],
    quickFilters: []
};
