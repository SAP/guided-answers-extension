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
        <div
            className="guided-answer__header__navButtons"
            onClick={(): void => {
                actions.goToAllAnswers();
            }}>
            <VscHome className="guided-answer__header__navButtons__content" />{' '}
            <span className="guided-answer__header__navButtons__content">{i18next.t('ALL_ANSWERS')}</span>
        </div>
    );
}

/**
 *
 * @returns A button component for going back one step.
 */
export function BackButton() {
    return (
        <div
            className="guided-answer__header__navButtons"
            onClick={(): void => {
                actions.goToPreviousPage();
            }}>
            <VscArrowLeft className="guided-answer__header__navButtons__content" />
            <span className="guided-answer__header__navButtons__content">{i18next.t('STEP_BACK')}</span>
        </div>
    );
}

/**
 *
 * @returns A button component for going back to the first step.
 */
export function RestartButton() {
    return (
        <div
            className="guided-answer__header__navButtons"
            onClick={(): void => {
                actions.restartAnswer();
            }}>
            <VscRefresh className="guided-answer__header__navButtons__content" />
            <span className="guided-answer__header__navButtons__content">{i18next.t('RESTART')}</span>
        </div>
    );
}
