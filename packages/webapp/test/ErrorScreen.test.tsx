import React from 'react';
import { ErrorScreen } from '../src/webview/ui/components/ErrorScreen';
import { initI18n } from '../src/webview/i18n';
import { render } from '@testing-library/react';

describe('<ErrorScreen />', () => {
    initI18n();

    it('Should render a ErrorScreen component', () => {
        const { container } = render(<ErrorScreen />);
        expect(container).toMatchSnapshot();
    });
});
