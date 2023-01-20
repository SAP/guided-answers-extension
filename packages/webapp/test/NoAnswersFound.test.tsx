import React from 'react';
import { NoAnswersFound } from '../src/webview/ui/components/NoAnswersFound';
import { initI18n } from '../src/webview/i18n';
import { render } from '@testing-library/react';

describe('<NoAnswersFound />', () => {
    initI18n();

    it('Should render a NoAnswersFound component', () => {
        const { container } = render(<NoAnswersFound />);
        expect(container).toMatchSnapshot();
    });
});
