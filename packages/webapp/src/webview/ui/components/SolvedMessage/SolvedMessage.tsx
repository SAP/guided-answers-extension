import React, { ReactElement } from 'react';
import i18next from 'i18next';
import { actions } from '../../../state';
import { useSelector } from 'react-redux';
import { AppState } from '../../../types';
import './SolvedMessage.scss';
import { Dialog, DialogType, DialogFooter } from '@fluentui/react/lib/Dialog';
import { useBoolean } from '@fluentui/react-hooks';
import { PrimaryButton, DefaultButton } from '@fluentui/react/lib/Button';

export const SolvedMessage: React.FunctionComponent = () => {
    const appState = useSelector<AppState, AppState>((state) => state);
    const [isDraggable, { toggle: toggleIsDraggable }] = useBoolean(false);

    const dialogContentProps = {
        type: DialogType.normal,
        title: 'Thanks!',
        subText:
            'We are glad to hear that your issue has been resolved and we hope you enjoy using the Guided Answer application.'
    };

    const modalPropsStyles = { main: { maxWidth: 450 } };
    const modalProps = React.useMemo(
        () => ({
            styles: modalPropsStyles
        }),
        [isDraggable]
    );

    return (
        <>
            <Dialog hidden={false} dialogContentProps={dialogContentProps} modalProps={modalProps}>
                {/* <DialogFooter>
                    <PrimaryButton onClick={actions.goToAllAnswers} text="Home" />
                    <DefaultButton onClick={actions.guideFeedback(null)} text="Close" />
                </DialogFooter> */}
            </Dialog>
        </>
    );
};
