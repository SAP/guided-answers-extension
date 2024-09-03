import React from 'react';
import { fireEvent, screen } from '@testing-library/react';
import type { RenderResult } from '@testing-library/react';

import { initIcons } from '@sap-ux/ui-components';

import type { AppState } from '../../src/webview/types';
import { SearchField } from '../../src/webview/ui/components/Header/SearchField';

import * as treeUtils from '../../src/webview/features/Trees/Trees.utils';

import { render, appState } from '../__mocks__/storeMock';

describe('<SearchField />', () => {
    initIcons();

    const renderSearch = (initialState: AppState): RenderResult =>
        render(<SearchField />, {
            initialState: initialState
        });

    test('Should render a SearchField component, on search screen', () => {
        const { container } = renderSearch(appState);
        expect(container).toMatchSnapshot();
    });

    test('Should render a SearchField component, on home screen', () => {
        const { container } = renderSearch({ ...appState, activeScreen: 'HOME' });
        expect(container).toMatchSnapshot();
    });

    test('Should render a SearchField component, search value entered', async () => {
        const spyOnSearch = jest.spyOn(treeUtils, 'fetchTreesData');
        renderSearch(appState);

        const searchInput = screen.getByRole('searchbox');
        if (searchInput) {
            fireEvent.focus(searchInput);
            fireEvent.input(searchInput, { target: { value: 'test' } });
            fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter', keyCode: 13 });
        }

        // TODO: Need to fix the redux store
        // expect(spyOnSearch).toHaveBeenCalledWith('test');
    });
});
