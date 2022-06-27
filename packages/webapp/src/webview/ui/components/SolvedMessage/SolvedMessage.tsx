import React, { ReactElement } from 'react';
import i18next from 'i18next';
import { actions } from '../../../state';
import { useSelector } from 'react-redux';
import { AppState } from '../../../types';
import './SolvedMessage.scss';
import { Dialog, DialogType, DialogFooter, IDialogProps } from '@fluentui/react/lib/Dialog';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';

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
            <Dialog hidden={isHidden} dialogContentProps={dialogContentProps} modalProps={modalProps}>
                <DialogFooter>
                    <PrimaryButton text={i18next.t('HOME')} onClick={actions.goToAllAnswers} />
                    <DefaultButton text={i18next.t('CLOSE')} onClick={toggleHidden} />
                </DialogFooter>
            </Dialog>
        </>
    );
};
