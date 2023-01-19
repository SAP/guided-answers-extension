import React from 'react';
import { render, screen } from '@testing-library/react';
import { Logo } from '../../src/webview/ui/components/Header/Logo';
import i18next from 'i18next';
import { initI18n } from '../../src/webview/i18n';

describe('<Logo />', () => {
    initI18n();

    it('Should render a Logo component', async () => {
        const { container } = render(<Logo />);
        expect(container.firstChild).toHaveClass('guided-answer__header__logoAndTitle');
        expect(screen.getByText(i18next.t('GUIDED_ANSWERS') as string).className).toEqual(
            'guided-answer__header__title'
        );
    });
});
