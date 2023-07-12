import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { Logo } from '../../src/webview/ui/components/Header/Logo';
import i18next from 'i18next';
import { initI18n } from '../../src/webview/i18n';
import { actions } from '../../src/webview/state';

jest.mock('../../src/webview/state', () => {
    return {
        actions: {
            goToHomePage: jest.fn()
        }
    };
});

describe('<Logo />', () => {
    initI18n();
    afterEach(cleanup);

    it('Should render a Logo component', async () => {
        const { container } = render(<Logo />);
        expect(container.firstChild).toHaveClass('guided-answer__header__logoAndTitle');
        expect(screen.getByText(i18next.t('GUIDED_ANSWERS') as string).className).toEqual(
            'guided-answer__header__title'
        );

        //Test click event
        const element = screen.getByTestId('logo-and-title');
        fireEvent.click(element);
        expect(actions.goToHomePage).toBeCalled();
    });
});
