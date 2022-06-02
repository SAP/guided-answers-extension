import React from 'react';
import './NoAnswersFound.scss';
import ErrorIcon from './no-answers-found.svg';

/**
 *@returns - react element to show an error page when there are no answers found
 */
export function NoAnswersFound() {
    return (
        <div className="error-screen">
            <div className="error-screen__objects">
                <h1 className="error-screen__object__title">No answers found</h1>
                <h2 className="error-screen__object__subtitle">Please modfiy search</h2>
                <span>
                    <ErrorIcon />
                </span>
            </div>
        </div>
    );
}
