import React from 'react';
import './ErrorScreen.scss';
import ErrorIcon from './no-answers-found.svg';

/**
 * @param props - props for error screen component
 * @param props.title - the screen title
 * @param props.subtitle - the screen subtitle
 *@returns - react element to show an error page when there are no answers found
 */
export function ErrorScreen(props: Readonly<{ title: string; subtitle: string }>) {
    return (
        <div className="error-screen">
            <div className="error-screen__objects">
                <h1 className="error-screen__object__title">{props.title}</h1>
                <h2 className="error-screen__object__subtitle">{props.subtitle}</h2>
                <span className="error-screen__object__logo">
                    <ErrorIcon />
                </span>
            </div>
        </div>
    );
}
