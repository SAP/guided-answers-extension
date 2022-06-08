import React from 'react';
import i18next from 'i18next';
import LogoIcon from './sap-logo.svg';

/**
 *
 * @returns A logo for the header
 */
export function Logo() {
    return (
        <div className="guided-answer__header__logoAndTitle">
            <span id="sap-logo">
                <LogoIcon />
            </span>
            <h1 className="guided-answer__header__title">{i18next.t('GUIDED_ANSWERS')}</h1>
        </div>
    );
}
