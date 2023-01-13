import React from 'react';
import { actions } from '../../src/webview/state';
import { render, fireEvent, cleanup } from '@testing-library/react';
import { screen } from '@testing-library/dom';
import { AllAnswersButton, BackButton, RestartButton } from '../../src/webview/ui/components/Header/NavigationButtons';
import { initI18n } from '../../src/webview/i18n';

jest.mock('../../src/webview/state', () => {
    return {
        actions: {
            goToAllAnswers: jest.fn(),
            goToPreviousPage: jest.fn(),
            restartAnswer: jest.fn()
        }
    };
});
describe('<AllAnswersButton />', () => {
    initI18n();
    afterEach(cleanup);

    it('Should render a AllAnswersButton component', () => {
        const { container } = render(<AllAnswersButton />);
        expect(container).toMatchSnapshot();

        //Test click event
        const element = screen.getByTestId('all-answers-button');
        fireEvent.click(element);
        expect(actions.goToAllAnswers).toBeCalled();
    });
});

describe('<BackButton />', () => {
    initI18n();
    afterEach(cleanup);

    it('Should render a BackButton component', () => {
        const { container } = render(<BackButton />);
        expect(container).toMatchSnapshot();

        //Test click event
        const element = screen.getByTestId('back-button');
        fireEvent.click(element);
        expect(actions.goToPreviousPage).toBeCalled();
    });
});

describe('<RestartButton />', () => {
    initI18n();
    afterEach(cleanup);

    it('Should render a RestartButton component', () => {
        const { container } = render(<RestartButton />);
        expect(container).toMatchSnapshot();

        //Test click event
        const element = screen.getByTestId('restart-button');
        fireEvent.click(element);
        expect(actions.restartAnswer).toBeCalled();
    });
});
