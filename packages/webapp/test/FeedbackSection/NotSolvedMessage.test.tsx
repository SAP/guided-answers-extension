import React from 'react';
import { render } from '@testing-library/react';
import { initI18n } from '../../src/webview/i18n';
import NotSolvedMessage from '../../src/webview/ui/components/FeedbackSection/NotSolvedMessage/NotSolvedMessage';

describe('<NotSolvedMessage/>', () => {
    initI18n();
    it('Should render a NotSolvedMessage component', () => {
        const { container } = render(<NotSolvedMessage />);
        expect(container).toMatchSnapshot();
    });
});
