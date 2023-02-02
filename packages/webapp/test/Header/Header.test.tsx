import { treeMock } from '../__mocks__/treeMock';
import React from 'react';
import { Header } from '../../src/webview/ui/components/Header';
import { render, cleanup } from '@testing-library/react';
import { initI18n } from '../../src/webview/i18n';

jest.mock('react-redux', () => {
    const lib = jest.requireActual('react-redux');
    const state = {
        activeGuidedAnswerNode: [{ a: 0 }, { b: 0 }],
        guidedAnswerTreeSearchResult: {
            trees: [treeMock],
            resultSize: 1,
            productFilters: [],
            componentFilters: []
        },
        selectedProductFilters: ['Product A'],
        selectedComponentFilters: ['comp-a']
    };
    return {
        ...lib,
        useSelector: () => state
    };
});

describe('<Header />', () => {
    initI18n();
    afterEach(cleanup);

    it('Should render a Header component without the navigation buttons', () => {
        const { container } = render(<Header showSub={true} showLogo={true} showNavButons={false} showSearch={true} />);
        expect(container).toMatchSnapshot();
    });

    it('Should render a Header component with the navigation buttons', () => {
        const { container } = render(
            <Header showSub={false} showLogo={false} showNavButons={true} showSearch={false} />
        );
        expect(container).toMatchSnapshot();
    });
});
