import React from 'react';
import i18next from 'i18next';
import LogoIcon from './sap-logo.svg';
import { actions } from '../../../../state';

/**
 *
 * @returns A logo for the header
 */
export function Logo() {
    return (
        <button
            className="guided-answer__header__logoAndTitle"
            id="logo-and-title"
            type="button"
            onClick={() => actions.goToHomePage()}
            title={i18next.t('HOME')}>
            <span id="sap-logo">
                <LogoIcon />
            </span>
            <h1 className="guided-answer__header__title">{i18next.t('GUIDED_ANSWERS')}</h1>
        </button>
    );
}
