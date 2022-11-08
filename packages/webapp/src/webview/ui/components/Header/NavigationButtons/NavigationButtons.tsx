import React from 'react';
import { actions } from '../../../../state';
import { VscHome, VscRefresh, VscArrowLeft, VscLightbulb } from 'react-icons/vsc';
import i18next from 'i18next';
import { focusOnElement } from '../../utils';

/**
 *
 * @returns A button component navigating to all answers.
 */
const AllAnswersButton = React.memo(function AllAnswersButton() {
    focusOnElement('.home-icon');

    return (
        <button
            className="guided-answer__header__navButtons home-icon"
            onClick={(): void => {
                actions.goToAllAnswers();
            }}
            title={i18next.t('ALL_ANSWERS')}>
            <VscHome className="guided-answer__header__navButtons__content" />{' '}
            <span className="guided-answer__header__navButtons__content__text text-underline">
                {i18next.t('ALL_ANSWERS')}
            </span>
        </button>
    );
});

/**
 *
 * @returns A button component for going back one step.
 */
export function BackButton() {
    return (
        <button
            className="guided-answer__header__navButtons"
            onClick={(): void => {
                actions.goToPreviousPage();
            }}
            title={i18next.t('STEP_BACK')}>
            <VscArrowLeft className="guided-answer__header__navButtons__content" />
            <span className="guided-answer__header__navButtons__content text-underline" style={{ marginLeft: '3px' }}>
                {i18next.t('STEP_BACK')}
            </span>
        </button>
    );
}

/**
 *
 * @returns A button component for going back to the first step.
 */
export function RestartButton() {
    return (
        <button
            className="guided-answer__header__navButtons"
            onClick={(): void => {
                actions.restartAnswer();
            }}
            title={i18next.t('RESTART')}>
            <VscRefresh className="guided-answer__header__navButtons__content" />
            <span className="guided-answer__header__navButtons__content text-underline" style={{ marginLeft: '3px' }}>
                {i18next.t('RESTART')}
            </span>
        </button>
    );
}

export function GeneralFeedbackButton() {
    return (
        <button
            className="guided-answer__header__navButtons"
            onClick={(): void => {
                actions.feedbackStatus(true);
            }}
            title={i18next.t('RESTART')}>
            <svg
                className="guided-answer__header__navButtons__content"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path d="M5 10H6V9H4.58578L3 10.5858V9H1V1H12V5H13V0H0V10H2V13L5 10Z" fill="#C5C5C5" />
                <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M16 6V13H14V16L11 13H7V6H16ZM13 12V13.5858L11.4142 12H8V7H15V12H13Z"
                    fill="#C5C5C5"
                />
            </svg>
        </button>
    );
}

export { AllAnswersButton };
