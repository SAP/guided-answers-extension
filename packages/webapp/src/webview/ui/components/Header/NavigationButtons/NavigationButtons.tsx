import React from 'react';
import { actions } from '../../../../state';
import { VscHome, VscRefresh, VscArrowLeft } from 'react-icons/vsc';
import i18next from 'i18next';

/**
 *
 * @returns A button component navigating to all answers.
 */
export function AllAnswersButton() {
    return (
        <button
            className="guided-answer__header__navButtons home-icon"
            onClick={(): void => {
                actions.goToAllAnswers();
            }}
            title={i18next.t('ALL_ANSWERS')}
            tabIndex={0}>
            <VscHome className="guided-answer__header__navButtons__content" />{' '}
            <span className="guided-answer__header__navButtons__content__text text-underline">
                {i18next.t('ALL_ANSWERS')}
            </span>
        </button>
    );
}

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
            title={i18next.t('STEP_BACK')}
            tabIndex={0}>
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
            title={i18next.t('RESTART')}
            tabIndex={0}>
            <VscRefresh className="guided-answer__header__navButtons__content" />
            <span className="guided-answer__header__navButtons__content text-underline" style={{ marginLeft: '3px' }}>
                {i18next.t('RESTART')}
            </span>
        </button>
    );
}
