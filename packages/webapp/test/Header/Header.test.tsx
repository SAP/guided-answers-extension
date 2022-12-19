import React from 'react';
import { Header } from '../../src/webview/ui/components/Header';
import { render, cleanup } from '@testing-library/react';
import { initI18n } from '../../src/webview/i18n';

jest.mock('@vscode/webview-ui-toolkit/react', () => ({
    VSCodeTextField: () => (
        <>
            <div>SearchField</div>
        </>
    )
}));

jest.mock('react-redux', () => {
    const lib = jest.requireActual('react-redux');
    const state = { activeGuidedAnswerNode: [{ a: 0 }, { b: 0 }] };
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
