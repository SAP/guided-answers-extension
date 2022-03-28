import { configureStore } from '@reduxjs/toolkit';
import { bindActionCreators } from 'redux';
import { communicationMiddleware } from './middleware';
import { getInitialState, reducer } from './reducers';
import * as AllActions from './actions';

export const store = configureStore({
    reducer,
    preloadedState: getInitialState(),
    devTools: false,
    middleware: [communicationMiddleware]
});

// bind actions to store
export const actions = bindActionCreators(AllActions, store.dispatch);
