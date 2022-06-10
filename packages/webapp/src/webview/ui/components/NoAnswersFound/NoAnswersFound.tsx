import React from 'react';
import './NoAnswersFound.scss';
import ErrorIcon from './no-answers-found.svg';
import i18next from 'i18next';

/**
 *@returns - react element to show an error page when there are no answers found
 */
export function NoAnswersFound() {
    return (
        <div className="error-screen">
            <div className="error-screen__objects">
                <h1 className="error-screen__object__title">{i18next.t('NO_ANSWERS_FOUND')}</h1>
                <h2 className="error-screen__object__subtitle">{i18next.t('PLEASE_MODIFY_SEARCH')}</h2>
                <span className="error-screen__object__logo">
                    <ErrorIcon />
                </span>
            </div>
        </div>
    );
}
