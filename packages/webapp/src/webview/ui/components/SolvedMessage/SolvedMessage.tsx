import React from 'react';
import i18next from 'i18next';
import { useSelector } from 'react-redux';
import './SolvedMessage.scss';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';
import { actions } from '../../../state';
import { AppState } from '../../../types';

export const SolvedMessage: React.FunctionComponent = () => {
    const appState = useSelector<AppState, AppState>((state) => state);
    const isHidden = !appState.guideFeedback;

    function toggleHidden(): void {
        actions.guideFeedback(null);
    }

    const dialogContentProps = {
        type: DialogType.normal,
        title: i18next.t('THANKS'),
        subText: i18next.t('THANK_YOU_TEXT')
    };

    const modalProps = {
        isDarkOverlay: true,
        className: 'solved-message-dialog'
    };

    return (
        <>
            <Dialog hidden={isHidden} dialogContentProps={dialogContentProps} modalProps={modalProps} styles={}>
                <DialogFooter>
                    <PrimaryButton text={i18next.t('HOME')} onClick={actions.goToAllAnswers} />
                    <DefaultButton text={i18next.t('CLOSE')} onClick={toggleHidden} />
                </DialogFooter>
            </Dialog>
        </>
    );
};
